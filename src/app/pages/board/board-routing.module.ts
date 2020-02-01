import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BoardPage } from './board.page';

const routes: Routes = [
  {
    path: '',
    component: BoardPage
  },
  {
    path: 'board-detail',
    loadChildren: () => import('./board-detail/board-detail.module').then( m => m.BoardDetailPageModule)
  },
  {
    path: 'board-edit',
    loadChildren: () => import('./board-edit/board-edit.module').then( m => m.BoardEditPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BoardPageRoutingModule {}
