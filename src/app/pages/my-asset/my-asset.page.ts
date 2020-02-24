import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { Api } from '../../providers/api/api';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'my-asset',
  templateUrl: './my-asset.page.html',
  styleUrls: ['./my-asset.page.scss'],
})
export class MyAssetPage implements OnInit {

  public login_code: string = "";
  isLoading: boolean = false;
  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private api: Api,
      private storage: Storage,
      private loadingController: LoadingController
    ) { }

  ngOnInit() {
    //this.processLoading();
    this.login_code = this.route.snapshot.paramMap.get('login_code');
    this.getData(this.login_code);
  }


  getData(code){
    let formData = new FormData();
    formData.append("login_code", code);
    return this.api.post('fund/loginCode', formData).subscribe( (res: any) => {
        console.log("code : ",res);
        this.storage.set('cust_id', res.cust_id).then(()=>{
          //this.processDismiss();
          //return this.router.navigate(['/app/tabs/my-asset']);
          return this.router.navigateByUrl('/app/tabs/my-asset');
        });
    });
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
