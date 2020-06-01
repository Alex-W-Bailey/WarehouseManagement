import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TruckItemPage } from './truck-item.page';

const routes: Routes = [
  {
    path: '',
    component: TruckItemPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TruckItemPageRoutingModule {}
