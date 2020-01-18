import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustManageDetailPage } from './cust-manage-detail.page';

const routes: Routes = [
  {
    path: '',
    component: CustManageDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustManageDetailPageRoutingModule {}
