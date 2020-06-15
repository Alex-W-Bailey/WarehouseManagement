import { Component } from '@angular/core';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor() {}

  async logout() {
    await Storage.set({
      key: "catalog_remember_login",
      value: "false"
    });

    await Storage.set({
      key: "catalog_truckItems",
      value: undefined
    });

    await Storage.set({
      key: "catalog_singleTruckImgs",
      value: JSON.stringify([])
    });

    await Storage.set({
      key: "catalog_truckstart",
      value: undefined
    });

    await Storage.set({
      key: "catalog_truckloadsID",
      value: undefined
    });

    window.location.href = "/login";
  }

  ftlUpload() {
    window.location.href = "/ftl-upload/0";
  }

  inbound() {
    window.location.href = "/inbound";
  }

  outbound() {
    window.location.href = "/outbound";
  }

  checkout() {
    window.location.href = "/checkout";
  }
}
