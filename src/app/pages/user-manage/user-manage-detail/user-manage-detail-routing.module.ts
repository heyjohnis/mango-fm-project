import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserManageDetailPage } from './user-manage-detail.page';

const routes: Routes = [
  {
    path: '',
    component: UserManageDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserManageDetailPageRoutingModule {}
