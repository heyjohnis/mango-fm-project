import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnonymousLoginPage } from './anonymous-login.page';

const routes: Routes = [
  {
    path: '',
    component: AnonymousLoginPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnonymousLoginPageRoutingModule {}
