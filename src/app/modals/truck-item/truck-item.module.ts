import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TruckItemPageRoutingModule } from './truck-item-routing.module';

import { TruckItemPage } from './truck-item.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TruckItemPageRoutingModule
  ],
  declarations: [TruckItemPage]
})
export class TruckItemPageModule {}
