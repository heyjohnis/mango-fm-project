import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustMergePageRoutingModule } from './cust-merge-routing.module';

import { CustMergePage } from './cust-merge.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustMergePageRoutingModule
  ],
  declarations: [CustMergePage]
})
export class CustMergePageModule {}
