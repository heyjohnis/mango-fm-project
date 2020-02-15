import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { UserData } from '../../providers/user-data';
import { UserOptions } from '../../interfaces/user-options';
import { AlertController } from '@ionic/angular';
import * as firebase from 'firebase';
import { Api } from '../../providers/api/api';

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
		public alertCtl: AlertController,
		public storage: Storage,
		public api: Api
	) { }

	onLogin(form: NgForm) {
		this.submitted = true;

		if (form.valid) {

			firebase.auth().signInWithEmailAndPassword(this.login.email, this.login.password).then((res) => {
				this.storage.clear();

				let formData = new FormData();
				formData.append("firebase_id", res.user.uid);
				formData.append("user_id", '');
				return this.api.post('user/getUser', formData).subscribe( (res: any) => {
	
					window.dispatchEvent(new CustomEvent('user:'+res.user_type));
					window.dispatchEvent(new CustomEvent('user:login'));

					this.storage.set('user_data', res).then(()=>{
						this.storage.set('hasLoggedIn', true).then(() => {
							this.gotoUrl(res.user_type, res.cust_id);
	``					});
					});
				});
			}).catch((err) => {
				console.log('error : ', err);
				this.loginErrorMessage(err.code);	
			});
		}
	}

	gotoUrl(type, cust_id){
		// 고객 자산현황으로 이동
		console.log("goto url : ", type, cust_id);
		if(type == '01') 
			this.storage.set('cust_id', cust_id).then(()=>{
				return this.router.navigateByUrl('/app/tabs/my-asset');
			});
		else 
			return this.router.navigateByUrl('/app/tabs/home');
	}

	loginErrorMessage(code): void {
		let error_message = "";
		if(code == "auth/invalid-email") {
			this.login.email = "";
			error_message = "이메일 형식이 맞지 않습니다.";
		}
		else if(code == "auth/wrong-password") {
			this.login.password = "";
			error_message = "패스워드 정확하지 않습니다.";
		}
		if(code == "auth/user-not-found") {
			this.login.email = "";
			error_message = "가입되지 않은 이메일 계정입니다.";
		} 
		
		this.errorAlert(error_message).then(()=>{			
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
