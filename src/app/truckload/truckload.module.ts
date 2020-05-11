import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TruckloadPageRoutingModule } from './truckload-routing.module';

import { TruckloadPage } from './truckload.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TruckloadPageRoutingModule
  ],
  declarations: [TruckloadPage]
})
export class TruckloadPageModule {}
