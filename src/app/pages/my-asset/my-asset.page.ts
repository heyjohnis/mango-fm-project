import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { Api } from '../../providers/api/api';

@Component({
  selector: 'my-asset',
  templateUrl: './my-asset.page.html',
  styleUrls: ['./my-asset.page.scss'],
})
export class MyAssetPage implements OnInit {

  public login_code: string = "";

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private api: Api,
      private storage: Storage
    ) { }

  ngOnInit() {
    this.login_code = this.route.snapshot.paramMap.get('login_code');
    this.getData(this.login_code);
  }


  getData(code){
    let formData = new FormData();
    formData.append("login_code", code);
    return this.api.post('fund/loginCode', formData).subscribe( (res: any) => {
        console.log("code : ",res);
        this.storage.set('cust_id', res.cust_id).then(()=>{
          return this.router.navigate(['/app/tabs/my-asset']);
        });
    });
  }

}
