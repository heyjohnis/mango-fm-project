import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Api } from '../../../providers/api/api';

@Component({
  selector: 'fa-modal',
  templateUrl: './fa-modal.page.html',
  styleUrls: ['./fa-modal.page.scss'],
})
export class FaModalPage implements OnInit {

  private fa_code: string = 'su1234';
  private search_key: string = '';
  private users: any;

  constructor(
    private modalCtrl: ModalController,
    private api: Api
  ) { }

  ngOnInit() {
  }

  inpSearchKey(){
    if(this.search_key.length > 1 ){
      let formData = new FormData();
      formData.append('search_key', this.search_key)
      this.api.post('user/checkFaCode', formData).subscribe( (users:any) =>{
        console.log("get data : ",users);
        this.users = users;
      });
    }
  }

  dismiss(user){
    let _fa_code = '';
    if(user != null) _fa_code = user.fa_code;

    this.modalCtrl.dismiss({
      fa_code: _fa_code,
    });
  }

  closeModal(){
    this.modalCtrl.dismiss({fa_code:''});
  }


}
