import { Component, OnInit, Renderer2 } from '@angular/core';
import { GlobalConstants } from '../common/global';
import { BarcodeScanner, BarcodeScannerOptions } from "@ionic-native/barcode-scanner/ngx";
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { interval } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';

import { ModalpagePage } from '../modals/modalpage/modalpage.page';
import { TruckItemPage } from '../modals/truck-item/truck-item.page';

const { Storage } = Plugins;

@Component({
  selector: 'app-truckload',
  templateUrl: './truckload.page.html',
  styleUrls: ['./truckload.page.scss'],
})
export class TruckloadPage implements OnInit {

  constructor(private barcodeCtrl: BarcodeScanner, private camera: Camera, private renderer: Renderer2, private modalCtrl: ModalController) { }

  truckItems: any;
  pro_number: string = "";
  itemBarcode: string = "";
  timer: any;

  async ngOnInit() {
    var url = window.location.href;
    var splitUrl = url.split("/");
    var truckId = splitUrl[4];

    var truckIdText = document.getElementById("truckId");
    truckIdText.innerHTML = truckId;

    await this.getTruckItems();
  }

  goBack() {
    this.timerEnd();
  }

  scanBarcode() {
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
      this.pro_number = barcodeData.text;
      var barcodeElement = (<HTMLInputElement>document.getElementById("itemBarcode"));
      barcodeElement.value = this.pro_number;

      this.itemBarcode = this.pro_number;
    }).catch(err => {
      alert(err);
    });
  }

  async getTruckItems() {
    const { value } = await Storage.get({ key: "catalog_truckItems" });
    
    if(value && value !== "undefined") {
      this.truckItems = JSON.parse(value)

      var numOfItemsText = document.getElementById("numOfItems");
      numOfItemsText.innerHTML = this.truckItems.length;
  
      var allTruckItems = document.getElementById("allTruckItems");
      allTruckItems.innerHTML = "";
  
      for(var i = 0; i < this.truckItems.length; i++) {
        var splitTime = this.truckItems[i].time.split(":");
        var hrs = splitTime[0];
        var mins: any = parseInt(splitTime[1]);
        var hours: any = 0;
        var amPm: string = "";

        var combined = hrs + "" + mins;

        if(mins < 10) {
          mins = "0" + mins
        }

        if (hrs < 12) {
          hours = hrs;
          amPm = "am";
        }
        else {
          var hours24 = parseInt(combined.substring(0, 2), 10);
          hours = ((hours24 + 11) % 12) + 1;
          amPm = "pm"
        }
  
        var truckItem = this.renderer.createElement("div");
        truckItem.classList.add("truckItem");
        this.renderer.setProperty(truckItem, "id", i);
        this.renderer.setAttribute(truckItem, "name", "truck-item");
        var container = this.renderer.createElement("div");
        container.classList.add("container");
        var itemName = this.renderer.createElement("p");
        this.renderer.setProperty(itemName, "id", i);
        this.renderer.setAttribute(itemName, "name", "truck-item");
        itemName.classList.add("m-0");
        itemName.classList.add("itemName");
        itemName.classList.add("bold");

        if(this.truckItems[i].id == "") {
          itemName.innerHTML = "Item " + (i + 1);
        }
        else {
          itemName.innerHTML = this.truckItems[i].id;
        }

        var itemTime = this.renderer.createElement("p");
        this.renderer.setProperty(itemTime, "id", i);
        this.renderer.setAttribute(itemTime, "name", "truck-item");
        itemTime.classList.add("m-0");
        itemTime.classList.add("itemTime");
        itemTime.innerHTML = "loaded at " + hours + ":" + mins + amPm;
  
        container.appendChild(itemName);
        container.appendChild(itemTime);
        truckItem.appendChild(container);
        allTruckItems.appendChild(truckItem);
      }
  
      var truckItemElements = document.getElementsByName("truck-item");
      for(var i = 0; i < truckItemElements.length; i++) {
        truckItemElements[i].addEventListener("click", (evt) => {
          this.truckItemClick(evt);
        });
      }
    }
  }

  async truckItemClick(evt) {
    if(GlobalConstants.clickedItem == false) {
      var id = evt.target.id;
  
      GlobalConstants.clickedItem = true;

      const modal = this.modalCtrl.create({
        component: TruckItemPage,
        componentProps: {
          id: id,
        }
      });

      return (await modal).present();
    }
  }

  async addNewItem() {
    var truckDoneBtn = document.getElementById("truckDoneBtn");
    truckDoneBtn.classList.add("hide");

    var truckSection = document.getElementById("truckInfo");
    truckSection.classList.add("hide");

    var newItemSection = document.getElementById("newItem");
    newItemSection.classList.remove("hide");
  }

  async pushItemToTruck() {
    var today = new Date();
    var hour = today.getHours();
    var minute = today.getMinutes();
    var time = hour + ":" + minute;

    var item = {
      id: this.pro_number,
      time: time,
      imgs: GlobalConstants.allImgs
    }

    var truckItemsArr = [];

    const { value } = await Storage.get({ key:"catalog_truckItems"});
    var isValueUndefined = ( value === "undefined" );

    if(value !== null && isValueUndefined === false) {
      var existingData = JSON.parse(value)

      for(var i = 0; i < existingData.length; i++) {
        truckItemsArr.push(existingData[i]);
      }      
    }

    truckItemsArr.push(item);      

    await Storage.set({
      key: "catalog_truckItems",
      value: JSON.stringify(truckItemsArr)
    });

    this.getTruckItems();

    this.pro_number = "";
    var imgSection = document.getElementById("imgs");
    imgSection.innerHTML = "";

    this.hideAddingItem();
  }

  hideAddingItem() {
    var truckDoneBtn = document.getElementById("truckDoneBtn");
    truckDoneBtn.classList.remove("hide");

    var truckSection = document.getElementById("truckInfo");
    truckSection.classList.remove("hide");

    var newItemSection = document.getElementById("newItem");
    newItemSection.classList.add("hide");
  }

  takePicture() {
    const options: CameraOptions = {
      quality: 75,
      targetHeight: 480,
      targetWidth: 640,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
    }

    this.camera.getPicture(options).then((imgData) => {
      var base64Image = "data:image/jpeg;base64," + imgData;
      GlobalConstants.allImgs.push(base64Image)

      this.showImgs();
    }, (err) => {
      alert(err);
    });
  }

  public showImgs() {
    if (GlobalConstants.allImgs.length === 0) {
      var imgContainer = document.getElementById("imgs");
      imgContainer.innerHTML = "No Images Captured...";
    }
    else {
      var imgContainer = document.getElementById("imgs");
      imgContainer.innerHTML = "";

      var numOfImages: number[] = [];
      var num: number = 0;

      for (var i = 0; i < GlobalConstants.allImgs.length; i++) {
        numOfImages.push(num);
        num++;

        const newImg = this.renderer.createElement('img');
        this.renderer.addClass(newImg, "item-img");
        this.renderer.addClass(newImg, "inline");
        this.renderer.setProperty(newImg, "id", numOfImages[i]);
        this.renderer.setProperty(newImg, 'src', GlobalConstants.allImgs[i]);

        newImg.addEventListener("click", () => this.showModal(newImg));
        imgContainer.appendChild(newImg);
      }
    }
  }

  public timerEnd() {
    clearTimeout(this.timer);
  }

  async completeTruck() {
    var nullVal = null;
    
    await this.resetTruckloadId();
    await this.resetTruckItems();

    window.location.href = "/ftl-upload";
  }

  async resetTruckloadId() {
    await Storage.set({
      key: "catalog_truckloadsID",
      value: undefined
    });
  }

  async resetTruckItems() {
    await Storage.set({
      key: "catalog_truckItems",
      value: undefined
    });
  }

  async showModal(imgClicked) {
    var id = imgClicked.id;
    var img = imgClicked.src;

    const modal = this.modalCtrl.create({
      component: ModalpagePage,
      componentProps: {
        img_id: id,
        img_src: img
      }
    });

    return (await modal).present();
  }
}

