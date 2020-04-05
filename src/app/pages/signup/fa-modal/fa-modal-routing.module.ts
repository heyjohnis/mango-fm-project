import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FaModalPage } from './fa-modal.page';

const routes: Routes = [
  {
    path: '',
    component: FaModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FaModalPageRoutingModule {}
