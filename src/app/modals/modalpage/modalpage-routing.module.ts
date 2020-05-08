import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalpagePage } from './modalpage.page';

const routes: Routes = [
  {
    path: '',
    component: ModalpagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalpagePageRoutingModule {}
