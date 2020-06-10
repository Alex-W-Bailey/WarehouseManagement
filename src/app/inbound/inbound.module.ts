import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InboundPageRoutingModule } from './inbound-routing.module';
import { TooltipsModule } from 'ionic-tooltips';
import { InboundPage } from './inbound.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InboundPageRoutingModule,
    TooltipsModule.forRoot()
  ],
  declarations: [InboundPage]
})
export class InboundPageModule {}
