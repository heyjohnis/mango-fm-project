import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SignupPage } from './signup';

const routes: Routes = [
  {
    path: '',
    component: SignupPage
  },
  {
    path: 'fa-modal',
    loadChildren: () => import('./fa-modal/fa-modal.module').then( m => m.FaModalPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignupPageRoutingModule { }
