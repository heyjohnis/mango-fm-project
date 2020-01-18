import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustManagePage } from './cust-manage.page';

const routes: Routes = [
  {
    path: '',
    component: CustManagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustManagePageRoutingModule {}
