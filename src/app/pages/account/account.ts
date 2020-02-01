import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { UserData } from '../../providers/user-data';
import { Api } from '../../providers/api/api';
import { UserOptions } from '../../interfaces/user-options';


@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
  styleUrls: ['./account.scss'],
})
export class AccountPage implements AfterViewInit {
  username: string;
  email: string;
  user_id: string;
  url: string =  "https://www.gravatar.com/avatar?d=mm&s=140";
  public birthYYYY: string;
  public birthMM: string;

  constructor(
    public alertCtrl: AlertController,
    public router: Router,
    public userData: UserData,
    public storage: Storage,
    public api: Api,
  ) { }

  ngAfterViewInit() {
    this.getUserData();
  }

  updatePicture() {
    console.log('Clicked to update picture');
  }

  // Present an alert with the current username populated
  // clicking OK will update the username and display it
  // clicking Cancel will close the alert and do nothing
  async changeUsername() {
    const alert = await this.alertCtrl.create({
      header: 'Change Username',
      buttons: [
        'Cancel',
        {
          text: 'Ok',
          handler: (data: any) => {
            this.userData.setUsername(data.username);
            this.getUsername();
          }
        }
      ],
      inputs: [
        {
          type: 'text',
          name: 'username',
          value: this.username,
          placeholder: 'username'
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
      this.url = this.api.url+"/profile/"+data.file_nm;
    });
  }

  getUsername() {
    this.userData.getUsername().then((username) => {
      this.username = username;
    });
  }

  changePassword() {
    console.log('Clicked to change password');
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

}
