import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FtlUploadPageRoutingModule } from './ftl-upload-routing.module';

import { FtlUploadPage } from './ftl-upload.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FtlUploadPageRoutingModule
  ],
  declarations: [FtlUploadPage],
})
export class FtlUploadPageModule {}
