import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Api } from '../../providers/api/api';
import { UserData } from '../../providers/user-data';
import { UtilService } from '../../providers/util.service';
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
	public order_default: string = 'cust_nm';
	public segment: string = 'cust_nm';
	private segment_before: string = '';
	private cnt_customers = 0;
	private order_by:any = {"cust_nm": "asc", "reg_date": "desc", "eval_account": "desc", "profits_rate": "desc"};
	private family_cds;
	constructor( 
		private storage: Storage,
		private router: Router,
		private route: ActivatedRoute,
		private api: Api,
		private userData: UserData,
		private util: UtilService,
	) { 
		this.family_cds = family_cds;
	}
	
	ngOnInit() {

		this.order_default = this.route.snapshot.paramMap.get('order_by');

		this.storage.get('user_data').then((data) => {
				console.log("user_id: ", data.user_id);
				this.getCustomers(data.user_id);
				this.user_id = data.user_id;
		}).catch((err)=>{
			console.log("user_id : ", err);
		});
	}

	ionViewWillEnter(){
		this.getCustomers(this.user_id);
	}


	getCustomers(user_id){
		let formData = new FormData();
		formData.append("fp_id", user_id);
		return this.api.post('cust/getCustomerManageList', formData).subscribe( (resp) => {
			this.customers = resp;

			// this.storage.set("customers", resp).then((data)=>{
			// 	console.log("Set Storage - customer : ", data)
			// });

			this.cnt_customers = this.customers.length;
		});
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

}
