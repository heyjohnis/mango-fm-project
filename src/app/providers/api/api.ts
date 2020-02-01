import { HttpClient, HttpParams } from '@angular/common/http';
import { Location, isPlatformBrowser} from '@angular/common';
import { Injectable, OnInit } from '@angular/core';
import { SafeResourceUrl  } from '@angular/platform-browser';

/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class Api {

  domain: string = "";
  //url: string = 'http://jhouse.tjc.or.kr:8080';
  url: string = "http://211.49.99.112:8080";
  
  constructor(
    public http: HttpClient, 
    public location: Location,
    ) {
    console.log("getState: ",location.getState());
    console.log("path: ",location.path());
    console.log("get url: ",window.location.href);
    console.log("isPlatformBrowser: ", isPlatformBrowser);
    this.domain = this.getDomain(window.location.href);
    //this.url = "http://"+this.domain+":8080";
    console.log(this.url);
  }

  getDomain(uri): string{
    return uri.replace('http://','').replace('https://','').split(/[/?#]/)[0].split(/[/:]/)[0];
  }

  get(endpoint: string, params?: any, reqOpts?: any) {
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams()
      };
    }

    if (params) {
      reqOpts.params = new HttpParams();
      for ( let k in params ) {
        reqOpts.params = reqOpts.params.set(k, params[k]);
      }
    }
    return this.http.get(this.url + '/' + endpoint, reqOpts);
  }

  post(endpoint: string, body: any, reqOpts?: any) {
    let url = this.url + '/' + endpoint;
    console.log('url  : ', url);
    return this.http.post<any>(url, body, reqOpts);
  }

  put(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(this.url + '/' + endpoint, body, reqOpts);
  }

  delete(endpoint: string, reqOpts?: any) {
    return this.http.delete(this.url + '/' + endpoint, reqOpts);
  }

  patch(endpoint: string, body: any, reqOpts?: any) {
    return this.http.patch(this.url + '/' + endpoint, body, reqOpts);
  }
}
