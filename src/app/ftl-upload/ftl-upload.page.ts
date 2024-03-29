import { Component, OnInit, Renderer2 } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { BarcodeScanner, BarcodeScannerOptions } from "@ionic-native/barcode-scanner/ngx";
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ModalpagePage } from '../modals/modalpage/modalpage.page';
import { Plugins } from '@capacitor/core';
import { GlobalConstants } from '../common/global'
import { async } from 'rxjs/internal/scheduler/async';

const { Storage } = Plugins

@Component({
  selector: 'app-ftl-upload',        
  templateUrl: './ftl-upload.page.html',
  styleUrls: ['./ftl-upload.page.scss'],
})
export class FtlUploadPage implements OnInit {

  truckID: string = "";
  startedTruckId: string = "";
  startedTruckTime: string = "";
  scannedData: any = "";
  order_id: any = "";

  constructor(private barcodeCtrl: BarcodeScanner, private camera: Camera, private renderer: Renderer2, private modalCtrl: ModalController, private alertCtrl: AlertController) { }

  ngOnInit() {
    var url = window.location.href;
    var splitUrl = url.split("/");
    var success = splitUrl[4];

    if(success == "1") {
      showAlert(this.alertCtrl);

      async function showAlert(alert) {
        var msg = await alert.create({
          message: "Truck completed",
          buttons: [
            {
              text: "OK",
              handler: async () => {
                await msg.dismiss();
              }
            }
          ]
        });

        await msg.present();
      }
    }

    this.checkForStartedTruck();
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

    window.location.href = `/single-truck/${this.order_id}`;
    this.order_id = "";
  }

  async saveTruckloadID(truckID) {
    await Storage.set({
      key: "catalog_truckloadsID",
      value: this.order_id
    });
  }

  async saveTruckloadStart() {
    var today = new Date();

    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ' ' + time;

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

  async checkForStartedTruck() {
    await this.getTruckId();
    await this.getTruckTime();

    var isValUndefined = this.startedTruckId === "undefined";

    if (this.startedTruckId && isValUndefined == false) {
      var truckInfo = document.getElementById("truckInfo-main");

      var truckTimestampSplit = this.startedTruckTime.split(" ");
      var truckDate = truckTimestampSplit[0].split("-");
      var truckYear = truckDate[0];
      var truckMonth = truckDate[1];
      var truckDay = truckDate[2];
      var truckTime = truckTimestampSplit[1];

      var formattedTruckDate = truckMonth + "/" + truckDay + "/" + truckYear

      var splitTime = truckTime.split(":");
      var hrs: any = parseInt(splitTime[0]);
      var mins: any = parseInt(splitTime[1]);
      var hours: any = 0;
      var amPm: string = "";

      var combined = hrs + "" + mins;

      if(mins < 10) {
        mins = "0" + mins;
      }

      if (hrs < 12) {
        hours = hrs;
        amPm = "am";
      }
      else {
        var hours24 = parseInt(combined.substring(0, 2), 10);
        hours = ((hours24 + 11) % 12) + 1;
        amPm = "pm";
      }

      var truckContent = this.renderer.createElement("div");
      truckContent.classList.add("truckContent");

      var truckID = this.renderer.createElement("p");
      truckID.classList.add("bold");
      truckID.classList.add("white-text");
      truckID.classList.add("m-0");
      truckID.classList.add("md-text");
      truckID.innerHTML = this.startedTruckId;

      var truckTimestamp = this.renderer.createElement("p");
      truckTimestamp.classList.add("white-text");
      truckTimestamp.classList.add("m-0");
      truckTimestamp.classList.add("inline");
      truckTimestamp.classList.add("font-jost");
      truckTimestamp.innerHTML = "Truck started at " + hours + ":" + mins + amPm + " " + formattedTruckDate;

      this.renderer.appendChild(truckContent, truckID);
      this.renderer.appendChild(truckContent, truckTimestamp);

      var truck = document.getElementById("main-truck-area");
      truckInfo.appendChild(truckContent);
      truck.classList.remove("hide");

      truckInfo.addEventListener("click", (evt) => {
        window.location.href = `/single-truck/${this.startedTruckId}`;
      })
    }
    else {
      var createNewTruckSection = document.getElementById("truckSection");
      createNewTruckSection.classList.remove("hide");
      this.order_id = "";    
    }
  }

  goToBarcodeScan() {
    const options: BarcodeScannerOptions = {
      preferFrontCamera: false,
      showFlipCameraButton: true,
      showTorchButton: true,
      torchOn: false,
      prompt: 'Place a barcode inside the scan area',
      resultDisplayDuration: 500,
      formats: 'PDF_417,CODABAR,EAN_8,UPC_A,UPC_E,EAN_8,EAN_13,CODE_39,CODE_93,CODE_128,',
      orientation: 'portrait'
    };

    this.barcodeCtrl.scan(options).then(barcodeData => {
      this.scannedData = barcodeData.text;
      var barcodeElement = (<HTMLInputElement>document.getElementById("itemBarcode"));
      barcodeElement.value = this.scannedData;

      this.order_id = this.scannedData;
    }).catch(err => {
      alert(err);
    });
  }

  async getTruckId() {
    const { value } = await Storage.get({ key: "catalog_truckloadsID" });
    this.startedTruckId = value;
  }

  async getTruckTime() {
    const { value } = await Storage.get({ key: "catalog_truckstart" });
    this.startedTruckTime = value;
  }
}