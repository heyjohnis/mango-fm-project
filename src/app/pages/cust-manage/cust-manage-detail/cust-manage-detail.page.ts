import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, AlertController } from '@ionic/angular';
import { CustListPage } from '../../cust-list/cust-list.page';
import { Api } from '../../../providers/api/api';

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
	private family_key_yn: string;
	private family_key_no: string;
	private family_key_nm: string;
	private reg_date: string;
	private family_cd: string;
	private fp_id: string;

	private checkFamilyKey: Boolean = false;
	
	private customer: any;

	constructor(
		private route: ActivatedRoute,
		private modalController: ModalController,
		private api: Api,
		private alertCtl: AlertController
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
		this.fp_id = this.route.snapshot.paramMap.get('fp_id');

		this.family_cd = this.route.snapshot.paramMap.get('family_cd');
		this.reg_date = this.route.snapshot.paramMap.get('reg_date');
		console.log("family_cd : ",this.family_cd);

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
			this.setFamilyKey(this.cust_id, data.cust_id, '', this.family_cd);
		}
	}

	setFamilyKey(cust_id, family_key_no, family_key_yn, family_cd){
		let formData = new FormData();
		formData.append("cust_id", cust_id);
		formData.append("family_key_no", family_key_no);
		formData.append("family_cd", family_cd ? family_cd : '01');
		formData.append("family_key_yn", family_key_yn);
		formData.append("fp_id", this.fp_id);

		return this.api.post('cust/updateFamilyKeyNo', formData).subscribe( (resp) => {
			console.log(resp);
		});

	}

	checkFamilayKey(data){
		if(this.checkFamilyKey == true) {
			this.checkFamilyKey = true;
		} else {
			this.checkFamilyKey = false;
			this.confirmUpdateFamilyKey();
		}
		console.log(this.checkFamilyKey);
	}



	async confirmUpdateFamilyKey() {
		console.log("confirmUpdateFamilyKey");
		const alert = await this.alertCtl.create({
		  header: '확인',
		  subHeader: '고객정보',
		  message: '세대주로 변경하시겠습니까?',
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
				this.setFamilyKey(this.cust_id, this.cust_id, 'y', '');
			  }
			}
		  ]
		});
		await alert.present();

	}

}
