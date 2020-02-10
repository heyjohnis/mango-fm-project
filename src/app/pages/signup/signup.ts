import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';

import { UserData } from '../../providers/user-data';

import { UserOptions } from '../../interfaces/user-options';


@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  styleUrls: ['./signup.scss'],
})
export class SignupPage implements OnInit {
  signup: UserOptions = { uid: '', user_id: '', email: '', username: '', password: '',   file_nm: ''};
  submitted = false;
  public cust_id;

  constructor(
    public router: Router,
    public userData: UserData,
    public storage: Storage,
    public alertCtl: AlertController
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
    if (form.valid) {
      this.userData.signup(this.signup, this.cust_id).then((res) => {
        this.userData.removeStorage();
        this.userData.regUser(res);
      }).catch(err => {
        console.log('error: ', err);
        this.signupErrorMessage(err.code);
      });
    }
  }

	signupErrorMessage(code): void {
    let error_message = "";
    
    console.log("error code : ",code);
		if(code == "auth/invalid-email") error_message = "이메일 형식이 맞지 않습니다.";
		if(code == "auth/wrong-password") error_message = "패스워드 정확하지 않습니다.";
    if(code == "auth/user-not-found") error_message = "가입되지 않은 이메일 계정입니다.";
    if(code == "auth/weak-password") error_message = "패스워드를 최소 6자이상 입력하세요";
    if(code == "auth/email-already-in-use") error_message = "이미 등록된 이메일입니다.";
    
		
		this.errorAlert(error_message).then(()=>{			
			this.signup.email = "";
			this.signup.password = "";
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

}

