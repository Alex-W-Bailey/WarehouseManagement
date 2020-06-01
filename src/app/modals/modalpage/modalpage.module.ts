import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalpagePageRoutingModule } from './modalpage-routing.module';

import { ModalpagePage } from './modalpage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalpagePageRoutingModule,
  ],
  declarations: [ModalpagePage],
})
export class ModalpagePageModule {}
