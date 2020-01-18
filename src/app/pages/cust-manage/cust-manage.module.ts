import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustManagePageRoutingModule } from './cust-manage-routing.module';

import { CustManagePage } from './cust-manage.page';
import { PipesModule } from '../../pipes/pipes.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustManagePageRoutingModule,
    PipesModule
  ],
  declarations: [CustManagePage]
})
export class CustManagePageModule {}
