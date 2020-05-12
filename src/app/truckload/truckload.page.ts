import { Component, OnInit } from '@angular/core';
import { GlobalConstants } from '../common/global';

@Component({
  selector: 'app-truckload',
  templateUrl: './truckload.page.html',
  styleUrls: ['./truckload.page.scss'],
})
export class TruckloadPage implements OnInit {

  constructor() { }

  truckItems: any;

  async ngOnInit() {
    var url = window.location.href;
    var splitUrl = url.split("/");
    var truckId = splitUrl[4];

    var truckIdText = document.getElementById("truckId");
    truckIdText.innerHTML = truckId;

    await this.getTruckItems();
    console.log(this.truckItems);
  }

  getTruckItems() {
    this.truckItems = GlobalConstants.truckItems;
  }

  addNewItem() {
    console.log("add new item");
  }
}
