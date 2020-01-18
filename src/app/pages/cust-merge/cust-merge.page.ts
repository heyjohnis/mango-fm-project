import { Component, OnInit, Input } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { Api } from '../../providers/api/api';

@Component({
	selector: 'cust-merge',
	templateUrl: './cust-merge.page.html',
	styleUrls: ['./cust-merge.page.scss'],
})
export class CustMergePage implements OnInit {

	@Input() customers: any;

	constructor(
		public navParams: NavParams,
		public modalCtrl: ModalController,
		public api: Api
	) { 
		console.log("NavParams : ",navParams.get('customers'));
	}

	ngOnInit() {
		console.log("modal customers : ", this.customers);
	}

	dismiss(data?: any) {
		this.modalCtrl.dismiss(data);
    }

    mergeCust(cust_id, cust_id2){
		let req = new FormData();
		req.append("cust_id", cust_id);
		req.append("cust_id2", cust_id2);

		return this.api.post('cust/autoMergeCustomer', req).subscribe( (res:any) => {
			console.log("req : ", res);
		});
    }
    

}
