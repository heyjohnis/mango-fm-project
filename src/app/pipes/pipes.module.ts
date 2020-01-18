import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustPipe } from './cust.pipe';

@NgModule({
  declarations: [CustPipe],
  imports: [
    CommonModule
  ],
  exports: [
    CustPipe
  ]
})
export class PipesModule { }
