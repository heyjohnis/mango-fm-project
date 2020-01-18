import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router'
import { Api } from '../../providers/api/api';
import { UtilService } from '../../providers/util.service';
import * as _ from 'lodash';

@Component({
	selector: 'asset',
	templateUrl: './asset.page.html',
	styleUrls: ['./asset.page.scss'],
})
export class AssetPage implements OnInit {

	public dates: any;
	public fp_id: string;
	public today: Date;
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
		private storage: Storage,
		private router: Router,
		private api: Api,
		private util:UtilService
	) { }

	ngOnInit() {
		this.storage.get("user_data").then( (data) => {
			console.log("user_id: ", data.user_id);
			this.fp_id = data.user_id;
			this.getDates(this.fp_id);
		}); 
	}


	getDates(fp_id){
		let formData = new FormData();
		formData.append("fp_id", fp_id);
		return this.api.post('fund/getUploadBalanceDates', formData).subscribe( (resp) => {
			this.dates = resp;
			let monthly = this.util.setMonthlyData(resp, 4);
            this.chart_data = this.setChartData(monthly);
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
		console.log("chart : ", chart);
		chart.push(["일자", "금액(만원)"]);
        _.reverse(chart);
        return chart;
    }


	gotoDetail(balanceDate) {
		this.router.navigate(['/app/tabs/asset/detail' ,{balance_date : balanceDate, fp_id: this.fp_id}]);
	}

}
