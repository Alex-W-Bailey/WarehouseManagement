import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SingleTruckPage } from './single-truck.page';

const routes: Routes = [
  {
    path: '',
    component: SingleTruckPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SingleTruckPageRoutingModule {}
