import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SignupPage } from './signup';
import { FaModalPageModule  } from './fa-modal/fa-modal.module'
import { SignupPageRoutingModule } from './signup-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignupPageRoutingModule,
    FaModalPageModule
  ],
  declarations: [
    SignupPage,
  ]
})
export class SignUpModule { }
