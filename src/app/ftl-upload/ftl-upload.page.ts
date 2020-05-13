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
  startedTruckId: string = "";
  startedTruckTime: string = "";

  constructor(private barcodeCtrl: BarcodeScanner, private camera: Camera, private renderer: Renderer2, private modalCtrl: ModalController) { }

  ngOnInit() {
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

  async checkForStartedTruck() {
    await this.getTruckId();
    await this.getTruckTime();

    var truckInfo = document.getElementById("truckInfo-main");

    var truckTimestampSplit = this.startedTruckTime.split(" ");
    var truckDate = truckTimestampSplit[0].split("-");
    var truckYear = truckDate[0];
    var truckMonth = truckDate[1];
    var truckDay = truckDate[2];
    var truckTime = truckTimestampSplit[1];

    var formattedTruckDate = truckMonth + "/" + truckDay + "/" + truckYear

    if(this.startedTruckId !== "" || this.startedTruckId !== null || this.startedTruckId !== undefined) {
      console.log("truck already started");  
      console.log(this.startedTruckId); 

      var splitTime = truckTime.split(":");
      var hrs = splitTime[0];
      var mins = splitTime[1];

      var combined = hrs + "" + mins;

      var hours24 = parseInt(combined.substring(0, 2),10);
      var hours = ((hours24 + 11) % 12) + 1;
      var amPm = hours24 > 11 ? 'pm' : 'am';
      
      var truckContent = this.renderer.createElement("div");
      truckContent.classList.add("truckContent");
    
      var truckID = this.renderer.createElement("p");
      truckID.classList.add("bold");
      truckID.classList.add("white-text");
      truckID.classList.add("m-0");
      truckID.classList.add("md-text");
      truckID.innerHTML = this.startedTruckId;

      var deleteBtn = this.renderer.createElement("button");
      deleteBtn.classList.add("deleteBtn");
      var icon = this.renderer.createElement("ion-icon");
      this.renderer.setProperty(icon, "name", "close-circle-outline");
      icon.classList.add("red-text");
      icon.classList.add("lg-text");
      this.renderer.appendChild(deleteBtn, icon);

      var truckTimestamp = this.renderer.createElement("p");
      truckTimestamp.classList.add("white-text");
      truckTimestamp.classList.add("m-0");
      truckTimestamp.classList.add("inline");
      truckTimestamp.innerHTML = "Truck started at " + hours + ":" + mins + amPm + " " + formattedTruckDate
    
      this.renderer.appendChild(truckContent, deleteBtn);
      this.renderer.appendChild(truckContent, truckID);
      this.renderer.appendChild(truckContent, truckTimestamp);

      var truck = document.getElementById("main-truck-area");
      // truck.innerHTML = "";

      console.log(this.startedTruckId);

      truckInfo.appendChild(truckContent);
      // truck.appendChild();

      truck.classList.remove("hide");

      truckInfo.addEventListener("click", (evt) => {
        window.location.href = `/truckload/${this.startedTruckId}`;
      })
    }
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