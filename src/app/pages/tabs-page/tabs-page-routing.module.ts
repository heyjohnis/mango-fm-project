import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs-page';


const routes: Routes = [
	{
		path: 'tabs',
		component: TabsPage,
		children: [
			{
				path: 'home',
				children: [
					{
						path: '',
						loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
					}
				]
			},
			{
				path: 'about',
				children: [
					{
						path: '',
						loadChildren: () => import('../about/about.module').then(m => m.AboutModule)
					}
				]
			},
			{
				path: 'customer',
				children: [
					{
						path: '',
						loadChildren: () => import('../customer/customer.module').then(m => m.CustomerPageModule)
					},
					{
					path: 'quick/:order_by',
					loadChildren: () => import('../customer/customer.module').then(m => m.CustomerPageModule)
					},
					{
						path: 'detail',
						loadChildren: () => import('../customer/customer-detail/customer-detail.module').then(m => m.CustomerDetailPageModule)
					},
					{
						path: 'detail/assetResult',
						loadChildren: () => import('../asset/asset-result/asset-result.module').then(m => m.AssetResultPageModule)
					}

				]
			},
			{
				path: 'my-asset',
				children: [
					{
						path: '',
						loadChildren: () => import('../customer/customer-detail/customer-detail.module').then(m => m.CustomerDetailPageModule)
					},
					{
						path: 'assetResult',
						loadChildren: () => import('../asset/asset-result/asset-result.module').then(m => m.AssetResultPageModule)
					}
				]
			},
			{
				path: 'asset',
				children: [
					{
						path: '',
						loadChildren: () => import('../asset/asset.module').then(m => m.AssetPageModule)
					},
					{
						path: 'detail',
						loadChildren: () => import('../asset/asset-detail/asset-detail.module').then(m => m.AssetDetailPageModule)
					},
					{
						path: 'detail/assetResult',
						loadChildren: () => import('../asset/asset-result/asset-result.module').then(m => m.AssetResultPageModule)
					}
				]
			},
			{
				path: '',
				redirectTo: '/',
				pathMatch: 'full'
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class TabsPageRoutingModule { }

