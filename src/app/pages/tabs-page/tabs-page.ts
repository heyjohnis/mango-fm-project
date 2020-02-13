import { Component, OnInit } from '@angular/core';
import { UserData } from '../../providers/user-data';

@Component({
  templateUrl: 'tabs-page.html'
})
export class TabsPage implements OnInit {

  public custLogin = false;

  constructor(private userData: UserData){

  }

  async ngOnInit() {
  //  this.checkLoginStatus();
    this.listenForLoginEvents();
    this.checkAuthUser();
  }

  listenForLoginEvents() {
    window.addEventListener('user:00', () => {
      this.setMenuAuth('00');
    });   
    window.addEventListener('user:01', () => {
      this.setMenuAuth('01');
    });   
    window.addEventListener('user:10', () => {
      this.setMenuAuth('10');
    });   
    window.addEventListener('user:99', () => {
      this.setMenuAuth('99');
    });   
  }

  // checkLoginStatus() {
  //   return this.userData.isLoggedIn().then(type => {
  //     console.log("loggedIn check : " , type);
  //   });
  // }

  checkAuthUser(){
    return this.userData.getAuthUser().then(user_type =>{
      this.setMenuAuth(user_type);
    });
  }

  setMenuAuth(user_type){
    console.log("tab user_code : ", user_type);
    if(user_type == '00' || user_type == '01'){
      this.custLogin = true;  
    } else {
      this.custLogin = false;
    }
  }
}
