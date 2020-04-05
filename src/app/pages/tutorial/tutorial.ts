import { Component, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
import { FileUploader, FileLikeObject } from 'ng2-file-upload';

import { Router } from '@angular/router';

import { MenuController, IonSlides, LoadingController, AlertController } from '@ionic/angular';

import { Storage } from '@ionic/storage';
import { Api } from '../../providers/api/api';

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html',
  styleUrls: ['./tutorial.scss'],
})
export class TutorialPage implements OnInit {
	showSkip = true;

	public fileUploader: FileUploader = new FileUploader({});
	public hasBaseDropZoneOver: boolean = false;
	public uid: string;
	public users: any;
	public user_id: string = '';
	public file_nm: string = '';
	public isLoading = false;
	public fileCount = 0;
	public resultCount = 0;
	@ViewChild('slides', { static: true }) slides: IonSlides;

	constructor(
		public menu: MenuController,
		public router: Router,
		public storage: Storage,
		public loadingController: LoadingController,
		public api: Api,
		public alertCtl: AlertController
	) {}

	ngOnInit() {
		this.storage.get('user_data').then((data) => {
			console.log(data.user_id);
			this.user_id = data.user_id;
		});


	}

	startApp() {
		this.router.navigateByUrl('/app/tabs/home');
	}

	onSlideChangeStart(event) {
		event.target.isEnd().then(isEnd => {
			this.showSkip = !isEnd;
		});
	}

  // ionViewWillEnter() {
  //   this.storage.get('ion_did_tutorial').then(res => {
  //     if (res === true) {
  //       this.router.navigateByUrl('/app/tabs/home');
  //     }
  //   });

  //   this.menu.enable(false);
  // }

	ionViewDidLeave() {
		// enable the root left menu when leaving the tutorial page
		this.menu.enable(true);
	}
	next() {
		this.slides.slideNext();
	}

	prev() {
		this.slides.slidePrev();
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

			return this.api.post('upload/upload-xls', formData).subscribe((resp: any) => {
				console.log('데이터 처리 완료');
				console.log(resp);
				this.setTotalAssetCalculate(resp);
			}, (err) => {
				console.log('파일 업로드 실패');
				console.log(err);
				this.processDismiss();
			});
		});
	}

	fileOverBase( event, file_type): void {
		this.hasBaseDropZoneOver = event;
		let upload_file = this.getFiles();
		console.log("upload_file_nm " ,upload_file);
		if(upload_file.length > 0) {
			let upload_file_nm = upload_file[0].name.normalize('NFC');
			let idx = upload_file_nm.indexOf(file_type.normalize('NFC'));
			if(idx < 0) {
				this.alert('파일오류','잘못된 파일입니다. 파일을 다시확인해주세요', this.uploadingFilesReset());
				//this.uploadingFilesReset();
			} else {
				this.uploadingFiles();
			}

		}
	}
  
	getFiles(): FileLikeObject[] {
		return this.fileUploader.queue.map((FileItem) => {
			console.log("FileNm : ", FileItem);
			return FileItem.file;
		});
	}

  	async processLoading() {
		this.isLoading = true
		return await this.loadingController.create({
			message: '처리 중 입니다...',
			duration: 120000
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
	
	uploadingFilesReset() {  
		console.log("reset");
		this.fileUploader = new FileUploader({});
	}

	async alert(title, massage, func){
		const alert = await this.alertCtl.create({
			header: title,
			//subHeader: 'Subtitle',
			message: massage,
			buttons: [
        {
          text:'확인',
          handler: func
        }
      ]
		});  
    await alert.present();
  }

  setTotalAssetCalculate(resp){
	let formData = new FormData();
	formData.append('fp_id', this.user_id);
	formData.append('balance_date', resp.balance_date);
	return this.api.post('fund/calAssetRate', formData).subscribe((res) => {
		console.log("total asset : ", res);
		this.processDismiss();
		this.uploadingFilesReset();
		this.alert('처리완료', '데이터 처리가 완료되었습니다.', this.next());
	}, (err)=>{
		console.log("total asset err: ", err);
	});
}

}
