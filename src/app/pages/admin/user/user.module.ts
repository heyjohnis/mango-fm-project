import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserPageRoutingModule } from './user-routing.module';
import { PipesModule } from '../../../pipes/pipes.module';

import { UserPage } from './user.page';
import { UserDetailPageModule  } from './user-detail/user-detail.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserPageRoutingModule,
    UserDetailPageModule,
    PipesModule
  ],
  declarations: [UserPage]
})
export class UserPageModule {}
