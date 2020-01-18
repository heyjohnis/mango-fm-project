import { Component, OnInit, Input } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'cust-list',
  templateUrl: './cust-list.page.html',
  styleUrls: ['./cust-list.page.scss'],
})
export class CustListPage implements OnInit {

  public customers: any;
  public account_no: string = "";
  public cust_nm: string = "";
  public queryText: string = "";
  public temp_customers: any;

  constructor(
	private modalCtrl: ModalController,
	private storage: Storage,
	private navParams: NavParams
  ) { }

  ngOnInit() {
	 this.account_no = this.navParams.get('account_no');
	 this.cust_nm = this.navParams.get('cust_nm');

	this.customers = this.getUserData();

	console.log("onInit - customers : ", this.customers);
  }

  getUserData(){
	this.storage.get('customers').then((data) => {
	  this.customers = data;
	  this.temp_customers = data;
	});
	}

  dismiss(data?: any) {
	this.modalCtrl.dismiss(data);
  }

  selectFamilyKey(custNm, custId){
	this.modalCtrl.dismiss({cust_nm: custNm, cust_id: custId})
  }
  inpSearchKey(){
		console.log(this.queryText);
		console.log(this.temp_customers);
		if(this.queryText != "") {
			let search_customers = this.temp_customers.filter((obj) => {
				return obj.cust_nm.includes(this.queryText);
			});
			this.customers = search_customers;
		} else {
			this.customers = this.temp_customers;
		}
	}

}
