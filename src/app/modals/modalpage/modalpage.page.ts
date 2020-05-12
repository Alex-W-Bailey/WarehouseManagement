import { Component, OnInit, Renderer2 } from '@angular/core';
import { NavParams } from "@ionic/angular";
import { ModalController, AngularDelegate } from '@ionic/angular';
import { deleteImg } from "../../truckload/truckload.page";


@Component({
  selector: 'app-modalpage',
  templateUrl: './modalpage.page.html',
  styleUrls: ['./modalpage.page.scss'],
})
export class ModalpagePage implements OnInit {

  constructor(private navParams: NavParams, private renderer: Renderer2, private modalCtrl: ModalController) { }

  passId = null;
  passedSrc = null;   

  ngOnInit() {
    this.passId = this.navParams.get("img_id");
    this.passedSrc = this.navParams.get("img_src");

    this.showImg(this.passedSrc);
  }

  showImg(base64Img) {
    var titleElement = document.getElementById("img_num");
    var newTitle = "Image Number: " + this.passId;
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
    deleteImg(this.passId);

    this.modalCtrl.dismiss();
  }
}
