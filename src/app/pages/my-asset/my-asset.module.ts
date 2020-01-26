import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyAssetPageRoutingModule } from './my-asset-routing.module';

import { MyAssetPage } from './my-asset.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyAssetPageRoutingModule
  ],
  declarations: [MyAssetPage]
})
export class MyAssetPageModule {}
