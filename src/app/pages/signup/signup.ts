import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AlertController, ModalController } from '@ionic/angular';

import { UserData } from '../../providers/user-data';
import { FaModalPage } from './fa-modal/fa-modal.page';

import { UserOptions } from '../../interfaces/user-options';
import { Api } from '../../providers/api/api';
import * as firebase from 'firebase';

@Component({
	selector: 'page-signup',
	templateUrl: 'signup.html',
	styleUrls: ['./signup.scss'],
})
export class SignupPage implements OnInit {
	signup: UserOptions = { uid: '', user_id: '', email: '', username: '', password: '', user_type: '',  file_nm: ''};
	submitted = false;

	public cust_id = '';
	public company_cd: string = '01';
	public fa_code: string = '';
	public branch_nm: string = '';
	public user_type = '01';

	public is_fa = "n";
	public check_fa_code: boolean = true;

	constructor(
		public router: Router,
		public userData: UserData,
		public storage: Storage,
		public alertCtl: AlertController,
		public api: Api,
		public modal: ModalController
	) {}

	ngOnInit(){
		this.storage.get('cust_id').then((cust_id)=>{
			this.cust_id = cust_id;
			console.log("ngOnInit() : ", this.cust_id);
		});
	}

	onSignup(form: NgForm) {

		this.submitted = true;
		console.log("cust_id", this.cust_id);

		if (form.valid && this.check_fa_code) {

			this.storage.clear;

			firebase.auth().createUserWithEmailAndPassword(this.signup.email, this.signup.password).then((res) => {
				console.log("sign-up-res: ",res);

				let user = firebase.auth().currentUser;
				user.updateProfile({displayName: this.signup.username});

				this.signup.uid = res.user.uid;

				let formData = new FormData();
				formData.append("firebase_id", res.user.uid);
				formData.append("email", this.signup.email);
				formData.append("user_nm", this.signup.username);
				formData.append("cust_id", this.cust_id);
				formData.append("company_cd", this.company_cd);
				formData.append("branch_nm", this.branch_nm);
				formData.append("fa_code", this.fa_code);
				formData.append("user_type", this.user_type);

				this.api.post('user/regist', formData).subscribe( (user_id: any) => {
					if(this.user_type != '01') this.successAlert();
					this.storage.set('user_id', user_id);
					this.storage.set('hasLoggedIn', true);
					this.signup.user_id = user_id;
					this.userData.getUser(this.signup);
					window.dispatchEvent(new CustomEvent('user:01'));
				}, (err) => {
					console.log("server reg user : ",err);
				});
			}).catch((err) => {
				console.log("sign-up-err: ",err); 
				this.signupErrorMessage(err.code, err.message);
			});
		}
	}

	async successAlert(){
		const alert = await this.alertCtl.create({
			header: '회원가입완료',
			//subHeader: 'Subtitle',
			message: '회원가입이 완료 되었습니다. <br/> 가입승인을 기다리세요.',
			buttons: [
				{
					text:'확인',
					handler: ()=>{
						this.router.navigateByUrl('/login');
					}
				}
			]
		});  
		await alert.present();
	}

	onChangeUserType(code: any){
		this.user_type = code.detail.value;
		this.is_fa = this.user_type == '01' ? "n" : "y";
	}

	selectCompanyCd(){

	}

	signupErrorMessage(code, message): void {
		let error_message = "";
		
		console.log("error code : ",code);
		if(code == "auth/invalid-email") {
			this.signup.email = "";
			error_message = "이메일 형식이 맞지 않습니다.";
		}
		else if(code == "auth/wrong-password") {
			this.signup.password = "";
			error_message = "패스워드 정확하지 않습니다.";
		} 
		else if(code == "auth/weak-password") {
			this.signup.password = "";
			error_message = "패스워드를 최소 6자이상 입력하세요";
		}
		else if(code == "auth/email-already-in-use") {
			this.signup.email = "";
			error_message = "이미 등록된 이메일입니다.";
		}
		else error_message = message;
		
		this.errorAlert(error_message).then(()=>{			
			this.router.navigated = false;
			this.router.navigateByUrl('/signup');
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
	
	selectSegment(){

	}

	async faModal() {
		const modal = await this.modal.create({
			component: FaModalPage
		});

		modal.onDidDismiss().then((m)=>{
			console.log(m.data.fa_code);
			this.fa_code = m.data.fa_code;
		});

		return await modal.present();
	}

	ionModalDidDismiss(){

	}

	checkFaCode(){
		let faCode = this.fa_code.toUpperCase();
		console.log("input fa_code: ", faCode);
		if(faCode.length > 5) {
			let formData = new FormData();
			formData.append('fa_code', faCode);
			this.api.post('user/isRegFaCode', formData).subscribe( (res: any) => {
				console.log('check fa_code res : ',res);
				if(res.reg_fa_code > 0) this.check_fa_code = false;
				else this.check_fa_code = true;
			});
		}

	}
	

}

