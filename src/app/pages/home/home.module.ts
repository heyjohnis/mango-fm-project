import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HomePage } from './home.page';
import { FileUploadModule } from 'ng2-file-upload';
import { CustMergePage } from '../cust-merge/cust-merge.page';
import { PipesModule } from '../../pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: HomePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    FileUploadModule,
    PipesModule,
  ],
  declarations: [
    HomePage,
    CustMergePage,
  ],
  entryComponents: [
    CustMergePage
  ]
})
export class HomePageModule {}
