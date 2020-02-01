import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserManagePage } from './user-manage.page';

const routes: Routes = [
  {
    path: '',
    component: UserManagePage
  },
  {
    path: 'user-manage-detail',
    loadChildren: () => import('./user-manage-detail/user-manage-detail.module').then( m => m.UserManageDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserManagePageRoutingModule {}
