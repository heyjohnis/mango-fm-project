import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { GoogleChartsModule } from 'angular-google-charts';
import * as Kakao from '../assets/js/kakao.min';


import { Api } from './providers/api/api';
import { UploadingService } from './providers/uploading.service';
import { CustomerService } from './providers/customer.service';
import { MyfireService } from './providers/myfire.service'

import * as firebase from 'firebase';
//import * as admin from 'firebase-admin';


// import * as admin from 'firebase-admin';
//declare var admin: any;

firebase.initializeApp(environment.firebase);
// admin.initializeApp({
//   credential: admin.credential.applicationDefault(),
//   databaseURL: 'https://finance-monitor-5d0ee.firebaseio.com'
// });

Kakao.init('0325775847f127216d65b8d03254c15e');


@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production
    })
  ],
  declarations: [AppComponent,],
  providers: [InAppBrowser, SplashScreen, StatusBar, Api, UploadingService, CustomerService, MyfireService],
  bootstrap: [AppComponent]
})
export class AppModule {}
