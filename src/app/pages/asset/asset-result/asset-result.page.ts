import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { Api } from '../../../providers/api/api';

import * as _ from 'lodash';
import { UtilService } from '../../../providers/util.service';

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
	public balance_account: string = '';
	public profits_rate: string = '';
	public asset_cds: any;
	public asset_chart_data: any = [["자산종류", "금액"]];

	public retired_account: number = 0;

	public retired_asset_cds: any = [
		"01",	//: "개인형IRP",
		"02",	//: "DC",
		"03",	//: "DB",
		//"04": "펀드",
		"05"	//: "연금저축",
		//"06": "해외비과세",
		//"07": "현금성자산",
		//"08": "채권",
		//"09": "해외채권",
		//"10": "주식",
		//"11": "랩"
	];

	public ages: any = {upper:80, lower:60};
	public birthYYYY: string = '';
	public birthMM: string = '';

	public birthday: string = '';
	public current_age: number = 0;
	public retired_age: number = 0;
	public period_saving: number = 0.000000001;
	public pension_end_age: number = 0;
	public period_pension: number = 20;

	public save_period: number = 0;

	public pmt: number = 0;

	public invest_before_rate: number = 0;
	public invest_after_rate: number = 0;
	public inflation_rate: number = 0;
	
	public retired_fv: number = 0;
	public remain_asset: number = 0;
	public annuity_fv: number = 0;
	public annuity_pv: number = 0;



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
		private router: Router,
		private util: UtilService
	) { 
		this.asset_cds = asset_cds;
	}




	ngOnInit() {
		this.cust_id = this.route.snapshot.paramMap.get('cust_id');
		this.balance_date = this.route.snapshot.paramMap.get('balance_date');
		this.cust_nm = this.route.snapshot.paramMap.get('cust_nm');
		this.eval_account = this.route.snapshot.paramMap.get('eval_account');
		this.birthday = this.route.snapshot.paramMap.get('birthday');
		this.getAssetResult();
		this.init();
	}

	init(){
		
		let this_year = new Date().getFullYear();
		let this_month = this.util.pad(new Date().getMonth() + 1, 2);
		if(this.birthday != null && this.birthday.indexOf("/") > 0) {
			this.birthYYYY = this.birthday.split('/')[0];
			this.birthMM = this.birthday.split('/')[1];
		}

		this.current_age = this_year - Number(this.birthYYYY) + (this_month > this.birthMM ? 0 : 1);
		if(Number(this.birthYYYY) == 0) this.current_age = 35;
		
		this.retired_age = this.ages.lower;
		this.pension_end_age = this.ages.upper;

		if(this.current_age > this.retired_age) this.retired_age = this.current_age + 1;
		this.invest_before_rate = 5;
		this.invest_after_rate = 4;
		this.inflation_rate = 2;

		this.calcRetirePlan();

	}

	calcRetirePlan(){
		this.retired_age = this.ages.lower;
		this.pension_end_age = this.ages.upper;
		this.period_pension = this.ages.upper - this.ages.lower;		
		this.period_saving = this.retired_age - this.current_age;
		if(this.period_saving == 0 ) this.period_saving = 0.0000000001;
		console.log(this.period_pension);
		this.calcFV();	
		this.calcPMT();
		this.calaPV();
	}

	calcFV(){
		this.retired_fv = Math.round(
			this.util.calcFv(
				this.invest_before_rate/100, 
				this.period_saving, 
				this.pmt*12, 
				this.retired_account
		));
	}

	calcPMT(){
		this.annuity_fv = 
		Math.round(
		this.util.calcPMT(
			this.invest_after_rate/100, 
			this.period_pension, 
			this.retired_fv, 
			this.remain_asset, 
			0
		) / 12);
	}

	calaPV(){
		this.annuity_pv = 
			Math.round(this.util.calcPV(
			this.inflation_rate/100, 
			this.retired_age - this.current_age, 
			0, 
			this.annuity_fv, 
			0));
		
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
			
			// 은퇴자산만 합산 
			if(this.retired_asset_cds.includes(key)) 
			assets_groupBy[key].forEach( asset => {
				this.retired_account += Math.round(asset.eval_account / 10000);
			});
			this.calcRetirePlan();
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
		this.balance_account = data.balance_account;
	}

	viewDetail(g_idx, asset_idx){
		const el = document.querySelector<HTMLInputElement>("#more_info_"+g_idx+"_"+asset_idx);		
		let has_class = el.classList.contains('more');
		if(has_class) 
			el.classList.remove('more');
		else 
			el.classList.add('more');
	}

	openInputRates(){
		const el = document.querySelector<HTMLInputElement>("#input_rate");	
		let has_class = el.classList.contains('close');
		if(has_class) 
			el.classList.remove('close');
		else 
			el.classList.add('close');
	}

	openRetiredSimulation(){
		const el = document.querySelector<HTMLInputElement>("#retired_simulation");	
		let has_class = el.classList.contains('close');
		if(has_class) 
			el.classList.remove('close');
		else 
			el.classList.add('close');
	}
}
