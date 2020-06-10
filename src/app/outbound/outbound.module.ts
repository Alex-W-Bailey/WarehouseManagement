import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OutboundPageRoutingModule } from './outbound-routing.module';

import { OutboundPage } from './outbound.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OutboundPageRoutingModule
  ],
  declarations: [OutboundPage]
})
export class OutboundPageModule {}
