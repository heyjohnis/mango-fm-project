import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Api } from '../../../providers/api/api';
import * as _ from 'lodash';

@Component({
  selector: 'asset-detail',
  templateUrl: './asset-detail.page.html',
  styleUrls: ['./asset-detail.page.scss'],
})
export class AssetDetailPage implements OnInit {

  public customers: any;
  public fp_id: string;
  public balance_date: string = '';

  constructor(
    private route: ActivatedRoute,
    private storage: Storage,
    private router: Router,
    private api: Api
  ) { }

  ngOnInit() {
    this.balance_date = this.route.snapshot.paramMap.get('balance_date');
    this.fp_id = this.route.snapshot.paramMap.get('fp_id');

  }

	ionViewDidEnter(){
    this.getCustomList(this.fp_id, this.balance_date);
  }

  getCustomList(fp_id, balance_date)  {
    console.log("getCustomList", fp_id)
    let formData = new FormData();
    formData.append("fp_id", fp_id);
    formData.append("order_by", "reg_date");
    formData.append("order_type", "desc");
    formData.append("balance_date", balance_date);
    return this.api.post('customer', formData).subscribe( (resp) => {
      console.log("customer list : ", resp);
      this.customers = resp;  

      console.log("Monthly Data : ",this.setMonthlyData(resp));
      
    }, (err) => {
      console.log("home cust",err);
    });
  }

  setMonthlyData(data) : any{

    return data;
  }

  gotoAssetResult(custId, custNm, balanceDate) {
    console.log( custId + " " + custNm + " " + balanceDate );
    this.router.navigate(['app/tabs/asset/detail/assetResult' ,{cust_id : custId, cust_nm : custNm, balance_date : balanceDate}]);
  }

}
