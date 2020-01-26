import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnonymousLoginPageRoutingModule } from './anonymous-login-routing.module';

import { AnonymousLoginPage } from './anonymous-login.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AnonymousLoginPageRoutingModule
  ],
  declarations: [AnonymousLoginPage]
})
export class AnonymousLoginPageModule {}
