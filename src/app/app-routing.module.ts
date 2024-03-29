import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'ftl-upload/:success',
    loadChildren: () => import('./ftl-upload/ftl-upload.module').then( m => m.FtlUploadPageModule)
  },
  {
    path: 'truckload/:id',
    loadChildren: () => import('./truckload/truckload.module').then( m => m.TruckloadPageModule)
  },
  {
    path: 'truck-item',
    loadChildren: () => import('./modals/truck-item/truck-item.module').then( m => m.TruckItemPageModule)
  },
  {
    path: 'single-truck/:id',
    loadChildren: () => import('./single-truck/single-truck.module').then( m => m.SingleTruckPageModule)
  },  {
    path: 'inbound',
    loadChildren: () => import('./inbound/inbound.module').then( m => m.InboundPageModule)
  },
  {
    path: 'outbound',
    loadChildren: () => import('./outbound/outbound.module').then( m => m.OutboundPageModule)
  },
  {
    path: 'checkout',
    loadChildren: () => import('./checkout/checkout.module').then( m => m.CheckoutPageModule)
  },
  {
    path: 'document-upload',
    loadChildren: () => import('./document-upload/document-upload.module').then( m => m.DocumentUploadPageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
