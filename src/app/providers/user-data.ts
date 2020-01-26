import { Injectable } from '@angular/core';
import { Events } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import * as firebase from 'firebase';
// import * as admin from 'firebase-admin';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Api } from './api/api';
import { Router } from '@angular/router';
import { UserOptions } from '../interfaces/user-options';


@Injectable({
  providedIn: 'root'
})
export class UserData {
  _favorites: string[] = [];
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';
  //API_SERVER = 'http://jhouse.tjc.or.kr:8080';
  API_SERVER = 'http://localhost:8080';
  user: UserOptions = { uid: '', user_id: '', email: '', username: '', password: '', file_nm: ''};

  constructor(
	public http: HttpClient,
	public events: Events,
	public storage: Storage,
	public api: Api,
	public router: Router
  ) { }

  hasFavorite(sessionName: string): boolean {
	return (this._favorites.indexOf(sessionName) > -1);
  }

  addFavorite(sessionName: string): void {
	this._favorites.push(sessionName);
  }

  removeFavorite(sessionName: string): void {
	const index = this._favorites.indexOf(sessionName);
	if (index > -1) {
	  this._favorites.splice(index, 1);
	}
  }


	login(value): Promise<any> {
		return firebase.auth().signInWithEmailAndPassword(value.email, value.password).then((res) => {
			this.removeStorage();
			let formData = new FormData();
			formData.append("firebase_id", res.user.uid);
			formData.append("user_id", '');
			return this.api.post('user/getUser', formData).subscribe( (res: any) => {
				this.user.user_id = res.user_id;
				this.storage.set('user_data', res).then(()=>{
					this.storage.set(this.HAS_LOGGED_IN, true).then(() => {
						console.log("HAS_LOGGED_IN : ", this.HAS_LOGGED_IN);
						return window.dispatchEvent(new CustomEvent('user:login'));
					});
				});
			});
		});
  	}

	


  signup(value) {
	return new Promise<any>((resolve, reject) => {
	  this.storage.set(this.HAS_LOGGED_IN, true);
	  firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
	  //.then(res => resolve(res), err => reject(err));
	  .then((res) => {
		console.log("sign-up-res: ",res);

		let user = firebase.auth().currentUser;
		user.updateProfile({displayName: value.username});

		let formData = new FormData();
		formData.append("firebase_id", res.user.uid);
		formData.append("email", res.user.email);
		formData.append("user_nm", value.username);
		
		// Spring 회원가입
		this.regUser(formData);

	  }).catch((err) => {
		console.log("sign-up-err: ",err); 
	  });
	});
  }

  regUser(user){
	return this.api.post('user/regist', user).subscribe( (resp) => {
	  console.log("화원등록 : " , resp);
	  this.setUserId(resp);
	  this.user.user_id = resp.toString();
	  this.getUser(this.user);
	  this.router.navigateByUrl('/app/tabs/home');
	}, (err) => {
	// admin.auth().deleteUser(user.uid);
	  console.log("회원등록 실패로 firebase에는 등록됨 :  ",user.uid);
	});
  }

  getUser(user: UserOptions) {
	let formData = new FormData();
	formData.append("firebase_id", user.uid);
	formData.append("user_id", user.user_id);
	return this.api.post('user/getUser', formData).subscribe( (res) => {
	  console.log("server User Data : ", res);
	  this.setUserData(res);
	});
  }

//   logout(): Promise<any> {
// 	return this.storage.remove(this.HAS_LOGGED_IN).then(() => {
// 	 firebase.auth().signOut().then(() => {
// 		console.log('Logout');
// 	  }).catch((error) => {
// 		console.log(error);
// 	  });
// 	  return this.storage.clear();
// 	}).then(() => {
// 	  this.events.publish('user:logout');
// 	  //location.reload();
// 	});
//   }

	logout(): Promise<any>{
		this.storage.clear();
		return firebase.auth().signOut().then(()=> {
			window.dispatchEvent(new CustomEvent('user:logout'));
		});
	}


  setUserData(data: any){
	this.storage.set('user_data', data).then(()=>{
	  console.log("login : set user data ", data);
	  this.router.navigateByUrl('/app/tabs/home');
	});
  }

  getUserData(): Promise<any>{
	return this.storage.get('user_data').then((data) => {
	  return data;
	});
  }

  setUsername(username: string): Promise<any> {
	return this.storage.set('username', username);
  }

  getUsername(): Promise<string> {
	return this.storage.get('username').then((value) => {
	  return value;
	});
  }

  isLoggedIn(): Promise<boolean> {
	return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
	  console.log("isLoogedIn : " , value);
	  return value === true;
	});
  }

  setUserId(userId: any): Promise<any> {
	return this.storage.set('user_id', userId);
  }

  async getUserId(): Promise<string> {
	return await this.storage.get('user_id').then((value) => {
	  // console.log(value);
	  return value;
	});
  }

  removeStorage(){
	this.storage.clear();
  }

  checkHasSeenTutorial(): Promise<string> {
	return this.storage.get(this.HAS_SEEN_TUTORIAL).then((value) => {
	  return value;
	});
  }

}
