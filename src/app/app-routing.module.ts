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
    path: 'ftl-upload',
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
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
