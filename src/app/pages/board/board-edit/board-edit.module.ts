import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BoardEditPageRoutingModule } from './board-edit-routing.module';

import { BoardEditPage } from './board-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BoardEditPageRoutingModule
  ],
  declarations: [BoardEditPage]
})
export class BoardEditPageModule {}
