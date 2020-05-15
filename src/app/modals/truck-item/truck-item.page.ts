import { Component, OnInit, Renderer2, Renderer } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { GlobalConstants } from '../../common/global';
import { ModalpagePage } from '../modalpage/modalpage.page';

const { Storage } = Plugins

@Component({
  selector: 'app-truck-item',
  templateUrl: './truck-item.page.html',
  styleUrls: ['./truck-item.page.scss'],
})
export class TruckItemPage implements OnInit {

  constructor(private navParams: NavParams, private renderer: Renderer2, private modalCtrl: ModalController) { }

  passedId = null;

  async ngOnInit() {
    this.passedId = this.navParams.get("id");

    setInterval(() => {
      this.getImgs();
    }, 500)
  }

  async getImgs() {
    const { value } = await Storage.get({ key: "catalog_truckItems"});
    const allShipmentItems = JSON.parse(value);
    var thisItemInfo = allShipmentItems[this.passedId]

    var shipmentId = document.getElementById("shipmentId");
    shipmentId.innerHTML = thisItemInfo.id;

    var splitTime = thisItemInfo.time.split(":");
    var hrs = splitTime[0];
    var mins: any = parseInt(splitTime[1]);

    if(mins < 10) {
      mins = "0" + mins
    }

    var combined = hrs + "" + mins;

    var hours24 = parseInt(combined.substring(0, 2),10);
    var hours = ((hours24 + 11) % 12) + 1;
    var amPm = hours24 > 11 ? 'pm' : 'am';

    var shipmentTime = document.getElementById("shipmentTime");
    shipmentTime.innerHTML = `Scanned At: ${hours}:${mins}${amPm}`;

    var imgSection = document.getElementById("img-section");
    imgSection.innerHTML = "";

    if(thisItemInfo.imgs.length > 0) {
      for(var i = 0; i < thisItemInfo.imgs.length; i++) {
        var newImg = this.renderer.createElement("img");
        this.renderer.addClass(newImg, "item-img");
        this.renderer.setProperty(newImg, "id", i);
        this.renderer.setProperty(newImg, "name", "item-img");
        this.renderer.setProperty(newImg, "src", thisItemInfo.imgs[i]);
        
        imgSection.appendChild(newImg);
      }

      var itemImg = document.getElementsByName("item-img");
      for(var x = 0; x < itemImg.length; x++) {
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

  goBack() {
    GlobalConstants.clickedItem = false;
    this.modalCtrl.dismiss();
  }

  async showModal(imgClicked) {
    var id = imgClicked.target.id;
    var img = imgClicked.target.src;

    console.log(id);
    console.log(imgClicked.target);

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
