import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router,ActivatedRoute } from '@angular/router';
import { Api } from '../../../providers/api/api';
import { UtilService } from '../../../providers/util.service';
import * as _ from 'lodash';
import { storage } from 'firebase';
import { timeout } from 'rxjs/operators';

@Component({
    selector: 'customer-detail',
    templateUrl: './customer-detail.page.html',
    styleUrls: ['./customer-detail.page.scss'],
})
export class CustomerDetailPage implements OnInit {

    public dates: any;
    public balance_date: string = '';
    public cust_id: string = '';
    public cust_nm: string = '자산현황';
    public login_code: string = '';
    public recent_fp_asset: any;
    public total_account = 0;
    public profits_rate;
    public chart_data: any;

    public domain: string = "http://jhouse.tjc.or.kr:8100/";
    public uri: string = "";
    public image_url: string = "";

    public custLogin = false;

    @ViewChild('pieChart', {static: false}) pieChart: ElementRef;
    public drawChart = () => {
        const data = google.visualization.arrayToDataTable(this.chart_data);
        const options: any = {
            title: '',
            legend: {position: 'right', alignment: 'center'},
            pieSliceText: 'label',
        };
        const chart = new google.visualization.LineChart(this.pieChart.nativeElement);
        chart.draw(data, options);
    }

    constructor(
        private route: ActivatedRoute,
        private api: Api,
        private router: Router,
        public util: UtilService,
        private storage: Storage
    ) {
    }

    ngOnInit() {
        this.cust_id = this.route.snapshot.paramMap.get('cust_id');
        this.cust_nm = this.route.snapshot.paramMap.get('cust_nm');
        this.login_code = this.route.snapshot.paramMap.get('login_code');
        this.getData();
        this.storage.get('cust_id').then((custId) =>{
          if(custId != null) {
            console.log("custId : ", custId);
            this.custLogin = true;

            //this.checkCustLogin();
            this.cust_id = custId;
            this.cust_nm = '자산현황';
            window.dispatchEvent(new CustomEvent('user:login_code'));

            this.getData();
          }

          this.storage.get('user_data').then((data: any) => {
            this.image_url = this.api.url + "/profile/" + data.file_nm;
          });
        });
    }

    checkCustLogin(){
      setTimeout(() => {
        this.custLogin = true;
      }, 300);
    }

    getData(){
        let formData = new FormData();
        formData.append("cust_id", this.cust_id);
        return this.api.post('fund/dates', formData).subscribe( (resp: any) => {
            this.dates = resp.dates;
            this.login_code = resp.login_code;
            this.setKakaoMessage(this.dates[0]);
            this.chart_data = this.setChartData(this.util.setMonthlyData(this.dates, 4));
            /* 차트 로딩 */
            google.charts.load('current', { 'packages': ['corechart'] });
            google.charts.setOnLoadCallback(this.drawChart);
        });
    }


    setKakaoMessage(data){
      this.balance_date = data.balance_date;
      this.total_account = data.eval_account;
      this.profits_rate = data.profits_rate * 100 + '%';
      this.uri = this.domain+'my/'+this.login_code;
      console.log("first date ", this.uri);
      setTimeout(() => {
        this.util.shareKakao(this.balance_date, this.total_account, this.profits_rate, this.uri, this.image_url);
      }, 1000);
    }

    setChartData(data):any {
        let chart = [];
        data.forEach((data: any) => {
            if(data.header != null) {
            let chart_data = [];
            chart_data.push(data.month);
            chart_data.push(Math.round(data.header.eval_account/10000));
            chart.push(chart_data);
            } 
        });
        chart.push(["일자", "금액(만원)"]);
        _.reverse(chart);
        return chart;
    }

    gotoAssetResult(custId, custNm, balanceDate, evalAccount) {
      if(this.custLogin)
        this.router.navigate(['/app/tabs/my-asset/assetResult' ,{cust_id : custId, cust_nm : '자산현황', balance_date : balanceDate, eval_account: evalAccount}]);   
      else 
        this.router.navigate(['/app/tabs/customer/detail/assetResult' ,{cust_id : custId, cust_nm : custNm, balance_date : balanceDate, eval_account: evalAccount}]);
    }


}
