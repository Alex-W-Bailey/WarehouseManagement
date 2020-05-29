import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FtlUploadPage } from './ftl-upload.page';

const routes: Routes = [
  {
    path: '',
    component: FtlUploadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FtlUploadPageRoutingModule {}
