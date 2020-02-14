import { OnInit, Component, ElementRef, ViewChild, OnChanges } from '@angular/core';
import { FileUploader, FileLikeObject } from 'ng2-file-upload';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { concat } from 'rxjs';
import { Api } from '../../providers/api/api';
import { CustomerService } from '../../providers/customer.service';
import { Storage } from '@ionic/storage';
import { UtilService } from '../../providers/util.service';
import { AlertController, ModalController, ToastController, LoadingController } from '@ionic/angular';
import { CustMergePage } from '../cust-merge/cust-merge.page';
declare var asset_cds: any;


@Component({
	selector: 'home',
	templateUrl: './home.page.html',
	styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
	

	public fileUploader: FileUploader = new FileUploader({});
	public hasBaseDropZoneOver: boolean = false;
	public uid: string;
	public users: any;
	
	public customers: any;
	public cnt_customers = 0; 

	public customers_account: any;
	public customers_rate: any;

	public user_id: string = "";
	public last_upload_date: any = {balance_date: '19700101', fp_id: this.user_id};
	public recent_fp_asset: any = [["자산종류", "금액"]];
	public asset_cds: any;
	public total_account = 0;

	public isLoading = false;
	public fileCount = 0;
	public resultCount = 0;

	@ViewChild('pieChart', {static: false}) pieChart: ElementRef;

	public drawChart = () => {
		const data = google.visualization.arrayToDataTable(
			this.recent_fp_asset
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
		public http: HttpClient,
		public api: Api,
		public customer: CustomerService,
		public storage: Storage,
		public router: Router,
		public util: UtilService,
		public alertCtl: AlertController,
		public modalController: ModalController,
		public route: ActivatedRoute,
		public toastController: ToastController,
		public loadingController: LoadingController
		) { 
			this.asset_cds = asset_cds;
	}

	ngOnInit() {
		this.init();
		 console.log("home ngOnInit");
		 window.addEventListener('user:login', () => {
			console.log("Home Listenner : login"); 
			this.init();
		});   
	}

	fileOverBase( event ): void {
		this.hasBaseDropZoneOver = event;
	}

	getCustomList(user_id)  {
		console.log("getCustomList", user_id);
		let formData = new FormData();
		formData.append("fp_id", user_id);
		formData.append("order_by", "reg_date");
		formData.append("order_type", "desc");
		formData.append("balance_date", "");
		return this.api.post('customer', formData).subscribe( (resp:any) => {
			this.customers = resp;
			this.customers_account = this.util.dataSort(this.customers.slice() , "eval_account", "desc");
			this.customers_rate = this.util.dataSort(this.customers.slice() , "profits_rate", "desc");
			this.cnt_customers = this.customers.length;

		}, (err) => {
			console.log("home cust",err);
		});
	}


	init(){
		this.storage.get('user_data').then((data) => {
			// 간헐적으로 데이터 처리를 못해 한 번 더 호출
			if(data == null) {
				this.storage.get('user_data').then((data) => {
					
					if(data == null ) return this.router.navigateByUrl('/login');
					else {
						this.user_id = data.user_id;
						this.getCustomList(data.user_id);
						this.getUploadDate(data.user_id);	
					}
				});
			} else {
				this.user_id = data.user_id;
				this.getCustomList(data.user_id);
				this.getUploadDate(data.user_id);
			}
		}).catch((err)=>{
			console.log("get user date error: ", err);
		});	
	}


	getFiles(): FileLikeObject[] {
		return this.fileUploader.queue.map((FileItem) => {
			return FileItem.file;
		});
	}

	// 업데이트 날짜정보 가지고 오기
	getUploadDate(user_id) {
		let req = new FormData();
		req.append("fp_id", user_id);
		return this.api.post('uploadDate', req).subscribe( (res:any) => {
			console.log("업로드일자 : ", res);
			this.storage.set("upload_date", res);

			if(res.length > 0) {
				this.last_upload_date = res[0];
				this.getRecentFpTotalAsset(user_id);  

			} else {
				console.log("업로드 횟수 : ",res.length)
			}
		});
	}

	// Fp 모집자산 데이터 가지고 오기 (서버)
	getRecentFpTotalAsset(user_id){
		let req = new FormData();
		req.append("fp_id", user_id);
		req.append("balance_date", this.last_upload_date.balance_date);

		return this.api.post('recentFpTotalAsset', req).subscribe( (res:any) => {
			console.log("total_asset : ", res);
			this.recent_fp_asset = this.setChartData(res);

			/* 차트 로딩 */
			console.log("recent_fp_asset : ", this.recent_fp_asset);
			google.charts.load('current', { 'packages': ['corechart'] });
			google.charts.setOnLoadCallback(this.drawChart);

		});
	}

	// 차트 데이터 만들기
	setChartData(data:any): any {

		this.total_account = 0;
		data.sort((a, b) => {
			return b.account - a.account;
		});

		let recent_asset = [];
		recent_asset.push(["자산종류", "금액"]);
		data.forEach((el) => {
			let asset = []
			asset.push(this.asset_cds[el.asset_cd]);
			asset.push(el.account);
			recent_asset.push(asset);
			this.total_account += el.account;
		});
		return recent_asset;
	}

	gotoCustDetail(custId, custNm) {
		this.router.navigate(['/app/tabs/customer/detail' ,{cust_id : custId, cust_nm : custNm}]);
	}

	// 파일 업로드 처리
	uploadingFiles() {

		let files = this.getFiles();
		this.fileCount = files.length;
		if(this.fileCount > 0) 
			this.processLoading();
		else alert("파일을 첨부하세요."); 
		
		files.forEach(async (file) => {
			let formData = new FormData();
			console.log("upload fp_id : ", this.user_id);
			formData.append('file', file.rawFile, file.name);
			formData.append('fp_id', this.user_id);

			return this.api.post('upload/upload-xls', formData).subscribe((resp) => {
				console.log('데이터 처리 완료');
				console.log(resp);
				this.resultCount ++;
				if(this.fileCount == this.resultCount) {
					this.processDismiss();
					this.resultCount = 0
				}
				this.resultFileUpload(resp);
			}, (err) => {
				console.log('파일 업로드 실패');
				console.log(err);
				this.processDismiss();
			});
		});
	}

	uploadingFilesReset() {
		this.fileUploader = new FileUploader({});
	}

	resultFileUpload(result){
		this.getCustomList(this.user_id);
		this.getUploadDate(this.user_id);
		console.log("file upload update : ", this.user_id);
		
		let header = "";
		let message = result.filename;
		
		if(result.success) header = "데이터 처리 성공";
		else header = "데이터 처리 실패"
		
		console.log("result.checkCust.length : ",result.checkCust.length);

		if(result.checkCust.length > 0)
			this.resultConfirm(header, message, result.checkCust);
		else 
			//this.resultAlert(header, message);
			this.resultToast(header, message);
		this.uploadingFilesReset();
	}

	async resultAlert(_header, filename){
		const alert = this.alertCtl.create({
			header: "처리결과",
			subHeader: _header,
			message: filename,
			buttons: [
				{
					text: '확인'
				}
			],
		});  
		await (await alert).present();
	}


	async resultConfirm(_header, filename, customers) {
		const alert = await this.alertCtl.create({
		  header: '처리결과',
		  subHeader: _header,
		  message: filename + '<br/> 등록된 고객님들중 동일한 고객으로 판단되는 건이 있습니다. 확인하시겠습니까?',
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
				this.mergeCust(customers);
				console.log('Check customer : ', customers);
			  }
			}
		  ]
		});
	
		await alert.present();
	}
	async mergeCust(cust) {
		const modal = await this.modalController.create({
		  component: CustMergePage,
		  componentProps: {customers: cust} 
		});
		return await modal.present();
	}	


	async resultToast(header, massege) {
		const toast = await this.toastController.create({
		  header: header,
		  message: massege,
		  position: 'bottom',
		  duration: 2000,
		  showCloseButton: true,

		//   buttons: [
		// 	// {
		// 	//   side: 'start',
		// 	//   icon: 'star',
		// 	//   text: 'Favorite',
		// 	//   handler: () => {
		// 	// 	console.log('Favorite clicked');
		// 	//   }
		// 	// },
		// 	{
		// 	  text: '확인',
		// 	  role: 'cancel',
		// 	  handler: () => {
		// 		// console.log('Cancel clicked');
		// 	  }
		// 	}
		//   ]
		});
		toast.present();
	  }

	  async processLoading() {
		this.isLoading = true
		return await this.loadingController.create({
		  message: '처리 중 입니다...',
		  duration: 20000
		}).then( a => {
			a.present().then(()=>{
				if(!this.isLoading){
					a.dismiss().then(()=>console.log("Finish!"));
				}
			});
		});
	  }

	  async processDismiss() {
		this.isLoading = false;
		return await this.loadingController.dismiss().then(() => console.log("loading dismiss"));
	  }
	  

}
