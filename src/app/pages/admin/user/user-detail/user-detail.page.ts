import { Component, OnInit, Input } from '@angular/core';
import { NavParams, ModalController, AlertController } from '@ionic/angular';
import { Api } from '../../../../providers/api/api';

// import * as admin from 'firebase-admin';


@Component({
  selector: 'user-detail',
  templateUrl: './user-detail.page.html',
  styleUrls: ['./user-detail.page.scss'],
})
export class UserDetailPage implements OnInit {

  //@Input() user: any;
  private user: any;
  private apply_yn: boolean;

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private api: Api,
    private alertCtl: AlertController
  ) { 
    this.user = this.navParams.get('user');
  }

  ngOnInit() {
    console.log("user : ", this.user);
    this.apply_yn = this.user.apply_yn == "n" ? false : true;
    // admin.auth().getUser(this.user.firebase_id).then((res)=>{
    //   console.log("firebase_admin : ", res);
    // }); 
  }

  selectUserType(){
    console.log(this.user.user_type);
  }

  applyUser(){
    this.user.apply_yn = this.apply_yn == true ? 'y' : 'n';
    console.log("apply_yn : ", this.user.apply_yn);
  }

  updateUser(){
    this.modalCtrl.dismiss({
      user: this.user,
      type: "mod"
    });
  }

  closeModal(){
    this.modalCtrl.dismiss();
  }

  async delUser(){

      const alert = await this.alertCtl.create({
        header: '확인',
        subHeader: '데이터 삭제',
        message: "데이터를 삭제하시겠습니까?",
        buttons: [
          {
            text: '아니오',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
            }
          }, {
            text: '네',
            handler: () => {
              this.delUserData();
            }
          }
        ]
      });
      await alert.present();


  }

  delUserData(){
    let formData = new FormData();
    formData.append("user_id", this.user.user_id);
    this.api.post("/user/delUser", formData).subscribe((res)=>{
      console.log("delete res : ",res);
      this.modalCtrl.dismiss({
        user: {},
        type: "del"
      });

    });
  }

}
