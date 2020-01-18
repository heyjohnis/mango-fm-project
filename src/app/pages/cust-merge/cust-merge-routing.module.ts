import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustMergePage } from './cust-merge.page';

const routes: Routes = [
  {
    path: '',
    component: CustMergePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustMergePageRoutingModule {}
