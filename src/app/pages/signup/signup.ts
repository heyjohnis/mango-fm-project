import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';

import { UserData } from '../../providers/user-data';

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
  public cust_id;

  constructor(
    public router: Router,
    public userData: UserData,
    public storage: Storage,
    public alertCtl: AlertController,
    public api: Api
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

        this.api.post('user/regist', formData).subscribe( (user_id: any) => {
          this.storage.set('user_id', user_id);
          this.signup.user_id = user_id;
          
          this.userData.getUser(this.signup);
        }, (err) => {
          console.log("server reg user : ",err);
        });
        this.storage.set("hasLoggedIn", true);
      }).catch((err) => {
        console.log("sign-up-err: ",err); 
        this.signupErrorMessage(err.code, err.message);
      });
    }
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

}

