import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { TruckloadPageRoutingModule } from './truckload-routing.module';
import { TruckloadPage } from './truckload.page';

import { ModalpagePage } from '../modals/modalpage/modalpage.page';
import { TruckItemPage } from '../modals/truck-item/truck-item.page'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TruckloadPageRoutingModule
  ],
  declarations: [TruckloadPage, ModalpagePage, TruckItemPage],
  entryComponents: [ModalpagePage, TruckItemPage]
})
export class TruckloadPageModule {}
