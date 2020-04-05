
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';

import { MenuController, Platform, ToastController } from '@ionic/angular';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Storage } from '@ionic/storage';

import { UserData } from './providers/user-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  appPages = [
    {
      title: '홈',
      url: '/app/tabs/home',
      icon: 'home'
    },
    {
      title: '고객',
      url:'/app/tabs/customer',
      icon: 'contacts'
    },
    {
      title: '자산',
      url:'/app/tabs/asset',
      icon: 'logo-usd'
    },
    {
      title: '소개',
      url: '/app/tabs/about',
      icon: 'information-circle'
    }
  ];

  loggedIn = false;
  dark = false;
  custLogin = false;


  auth: any = {
    menu01: false,
    menu02: false,
    menu03: false,
    menu04: false,
    menu05: false,
  }


  constructor(
    private menu: MenuController,
    private platform: Platform,
    private router: Router,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private userData: UserData,
    private swUpdate: SwUpdate,
    private toastCtrl: ToastController,
  ) {
    this.initializeApp();
  }

  async ngOnInit() {
    this.checkLoginStatus();
    this.listenForLoginEvents();
    this.checkAuthUser();


    this.swUpdate.available.subscribe(async res => {
      const toast = await this.toastCtrl.create({
        message: 'Update available!',
        showCloseButton: true,
        position: 'bottom',
        closeButtonText: `Reload`
      });

      await toast.present();

      toast
        .onDidDismiss()
        .then(() => this.swUpdate.activateUpdate())
        .then(() => window.location.reload());
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  checkLoginStatus() {
    return this.userData.isLoggedIn().then(loggedIn => {
      return this.updateLoggedInStatus(loggedIn);
    });
  }

  checkAuthUser(){
    return this.userData.getAuthUser().then(user_type =>{
      this.setMenuAuth(user_type);
    });
  }

  updateLoggedInStatus(loggedIn: boolean) {
    setTimeout(() => {
      this.loggedIn = loggedIn;
    }, 300);
  }

  listenForLoginEvents() {
    window.addEventListener('user:login', () => {
      this.updateLoggedInStatus(true);
    });

    window.addEventListener('user:signup', () => {
      this.updateLoggedInStatus(true);
    });

    window.addEventListener('user:logout', () => {
      console.log("listenForLoginEvents : logout"); 
      this.updateLoggedInStatus(false);
      this.auth.menu01 = false;
      this.auth.menu02 = false;
      this.auth.menu03 = false;
      this.auth.menu04 = false;
      this.auth.menu05 = false;
    });
    // login_code
    window.addEventListener('user:00', () => {
      console.log("listenForLoginEvents : 00"); 
      this.setMenuAuth("00");
    });

    // 고객 01
    window.addEventListener('user:01', () => {
      console.log("listenForLoginEvents : user:01 고객"); 
      this.setMenuAuth("01");
    });    
    // 고객 01
    window.addEventListener('user:10', () => {
      console.log("listenForLoginEvents : user:10 FA"); 
      this.setMenuAuth("10");
    });    
    // 고객 01
    window.addEventListener('user:99', () => {
      console.log("listenForLoginEvents : user:99 관리자"); 
      this.setMenuAuth("99");
    });    


  }

  setMenuAuth(code: string){
    if(code != "") {
      this.loggedIn = true;

      if(code == "00") {  // 로그인 코드
        this.auth.menu01 = false;
      }
      else if(code == "01") { // 고객
        this.auth.menu01 = false;
      }
      else if (code == "10") {  // FA
        this.auth.menu01 = true;
        this.auth.menu02 = true;
        this.auth.menu03 = true;
      } else if(code == "99") { // 관리자
        this.auth.menu01 = true;
        this.auth.menu02 = true;
        this.auth.menu03 = true;
        this.auth.menu04 = true;
        this.auth.menu05 = true;
      }
      console.log("setMenuAuth : ", code);
    }
  }

  logout() {
    this.userData.logout().then(() => {
      return this.router.navigateByUrl('/login');
    });
  }

  openTutorial() {
    this.menu.enable(false);
    this.storage.set('ion_did_tutorial', false);
    this.router.navigateByUrl('/tutorial');
  }

  gotoAdminUser(){
    // this.menu.enable(false);
    this.router.navigateByUrl('/admin/user');
  }
}
