import { Injectable } from '@angular/core';
import { Api } from './api/api';
// import { SockJS } from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class UploadingService {

  constructor( public api: Api ) { }

  public uploadFormData(fromData): any {
    return this.api.post('upload/upload-xls', fromData).subscribe((resp) => {
      console.log('서버접속이 성공');
      console.log(resp);
    }, (err) => {
      console.log('서버접속이 실패됨');
      console.log(err);
    });
  }
}
