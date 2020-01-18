import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustManageDetailPageRoutingModule } from './cust-manage-detail-routing.module';

import { CustManageDetailPage } from './cust-manage-detail.page';
import { CustListPage } from '../../cust-list/cust-list.page'
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustManageDetailPageRoutingModule,
    PipesModule

  ],
  declarations: [
    CustManageDetailPage,
    CustListPage
  ],
  entryComponents: [
    CustListPage
  ]
})
export class CustManageDetailPageModule {}
