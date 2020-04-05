import { Component, OnInit } from '@angular/core';
import { Api } from '../../providers/api/api';
import { Router } from '@angular/router';
declare var user_type_cds: any;

@Component({
  selector: 'user-manage',
  templateUrl: './user-manage.page.html',
  styleUrls: ['./user-manage.page.scss'],
})
export class UserManagePage implements OnInit {

  public users: any;
  public user_id: string = '';
  public user_nm: string = '';
  public user_type: string = '';
  public email: string = '';
  public search_user_nm: string = '';
  public user_type_cds;

  constructor(
    private api: Api,
    private router: Router
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
		formData.append("apply_yn", '');
		formData.append("order_by", '');
		formData.append("order_by_type", '');

    console.log("search_user_nm : ", this.search_user_nm);

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
}