export function deleteImg(id, renderer) {
  GlobalConstants.allImgs.splice(id, 1);

  if (GlobalConstants.allImgs.length === 0) {
    var imgContainer = document.getElementById("imgs");
    imgContainer.innerHTML = "No Images Captured...";
  }
  else {
    var imgContainer = document.getElementById("imgs");
    imgContainer.innerHTML = "";

    var numOfImages: number[] = [];
    var num: number = 0;

    for (var i = 0; i < GlobalConstants.allImgs.length; i++) {
      numOfImages.push(num);
      num++;

      const newImg = this.renderer.createElement('img');
      renderer.addClass(newImg, "item-img");
      renderer.addClass(newImg, "inline");
      renderer.setProperty(newImg, "id", numOfImages[i]);
      renderer.setProperty(newImg, 'src', GlobalConstants.allImgs[i]);

      newImg.addEventListener("click", () => this.showModal(newImg));
      imgContainer.appendChild(newImg);
    }
  }
}

export async function deleteImgFromShipmentItem(itemId, newShipmentObj) {
  const { value } = await Storage.get({ key: "catalog_truckItems" });
  const allItems = JSON.parse(value);

  allItems[itemId] = newShipmentObj;

  await Storage.set({
    key: "catalog_truckItems",
    value: JSON.stringify(allItems)
  });
}
