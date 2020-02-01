import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserManageDetailPageRoutingModule } from './user-manage-detail-routing.module';

import { UserManageDetailPage } from './user-manage-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserManageDetailPageRoutingModule
  ],
  declarations: [UserManageDetailPage]
})
export class UserManageDetailPageModule {}
