import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { UserData } from '../../providers/user-data';
import { Api } from '../../providers/api/api';
import { UserOptions } from '../../interfaces/user-options';
import * as firebase from 'firebase';

declare var company_cds: any;


@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
  styleUrls: ['./account.scss'],
})
export class AccountPage implements AfterViewInit {
  username: string;
  email: string;
  user_id: string;
  url: string =  "./assets/img/none.png";
  firebase_id: string; 
  company_cd: string;
  branch_nm: string; 
  fa_code: string; 


  public birthYYYY: string;
  public birthMM: string;

  company_cds: any;

  constructor(
    public alertCtrl: AlertController,
    public router: Router,
    public userData: UserData,
    public storage: Storage,
    public api: Api,
  ) { 
		this.company_cds = company_cds;

  }


  ngAfterViewInit() {
    //this.getUserData();
  }

  ionViewDidEnter(){
    this.getUserData();
  }

  updatePicture() {
    console.log('Clicked to update picture');
  }

  // Present an alert with the current username populated
  // clicking OK will update the username and display it
  // clicking Cancel will close the alert and do nothing
  async changePassword() {
    const alert = await this.alertCtrl.create({
      header: '패스워드 변경',
      buttons: [
        'Cancel',
        {
          text: 'Ok',
          handler: (data: any) => {
            this.setPassword(data.password);
          }
        }
      ],
      inputs: [
        {
          type: 'password',
          name: 'password',
          value: '',
          placeholder: '변경할 패스워드를 입력하세요'
        }
      ]
    });
    await alert.present();
  }

  getUserData() {
    this.userData.getUserData().then( (data) => {
      console.log("data : " , data);
      this.username = data.user_nm;
      this.user_id = data.user_id;
      this.email = data.email;
      this.firebase_id = data.firebase_id;
      this.company_cd = data.company_cd;
      this.branch_nm = data.branch_nm;
      this.fa_code = data.fa_code;
      console.log("file_nm : ", data.file_nm);
      if(data.file_nm != null && data.file_nm != '') {
        this.url = this.api.url+"/profile/"+data.file_nm;
        console.log("data : ", this.url);
      }
    });
  }

  getUsername() {
    this.userData.getUsername().then((username) => {
      this.username = username;
    });
  }

  logout() {
    this.userData.logout();
    this.router.navigateByUrl('/login');
  }

  support() {
    this.router.navigateByUrl('/support');
  }

  onChangeImage(event){
    let image = event.target.files[0];
			let formData = new FormData();
			console.log("upload user_id : ", this.user_id);
			formData.append('file', image);
			formData.append('user_id', this.user_id);
			return this.api.post('user/upload-image', formData).subscribe((resp: any) => {
				console.log('데이터 처리 완료');
        console.log(resp);
        this.url = resp.file_url;

        this.storage.get('user_data').then((data: UserOptions)=>{
          data.file_nm = resp.file_name;
          console.log("change data", data);
          this.storage.set('user_data', data);
        });

			}, (err) => {
				console.log('파일 업로드 실패');
				console.log(err);
			});
  }

  setPassword(password){
    let user = firebase.auth().currentUser;
    user.updatePassword(password).then(()=>{
      alert("패스워드가 변경되었습니다.");
    }).catch((err)=>{
      alert(err.message);
    });
  }

}
