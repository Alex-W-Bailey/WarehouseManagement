import { Component, OnInit, Renderer2 } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { NavParams, ModalController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { GlobalConstants } from '../../common/global';
import { ModalpagePage } from '../modalpage/modalpage.page';
import { async } from '@angular/core/testing';

const { Storage } = Plugins

@Component({
  selector: 'app-truck-item',
  templateUrl: './truck-item.page.html',
  styleUrls: ['./truck-item.page.scss'],
})
export class TruckItemPage implements OnInit {

  constructor(private navParams: NavParams, private renderer: Renderer2, private modalCtrl: ModalController, private camera: Camera) { }

  passedId = null;

  async ngOnInit() {
    this.passedId = this.navParams.get("id");

    this.getImgs();

    setInterval(() => {
      this.checkForImgDeletion();
    }, 500)
  }

  async checkForImgDeletion() {
    var wasImgDeleted = GlobalConstants.deletedImg;

    if (wasImgDeleted) {
      this.getImgs();
      GlobalConstants.deletedImg = false;
    }
  }

  async getImgs() {
    const { value } = await Storage.get({ key: "catalog_truckItems" });
    const allShipmentItems = JSON.parse(value);
    var thisItemInfo = allShipmentItems[this.passedId]
    var shipmentId = document.getElementById("shipmentId");
    shipmentId.innerHTML = thisItemInfo.id;

    var splitTime = thisItemInfo.time.split(":");
    var hrs: any = parseInt(splitTime[0]);
    var mins: any = parseInt(splitTime[1]);
    var hours: any = 0;
    var amPm: string = "";

    var combined = hrs + "" + mins;

    if (mins < 10) {
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

    var shipmentTime = document.getElementById("shipmentTime");
    shipmentTime.innerHTML = `Scanned At: ${hours}:${mins}${amPm}`;

    var imgSection = document.getElementById("img-section");
    imgSection.innerHTML = "";

    if (thisItemInfo.imgs.length > 0) {
      for (var i = 0; i < thisItemInfo.imgs.length; i++) {
        var newImg = this.renderer.createElement("img");
        this.renderer.addClass(newImg, "item-img");
        this.renderer.setProperty(newImg, "id", i);
        this.renderer.setProperty(newImg, "name", "item-img");
        this.renderer.setProperty(newImg, "src", thisItemInfo.imgs[i]);
        this.renderer.addClass(newImg, "float-left");

        imgSection.appendChild(newImg);
      }

      var itemImg = document.getElementsByName("item-img");
      for (var x = 0; x < itemImg.length; x++) {
        itemImg[x].addEventListener("click", (evt) => this.showModal(evt));
      }
    }
    else {
      var text = this.renderer.createElement("p");
      this.renderer.addClass(text, "white-text");
      this.renderer.addClass(text, "bold");
      this.renderer.addClass(text, "m-0");
      text.innerHTML = "No images...";

      imgSection.appendChild(text);
    }
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

    this.camera.getPicture(options).then( async (imgData) => {
      var base64Image = "data:image/jpeg;base64," + imgData;

      const { value } = await Storage.get({ key: "catalog_truckItems" });
      const allShipmentItems = JSON.parse(value);
      var itemImgs = allShipmentItems[this.passedId].imgs;

      itemImgs.push(base64Image);

      var data = JSON.stringify(allShipmentItems);

      await Storage.set({
        key: "catalog_truckItems",
        value: data
      })

      this.getImgs();
    }, (err) => {
      alert(err);
    });
  }

  goBack() {
    GlobalConstants.clickedItem = false;
    this.modalCtrl.dismiss();
  }

  async showModal(imgClicked) {
    var id = imgClicked.target.id;
    var img = imgClicked.target.src;

    const modal = this.modalCtrl.create({
      component: ModalpagePage,
      componentProps: {
        item_id: this.passedId,
        img_id: id,
        img_src: img,
        deleteFrom: "itemImg"
      }
    });

    return (await modal).present();
  }
}
