import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

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
    public storage: Storage
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
      });
    }
  }
}

