import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserData } from '../../providers/user-data';
import { UserOptions } from '../../interfaces/user-options';
import { AlertController } from '@ionic/angular'

@Component({
	selector: 'page-login',
	templateUrl: 'login.html',
	styleUrls: ['./login.scss'],
})
export class LoginPage {

	login: UserOptions = { uid: '', user_id: '', email: '', username: '', password: '', user_type: '', file_nm: '' };
	submitted = false;

	constructor(
		public userData: UserData,
		public router: Router,
		public alertCtl: AlertController
	) { }

	onLogin(form: NgForm) {
		this.submitted = true;

		if (form.valid) {
			this.userData.login(this.login)
				.then((res) => {
					console.log('로그인 성공!', res);
					this.router.navigateByUrl('/app/tabs/home');
				}).catch((err) => {
					console.log('error : ', err);

					this.loginErrorMessage(err.code);
				});
		}
	}

	loginErrorMessage(code): void {
		let error_message = "";
		if(code == "auth/invalid-email") error_message = "이메일 형식이 맞지 않습니다.";
		if(code == "auth/wrong-password") error_message = "패스워드 정확하지 않습니다.";
		if(code == "auth/user-not-found") error_message = "가입되지 않은 이메일 계정입니다."
		
		this.errorAlert(error_message).then(()=>{			
			this.login.email = "";
			this.login.password = "";
			this.router.navigated = false;
			this.router.navigateByUrl('/login');
		});

	}

	async errorAlert(text){
		const alert = this.alertCtl.create({
			header: '오류',
			//subHeader: 'Subtitle',
			message: text,
			buttons: ['Cancel']
		});  
		await (await alert).present();
	}

	onSignup() {
		this.router.navigateByUrl('/signup');
	}
}
