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

    window.location.href = "/login";
  }

  ftlUpload() {
    window.location.href = "/ftl-upload";
  }
}
