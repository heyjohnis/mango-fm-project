import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BoardDetailPageRoutingModule } from './board-detail-routing.module';

import { BoardDetailPage } from './board-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BoardDetailPageRoutingModule
  ],
  declarations: [BoardDetailPage]
})
export class BoardDetailPageModule {}
