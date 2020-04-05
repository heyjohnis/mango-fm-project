import { Component, OnInit } from '@angular/core';
import { Api } from '../../../providers/api/api';
import { Router } from '@angular/router';
import { UserDetailPage } from './user-detail/user-detail.page'
import { ModalController } from '@ionic/angular';

declare var user_type_cds: any;

@Component({
  selector: 'user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {

	public users: any;
	public user_id: string = '';
	public user_nm: string = '';
	public user_type: string = '';
	public email: string = '';
	public search_user_nm: string = '';
	public user_type_cds;
	public idx = 0;
	public apply_yn: string = '';
	public order_by: string = '';
	public order_by_type: any = {
		'user_nm':0, 'user_id':0, 'eval_account':0, 
		'cust_cnt':0, 'upload_cnt':0, 'last_upload_date':0, 'reg_date':0
	};

	public isApply: boolean = false;

	constructor(
		private api: Api,
		private router: Router,
		private modal: ModalController
	) { 
		this.user_type_cds = user_type_cds;
	}

	ngOnInit() {
		this.getUsers();
	}

	getUsers(){
		let formData = new FormData();
		formData.append("user_id", this.user_id);
		formData.append("user_nm", this.user_nm);
		formData.append("user_type", this.user_type);
		formData.append("email", this.email);
		formData.append("search_user_nm", this.search_user_nm);
		formData.append("apply_yn", this.apply_yn);
		formData.append("order_by", this.order_by);
		formData.append("order_by_type", this.order_by_type[this.order_by] == 0 ? 'ASC' : 'DESC');
		return this.api.post('user/getUsers', formData).subscribe( (resp) => {
			this.users = resp;
			console.log("users :",this.users);
		});
	}
	
	setUserType(type){
		let user_type = '';
		if(type != '') user_type = this.user_type_cds[type];
		else user_type = '고객';
		return user_type;
	}

	gotoDetail(user) {
		this.router.navigate(['/user-manage/detail' ,user]);
	}
	
	async modalDetail(user, idx) {
		this.idx = idx;
		const modal = await this.modal.create({
			component: UserDetailPage,
			componentProps: {user: user}
		});

		modal.onDidDismiss().then((res)=>{
			if(res.data != undefined) {
				if(res.data.type == "mod")
					this.updateUserInfo(res.data.user);
				else this.users.splice(this.idx, 1);
			}
		});
		return await modal.present();
	}

	updateUserInfo(data: any){
		let formData = new FormData();
		formData.append('user_id', data.user_id);
		formData.append('user_type', data.user_type);
		formData.append('mobile', data.mobile);
		formData.append('fa_code', data.fa_code);
		formData.append('apply_yn', data.apply_yn);
		formData.append('branch_nm', data.branch_nm);

		return this.api.post('user/updateUserInfo', formData).subscribe( (resp) => {
			this.users.splice(this.idx, 1, data);
			console.log("response : ", resp);
			console.log("users : ", this.users);
		});

	}

	checkIsApply(){
		 this.apply_yn = this.isApply ?  'n' : 'y';
		 console.log("isApply : ", this.isApply);
		 console.log("apply_no : ", this.apply_yn);
		 this.getUsers();
	}

	orderBy(order_by){
		this.order_by = order_by;
		this.order_by_type[order_by] = this.order_by_type[order_by] == 0 ? 1 : 0;
		console.log(this.order_by_type[order_by])
		this.getUsers();
	}

}