import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { Api } from '../../../providers/api/api';

import * as _ from 'lodash';

declare var asset_cds: any;

@Component({
	selector: 'asset-result',
	templateUrl: './asset-result.page.html',
	styleUrls: ['./asset-result.page.scss'],
})
export class AssetResultPage implements OnInit {

	public assets_group: any;
	public balance_date: string = '';
	public cust_id: string = '';
	public cust_nm: string = '';
	public eval_account: string = '';
	public profits_rate: string = '';
	public asset_cds: any;
	public asset_chart_data: any = [["자산종류", "금액"]];

	@ViewChild('pieChart', {static: false}) pieChart: ElementRef;

	public drawChart = () => {
		const data = google.visualization.arrayToDataTable(
			this.asset_chart_data
		);
		const options: any = {
			title: '',
			legend: {position: 'right', alignment: 'center'},
			pieSliceText: 'label',
			//pieHole: 0.2

		};
		const chart = new google.visualization.PieChart(this.pieChart.nativeElement);
		chart.draw(data, options);
	}

	constructor(
		private route: ActivatedRoute,
		private api: Api,
		private router: Router
	) { 
		this.asset_cds = asset_cds;
	}

	ngOnInit() {
		this.cust_id = this.route.snapshot.paramMap.get('cust_id');
		this.balance_date = this.route.snapshot.paramMap.get('balance_date');
		this.cust_nm = this.route.snapshot.paramMap.get('cust_nm');
		this.eval_account = this.route.snapshot.paramMap.get('eval_account');

		this.getAssetResult();
	}

	getAssetResult(){
		let formData = new FormData();
		formData.append("cust_id", this.cust_id);
		formData.append("balance_date", this.balance_date);
		return this.api.post('fund/assetResult', formData).subscribe( (resp: any) => {
			console.log("assets : ", resp);

			this.setAssetData(resp.assets);
			this.setChart();
			this.setTotal(resp.present);

		});
	}

	setAssetData(data) {

		let assets_groupBy = _.groupBy(data, 'asset_cd');
		console.log("assets_groupBy : ",assets_groupBy);
		let assets_group = [];
		for(let key in assets_groupBy) {
			// 자산별 구성 
			assets_group.push({asset_cd:key, assets: assets_groupBy[key]});
			
			// 차트데이터 생성
			let asset_data = [];
			asset_data.push(asset_cds[key]);
			let account = 0;
			let assets = assets_groupBy[key];	// 그룹별 자산 list
			for(let i in assets) // 자산 합계 
				account += assets[i].eval_account;	
			
			asset_data.push(account); 
			this.asset_chart_data.push(asset_data);
		}

		this.assets_group = assets_group;

		console.log("asset_chart_data : ", this.asset_chart_data);
		console.log("asset_group: ",assets_group );

	}

	
	setChart(){
		/* 차트 로딩 */
		console.log("recent_fp_asset : ", this.asset_chart_data);
		google.charts.load('current', { 'packages': ['corechart'] });
		google.charts.setOnLoadCallback(this.drawChart);
	}

	setTotal(data){
		this.eval_account = data.eval_account;
		this.profits_rate = data.profits_rate;

	}

	viewDetail(g_idx, asset_idx){
		const els = document.querySelectorAll<HTMLInputElement>(".more_info");
		els.forEach((el) => {el.style.height = "0";});
		let target = document.querySelector<HTMLInputElement>("#more_info_"+g_idx+"_"+asset_idx);
		let height = target.style.height;
		console.log(height);
		if(height == '100%') target.style.height = '0';
		else target.style.height = '100%';
	}

	// setKakaoMessage(){
	// 	let balance_date = this.balance_date;
	// 	let eval_account = this.eval_account;
	// 	let profits_rate = this.profits_rate * 100 + '%';
	// 	let uri = this.domain+'my/'+this.login_code;
	// 	console.log("first date ", this.uri);
	// 	setTimeout(() => {
	// 	  this.util.shareKakao(this.balance_date, this.total_account, this.profits_rate, this.uri, this.image_url);
	// 	}, 1000);
	//   }
}
