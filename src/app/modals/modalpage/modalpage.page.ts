import { Component, OnInit, Renderer2 } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { ModalController, AngularDelegate } from '@ionic/angular';
import { deleteImg, deleteImgFromShipmentItem } from '../../truckload/truckload.page';
import { Plugins } from '@capacitor/core';
import { GlobalConstants } from '../../common/global';

const { Storage } = Plugins;

@Component({
  selector: 'app-modalpage',
  templateUrl: './modalpage.page.html',
  styleUrls: ['./modalpage.page.scss'],
})
export class ModalpagePage implements OnInit {

  constructor(private navParams: NavParams, private renderer: Renderer2, private modalCtrl: ModalController) { }

  itemId = null;
  passId = null;
  passedSrc = null;
  whereToDeleteFrom = null;
  shipmentItems = null;

  ngOnInit() {
    this.itemId = this.navParams.get("item_id");
    this.passId = this.navParams.get("img_id");
    this.passedSrc = this.navParams.get("img_src");
    this.whereToDeleteFrom = this.navParams.get("deleteFrom");

    this.showImg(this.passedSrc);
  }

  showImg(base64Img) {
    var titleElement = document.getElementById("img_num");
    var newTitle = "Image Number: " + (parseInt(this.passId) + 1);
    titleElement.innerHTML = newTitle;

    var imgContainer = document.getElementById("opened_img");

    const newImg = this.renderer.createElement('img');
    this.renderer.addClass(newImg, "item-img");
    this.renderer.addClass(newImg, "inline");
    this.renderer.setProperty(newImg, 'src', base64Img);
  
    imgContainer.appendChild(newImg);
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  deleteImgClicked() {
    if(this.whereToDeleteFrom == "itemImg") {
      this.deleteImgFromItem();
    }
    else {
      deleteImg(this.passId, this.renderer, this.modalCtrl);
    }

    this.modalCtrl.dismiss();
  }

  async deleteImgFromItem() {
    const { value } = await Storage.get({ key: "catalog_truckItems" });
    this.shipmentItems = JSON.parse(value);
    var thisItem = this.shipmentItems[this.itemId];
    var imgs = thisItem.imgs;

    imgs.splice(this.passId, 1);

    GlobalConstants.deletedImg = true;

    deleteImgFromShipmentItem(this.itemId, thisItem);
  }
}
