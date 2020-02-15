import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Api } from '../../providers/api/api';
import { UserData } from '../../providers/user-data';
import { UtilService } from '../../providers/util.service';
import { AlertController } from '@ionic/angular';
declare var family_cds: any;

@Component({
  selector: 'cust-manage',
  templateUrl: './cust-manage.page.html',
  styleUrls: ['./cust-manage.page.scss'],
})
export class CustManagePage implements OnInit {

	public customers: any;
	public temp_customer: any;
	public queryText: string;
	public user_id;
	public segment: string = 'cust_nm';
	private cnt_total_cust = 0;
	private cnt_customers = 0;

	constructor( 
		private storage: Storage,
		private router: Router,
		private route: ActivatedRoute,
		private api: Api,
		private userData: UserData,
		private util: UtilService,
		private alertCtl: AlertController
	) { 
		//this.family_cds = family_cds;
	}
	
	ngOnInit() {

		this.storage.get('user_data').then((data) => {
				console.log("user_id: ", data.user_id);
				this.getCustomers(data.user_id);
				this.user_id = data.user_id;
		}).catch((err)=>{
			console.log("user_id : ", err);
		});
	}

	ionViewWillEnter(){
	//	this.getCustomers(this.user_id);
	}


	getCustomers(user_id){
		let formData = new FormData();
		formData.append("fp_id", user_id);
		return this.api.post('cust/getCustomerManageList', formData).subscribe( (resp) => {
			let custs = this.resetCustData(resp);
			this.customers = custs;
			this.temp_customer = custs;
			this.storage.set("customers", custs).then((data)=>{
				console.log("Set Storage - customer : ", data)
			});

			this.cnt_total_cust = this.customers.length;
		});
	}

	resetCustData(data: any): any {
		let cust_nm = "";
		let cust = [];
		this.cnt_customers = 0;
		data.forEach(el => {
			if(el.cust_nm == cust_nm) el.overlap = true;
			else el.overlap = false;
			if(el.family_key_no == el.cust_id) this.cnt_customers ++;
			cust_nm = el.cust_nm;
			cust.push(el);
		});
		return cust;
	}

	inpSearchKey(){
		console.log(this.queryText);
		if(this.queryText != "") {
			let search_customers = this.temp_customer.filter((obj) => {
				return obj.cust_nm.includes(this.queryText);
			});
			this.customers = search_customers;
		} else {
			this.customers = this.temp_customer;
		}
	}

	gotoDetail(customer) {
		this.router.navigate(['/cust-manage/detail' ,customer]);
	}

	genLoginKey(){
		let formData = new FormData();
		formData.append("fp_id", this.user_id);
		formData.append("cust_id", "");
		return this.api.post('cust/genLoginKey', formData).subscribe( (resp) => {
			console.log(resp);
		});
	}


	async mergeCust(cust_id, cust_nm) {
		const alert = await this.alertCtl.create({
		  header: '중복고객 합치기',
		  message: '중복된 '+cust_nm + ' 고객님을 합치겠습니까?',
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
				this.processCustMerge(cust_id);
			  }
			}
		  ]
		});
	
		await alert.present();
	}

	processCustMerge(cust_id){
		let formData = new FormData();
		formData.append("cust_id", cust_id);
		return this.api.post('cust/mergeCust', formData).subscribe( (resp) => {
			console.log("update merge customer : ", cust_id);
			//document.getElementById('cust_'+cust_id).classList.add('sub');
			this.getCustomers(this.user_id);
		});
	}

}
