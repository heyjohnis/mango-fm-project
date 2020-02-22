import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router'
import { Api } from '../../providers/api/api';
import { UtilService } from '../../providers/util.service';
import * as _ from 'lodash';
import { AlertController } from '@ionic/angular';

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
	public is_option: boolean = false;

    @ViewChild('pieChart', {static: false}) pieChart: ElementRef;
    public drawChart = () => {
        const data = google.visualization.arrayToDataTable(this.chart_data);
        const options: any = {
            title: '',
            legend: {position: 'bottom', alignment: 'center'},
			pieSliceText: 'label',
			animation:{
				duration: 1000,
				easing: 'out',
			},
        };
        const chart = new google.visualization.LineChart(this.pieChart.nativeElement);
        chart.draw(data, options);
	}
	
	constructor(
		private storage: Storage,
		private router: Router,
		private api: Api,
		private util:UtilService,
		private alertCtl: AlertController
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

	async delDate(data: any, idx){

		const alert = await this.alertCtl.create({
			header: '확인',
			subHeader: '데이터 삭제',
			message: this.util.setDateHyphen(data.balance_date) + " 일자의 데이터를 삭제하시겠습니까?",
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
					this.processDel(data, idx);
				}
			}
			]
		});
		await alert.present();

	}

	processDel(data:any, idx){
		let formData = new FormData();
		formData.append("fp_id", this.fp_id);
		formData.append("balance_date", data.balance_date);
		return this.api.post('fund/delBalanceDateData', formData).subscribe( (resp) => {
			console.log(resp);
			this.dates.splice(idx, 1);
			this.getDates(this.fp_id);
		});
	}

	showOption(is_option){
		const el = document.querySelector<HTMLInputElement>('#list_result');
		if(is_option) el.classList.add('option_hidden');
		else el.classList.remove('option_hidden');
		this.is_option = !this.is_option;
	}

	gotoDetail(balanceDate) {
		this.router.navigate(['/app/tabs/asset/detail' ,{balance_date : balanceDate, fp_id: this.fp_id}]);
	}

}
