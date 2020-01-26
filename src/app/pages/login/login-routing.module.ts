import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginPage } from './login';

const routes: Routes = [
  {
    path: '',
    component: LoginPage
  },
  {
    path: 'anonymous-login',
    loadChildren: () => import('./anonymous-login/anonymous-login.module').then( m => m.AnonymousLoginPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginPageRoutingModule { }
