import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, AlertController } from '@ionic/angular';
import { CustListPage } from '../../cust-list/cust-list.page';
import { Api } from '../../../providers/api/api';
import { UtilService } from '../../../providers/util.service';

@Component({
	selector: 'cust-manage-detail',
	templateUrl: './cust-manage-detail.page.html',
	styleUrls: ['./cust-manage-detail.page.scss'],
})
export class CustManageDetailPage implements OnInit {

	private cust_nm: string;
	private cust_id: string;
	private account_no: string;
	private email: string;
	private birthday: string;
	private birthYYYY: string;
	private birthMM: string;
	private years: any = [];
	private months: any = [];
	private user_id: string;

	private family_key_yn: string;
	private family_key_no: string;
	private family_key_account_no: string;

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
		private util: UtilService
		) { }

	ngOnInit() {
		this.cust_nm = this.route.snapshot.paramMap.get('cust_nm');
		this.cust_id = this.route.snapshot.paramMap.get('cust_id');
		this.account_no = this.route.snapshot.paramMap.get('account_no');
		this.email = this.route.snapshot.paramMap.get('email');
		this.birthday = this.route.snapshot.paramMap.get('birthday');
		this.family_key_no = this.route.snapshot.paramMap.get('family_key_no');
		this.family_key_nm = this.route.snapshot.paramMap.get('family_key_nm');
		this.family_key_yn = this.route.snapshot.paramMap.get('family_key_yn');
		this.family_key_account_no = this.route.snapshot.paramMap.get('family_key_account_no');
		this.user_id = this.route.snapshot.paramMap.get('user_id');
		this.fp_id = this.route.snapshot.paramMap.get('fp_id');
		this.login_code = this.route.snapshot.paramMap.get('login_code');
		this.family_cd = this.route.snapshot.paramMap.get('family_cd');
		this.reg_date = this.route.snapshot.paramMap.get('reg_date');

		if(this.birthday != null && this.birthday.indexOf("/") > 0) {
			this.birthYYYY = this.birthday.split('/')[0];
			this.birthMM = this.birthday.split('/')[1];
		}
		
		let this_year = new Date().getFullYear();
		for(let i = 0; i < this_year - 1950; i++ ) this.years[i] = 1950 + i;
		for(let i = 0; i < 12 ; i++ ) this.months[i] = this.util.pad(i+1, 2);	
		if(this.family_key_yn == 'y') this.checkFamilyKey = true;

		console.log("customer info: ", this.route.snapshot.paramMap);
	}


	async selectCust() {
		const modal = await this.modalController.create({
			component: CustListPage,
			componentProps: { cust_nm: this.cust_nm, account_no: this.account_no}

		});
		await modal.present();
		const { data } = await modal.onWillDismiss();
		if (data) {
			this.setFamilyKey(data.cust_id, data.cust_id, data.account_no, '');
		}
	}

	async setFamilyKey(cust_id, family_key_no, account_no,  family_key_yn){

		const alert = await this.alertCtl.create({
			header: '확인',
			subHeader: '대표계좌설정',
			message: account_no + '로 대표계좌로 설정하시겠습니까?',
			buttons: [
			{
				text: '아니오',
				role: 'cancel',
				cssClass: 'secondary',
				handler: (blah) => {
				console.log('Confirm Cancel');
				}
			}, {
				text: '네',
				handler: () => {
					this.processSetFamilyKey(cust_id, family_key_no, account_no, family_key_yn);
				}
			}
			]
		});
		await alert.present();

	}

	processSetFamilyKey(cust_id, family_key_no, account_no, family_key_yn){
		if(this.cust_id == cust_id) {
			family_key_yn = 'y';
		}
		
		let formData = new FormData();
		formData.append("cust_id", this.cust_id);
		formData.append("family_key_no", family_key_no);
		formData.append("family_key_yn", family_key_yn);
		formData.append("family_cd",'');
		formData.append("fp_id", this.fp_id);

		return this.api.post('cust/updateFamilyKeyNo', formData).subscribe( (resp) => {
			console.log(resp);
			this.family_key_account_no = account_no;
		});
	}

	// checkFamilayKey(data){
	// 	if(this.checkFamilyKey == true) {
	// 		this.checkFamilyKey = true;
	// 	} else {
	// 		this.checkFamilyKey = false;
	// 		this.confirmUpdateFamilyKey();
	// 	}
	// 	console.log(this.checkFamilyKey);
	// }

	updateBirthday(){
		
		let formData = new FormData();
		formData.append("cust_id", this.cust_id);
		let birthday = this.birthYYYY + "/" + this.birthMM;
		formData.append("birthday", birthday);
		console.log("birthday : ", birthday);
		return this.api.post('cust/updateBirthday', formData).subscribe( (resp) => {
			console.log(resp);
		});
	}
}
