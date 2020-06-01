import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SingleTruckPageRoutingModule } from './single-truck-routing.module';

import { ModalpagePage } from '../modals/modalpage/modalpage.page';
import { SingleTruckPage } from './single-truck.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SingleTruckPageRoutingModule
  ],
  declarations: [SingleTruckPage, ModalpagePage],
  entryComponents: [ModalpagePage]
})
export class SingleTruckPageModule {}
