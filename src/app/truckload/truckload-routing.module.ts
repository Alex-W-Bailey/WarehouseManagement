import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TruckloadPage } from './truckload.page';

const routes: Routes = [
  {
    path: '',
    component: TruckloadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TruckloadPageRoutingModule {}
