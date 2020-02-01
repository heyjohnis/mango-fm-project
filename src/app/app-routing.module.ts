import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckTutorial } from './providers/check-tutorial.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/tutorial',
    pathMatch: 'full'
  },
  {
    path: 'account',
    loadChildren: () => import('./pages/account/account.module').then(m => m.AccountModule)
  },
  {
    path: 'support',
    loadChildren: () => import('./pages/support/support.module').then(m => m.SupportModule)
  },
  {
    path: 'cust-manage',
    children: [
      {
        path: '', 
        loadChildren: () => import('./pages/cust-manage/cust-manage.module').then(m => m.CustManagePageModule)
      },
      {
        path: 'detail',
        loadChildren: () => import('./pages/cust-manage/cust-manage-detail/cust-manage-detail.module').then(m => m.CustManageDetailPageModule)
      }
    ]
  },

  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'login/anonymous',
    loadChildren: () => import('./pages/login/anonymous-login/anonymous-login.module').then(m => m.AnonymousLoginPageModule)
  },

  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then(m => m.SignUpModule)
  },
  {
    path: 'app',
    loadChildren: () => import('./pages/tabs-page/tabs-page.module').then(m => m.TabsModule)
  },
  {
    path: 'tutorial',
    loadChildren: () => import('./pages/tutorial/tutorial.module').then(m => m.TutorialModule),
    canLoad: [CheckTutorial]
  },
  {
    path: 'my/:login_code',
    loadChildren: () => import('./pages/my-asset/my-asset.module').then( m => m.MyAssetPageModule)
  },
  {
    path: 'user-manage',
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/user-manage/user-manage.module').then( m => m.UserManagePageModule),
      },
      {
        path: 'detail',
        loadChildren: () => import('./pages/user-manage/user-manage-detail/user-manage-detail.module').then( m => m.UserManageDetailPageModule)
      }
    ]
  },
  {
    path: 'board',
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/board/board.module').then( m => m.BoardPageModule)
      },
      {
        path: 'detail',
        loadChildren: () => import('./pages/board/board-detail/board-detail.module').then( m => m.BoardDetailPageModule)
      },
      {
        path: 'edit',
        loadChildren: () => import('./pages/board/board-edit/board-edit.module').then( m => m.BoardEditPageModule)
      }
    ]
    
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
