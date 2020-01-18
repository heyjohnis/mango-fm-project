import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { Api } from '../../../providers/api/api';
import { UtilService } from '../../../providers/util.service';
import * as _ from 'lodash';


@Component({
    selector: 'customer-detail',
    templateUrl: './customer-detail.page.html',
    styleUrls: ['./customer-detail.page.scss'],
})
export class CustomerDetailPage implements OnInit {

    public dates: any;
    public balance_date: string = '';
    public cust_id: string = '';
    public cust_nm: string = '';
    public recent_fp_asset: any;
    public total_account = 0;
    public chart_data: any;

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
        public util: UtilService
    ) { }

    ngOnInit() {
        this.cust_id = this.route.snapshot.paramMap.get('cust_id');
        this.cust_nm = this.route.snapshot.paramMap.get('cust_nm');
        this.getData();
    }

    getData(){
        let formData = new FormData();
        formData.append("cust_id", this.cust_id);
        return this.api.post('fund/dates', formData).subscribe( (resp) => {
            this.dates = resp;
            this.chart_data = this.setChartData(this.util.setMonthlyData(resp, 4));
            /* 차트 로딩 */
            google.charts.load('current', { 'packages': ['corechart'] });
            google.charts.setOnLoadCallback(this.drawChart);
        });
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
        this.router.navigate(['/app/tabs/customer/detail/assetResult' ,{cust_id : custId, cust_nm : custNm, balance_date : balanceDate, eval_account: evalAccount}]);
    }
}
