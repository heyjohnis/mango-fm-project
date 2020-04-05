import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FaModalPageRoutingModule } from './fa-modal-routing.module';

import { FaModalPage } from './fa-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FaModalPageRoutingModule
  ],
  declarations: [FaModalPage]
})
export class FaModalPageModule {}
