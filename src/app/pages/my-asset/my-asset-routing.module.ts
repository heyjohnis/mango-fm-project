import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyAssetPage } from './my-asset.page';

const routes: Routes = [
  {
    path: '',
    component: MyAssetPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyAssetPageRoutingModule {}
