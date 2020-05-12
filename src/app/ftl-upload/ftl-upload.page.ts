import { Component, OnInit, Renderer2 } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { BarcodeScanner, BarcodeScannerOptions } from "@ionic-native/barcode-scanner/ngx";
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ModalpagePage } from '../modals/modalpage/modalpage.page';
import { Plugins } from '@capacitor/core';
import { GlobalConstants } from '../common/global'
import { interval } from 'rxjs';

const { Storage } = Plugins

@Component({
  selector: 'app-ftl-upload',
  templateUrl: './ftl-upload.page.html',
  styleUrls: ['./ftl-upload.page.scss'],
})
export class FtlUploadPage implements OnInit {

  truckID: string = "";

  constructor(private barcodeCtrl: BarcodeScanner, private camera: Camera, private renderer: Renderer2, private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  createNewTruck() {
    var truckSection = document.getElementById("truckSection");
    var newTruckSetion = document.getElementById("newTruckSection");

    truckSection.classList.add("hide");
    newTruckSetion.classList.remove("hide");
  }

  async startNewTruck() {
    const { truckID } = this;

    await this.saveTruckloadID(truckID);
    await this.saveTruckloadStart();

    window.location.href = `/truckload/${truckID}`;
  }

  async saveTruckloadID(truckID) {
    await Storage.set({
      key: "catalog_truckloadsID",
      value: truckID
    });
  }

  async saveTruckloadStart() {
    var today = new Date();
    
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ' ' + time;

    console.log("time: " + dateTime);

    await Storage.set({
      key: "catalog_truckstart",
      value: dateTime
    });
  }

  cancel() {
    var truckSection = document.getElementById("truckSection");
    var newTruckSetion = document.getElementById("newTruckSection");

    truckSection.classList.remove("hide");
    newTruckSetion.classList.add("hide");
  }
}