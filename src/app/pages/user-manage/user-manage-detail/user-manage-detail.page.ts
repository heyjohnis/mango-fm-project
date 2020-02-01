import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, AlertController } from '@ionic/angular';
import { Api } from '../../../providers/api/api';
import { UtilService } from '../../../providers/util.service';

@Component({
  selector: 'user-manage-detail',
  templateUrl: './user-manage-detail.page.html',
  styleUrls: ['./user-manage-detail.page.scss'],
})
export class UserManageDetailPage implements OnInit {

	private user_nm: string;
	private user_id: string;
	private email: string;
	private birthday: string;
	private birthYYYY: string = '';
	private birthMM: string = '';
	private user_type: string = '';
	private years: any = [];
	private months: any = [];
	private del_user: any = '';

	private family_key_yn: string;
	private family_key_no: string;
	private family_key_nm: string;
	private reg_date: string;
	private family_cd: string;
	private fp_id: string;
	private login_code: string;

	private checkFamilyKey: Boolean = false;
	
	private customer: any;

	constructor(
		private route: ActivatedRoute,
		private modalController: ModalController,
		private api: Api,
		private alertCtl: AlertController,
		private util: UtilService,
		private storage: Storage,
		private router: Router
		) { }

	ngOnInit() {
		this.user_nm = this.route.snapshot.paramMap.get('user_nm');
		this.user_id = this.route.snapshot.paramMap.get('user_id');
		this.email = this.route.snapshot.paramMap.get('email');
		this.birthday = this.route.snapshot.paramMap.get('birthday');
		this.reg_date = this.route.snapshot.paramMap.get('reg_date');
    	this.user_type = this.route.snapshot.paramMap.get('user_type');

		if(this.birthday != null && this.birthday.indexOf("/") > 0) {
			this.birthYYYY = this.birthday.split('/')[0];
			this.birthMM = this.birthday.split('/')[1];
		}
		
		let this_year = new Date().getFullYear();
		for(let i = 0; i < this_year - 1950; i++ ) this.years[i] = 1950 + i;
		for(let i = 0; i < 12 ; i++ ) this.months[i] = this.util.pad(i+1, 2);
		if(this.family_key_yn == 'y') this.checkFamilyKey = true;
	}

	updateBirthday(){
		let formData = new FormData();
		formData.append("cust_id", this.user_id);
		let birthday = this.birthYYYY + "/" + this.birthMM;
		formData.append("birthday", birthday);
		console.log("birthday : ", birthday);
		return this.api.post('cust/updateBirthday', formData).subscribe( (resp) => {
			console.log(resp);
		});
	}
  
	updateUserInfo(){
		let formData = new FormData();
		formData.append("user_id", this.user_id);
		formData.append("user_type", this.user_type);
		formData.append("del_user", this.del_user);
		console.log("updateUserInfo : ", this.user_type);
		return this.api.post('user/updateUserInfo', formData).subscribe( (resp) => {
				console.log(resp);
		});
  	}

	userChange(){
		let formData = new FormData();
		formData.append("user_id", this.user_id);
		formData.append("firebase_id", "");

		return this.api.post('user/getUser', formData).subscribe( (resp) => {
			this.storage.set('user_data', resp).then((res)=>{
				this.router.navigateByUrl('/app/tabs/home');
			});
		});
	}

	async confirmDeleteUser() {
		console.log("confirmDeleteUser");
		const alert = await this.alertCtl.create({
			header: '확인',
			subHeader: '사용자 삭제',
			message: '사용자를 삭제하시겠습니까?',
			buttons: [
				{
					text: '아니오',
					role: 'cancel',
					cssClass: 'secondary',
					handler: (blah) => {
						console.log('confirmDeleteUser : 아니오');
					}
				}, 
				{
					text: '네',
					handler: () => {
						this.del_user = 'y'
						console.log('confirmDeleteUser : 네');
						this.updateUserInfo();
					}
				}
			]
		});
		await alert.present();
	}

}
