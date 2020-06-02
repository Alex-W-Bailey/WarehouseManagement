import { Component, OnInit, Renderer2 } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { NavParams, ModalController, AlertController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { GlobalConstants } from '../common/global';
import { ModalpagePage } from '../modals/modalpage/modalpage.page';
import { async } from '@angular/core/testing';
import { ApiService } from '../api.service';

const { Storage } = Plugins

@Component({
  selector: 'app-single-truck',
  templateUrl: './single-truck.page.html',
  styleUrls: ['./single-truck.page.scss'],
})
export class SingleTruckPage implements OnInit {

  constructor(private camera: Camera, private renderer: Renderer2, private modalCtrl: ModalController, private alertCtrl: AlertController, private apiService: ApiService) { }

  ngOnInit() {
    var url = window.location.href;
    var splitUrl = url.split("/");
    var truckId = splitUrl[4];

    var truckIdText = document.getElementById("truckId");
    truckIdText.innerHTML = truckId;

    this.getImgs();
  }

  public takePicture() {
    const options: CameraOptions = {
      quality: 75,
      targetHeight: 480,
      targetWidth: 640,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
    }

    this.camera.getPicture(options).then(async (imgData) => {
      var base64Image = "data:image/jpeg;base64," + imgData;

      const { value } = await Storage.get({ key: "catalog_singleTruckImgs" });
      const truckImgs = JSON.parse(value);

      var allImgs = [];


      if (truckImgs) {
        for (var i = 0; i < truckImgs.length; i++) {
          allImgs.push(truckImgs[i]);
        }
      }

      allImgs.push(base64Image);

      await Storage.set({
        key: "catalog_singleTruckImgs",
        value: JSON.stringify(allImgs)
      });

      console.log(allImgs);

      this.getImgs();
    }, (err) => {
      alert(err);
    });
  }

  private async getImgs() {
    const { value } = await Storage.get({ key: "catalog_singleTruckImgs" });
    const truckImgs = JSON.parse(value);

    console.log(truckImgs);

    GlobalConstants.singleTruckImgs = truckImgs

    console.log(GlobalConstants.singleTruckImgs);

    var imgSection = document.getElementById("imgs-section");
    imgSection.innerHTML = "";

    var numOfImgs = document.getElementById("numOfItems");

    if (truckImgs) {
      if (truckImgs.length > 0) {
        numOfImgs.innerHTML = truckImgs.length;

        for (var i = 0; i < truckImgs.length; i++) {
          var newImg = this.renderer.createElement("img");
          this.renderer.addClass(newImg, "item-img");
          this.renderer.setProperty(newImg, "id", i);
          this.renderer.setProperty(newImg, "name", "item-img");
          this.renderer.setProperty(newImg, "src", truckImgs[i]);
          this.renderer.addClass(newImg, "float-left");

          imgSection.appendChild(newImg);
        }

        var itemImg = document.getElementsByName("item-img");
        for (var x = 0; x < itemImg.length; x++) {
          itemImg[x].addEventListener("click", (evt) => this.showModal(evt));
        }
      }
      else {
        numOfImgs.innerHTML = "0";

        var text = this.renderer.createElement("p");
        this.renderer.addClass(text, "white-text");
        this.renderer.addClass(text, "bold");
        this.renderer.addClass(text, "m-0");
        text.innerHTML = "No images...";

        imgSection.appendChild(text);
      }
    }
  }

  async completeTruck() {
    var alert = await this.alertCtrl.create({
      message: "Are you sure this truck is complete?",
      buttons: [
        {
          text: "CANCEL",
          handler: async () => {
            await alert.dismiss();
          }
        },
        {
          text: "YES",
          handler: async () => {
            await this.resetTruckloadId();
            await this.resetTruckItems();

            // window.location.href = "/ftl-upload";
            await this.apiService.addTrailer(603).subscribe( async (result) => {
              var obj = Object.values(result);
              var houseId = obj[0].id;
              var allTruckImgs = GlobalConstants.singleTruckImgs;

              for(var i = 0; i < allTruckImgs.length; i++) {
                var imgSplit = allTruckImgs[i].split(",");

                this.apiService.addPicture(houseId, imgSplit[1]).then((data) => {
                  console.log(data);
                });
              }
            })
          }
        }
      ]
    });

    await alert.present();
  }

  async resetTruckloadId() {
    await Storage.set({
      key: "catalog_truckloadsID",
      value: undefined
    });
  }

  async resetTruckItems() {
    var empty = [];

    await Storage.set({
      key: "catalog_singleTruckImgs",
      value: JSON.stringify(empty)
    });
  }

  async showModal(imgClicked) {
    var id = imgClicked.target.id;
    var img = imgClicked.target.src;

    const modal = this.modalCtrl.create({
      component: ModalpagePage,
      componentProps: {
        img_id: id,
        img_src: img,
        deleteFrom: "itemImg"
      }
    });

    return (await modal).present();
  }
}

export async function deleteImgFromTruck(id, renderer, modalCtrl, Storage) {
  const { value } = await Storage.get({ key: "catalog_singleTruckImgs" });

  if (value !== undefined) {
    var imgs = JSON.parse(value);
    imgs.splice(id, 1);

    if (imgs.length === 0) {
      console.log("none");

      var imgContainer = document.getElementById("imgs-section");
      imgContainer.innerHTML = "No Images Captured...";
    }
    else {
      console.log("found");

      var imgContainer = document.getElementById("imgs-section");
      imgContainer.innerHTML = "";

      var numOfImages: number[] = [];
      var num: number = 0;

      for (var i = 0; i < imgs.length; i++) {
        numOfImages.push(num);
        num++;

        const newImg = renderer.createElement('img');
        renderer.addClass(newImg, "item-img");
        renderer.addClass(newImg, "inline");
        renderer.setProperty(newImg, "id", numOfImages[i]);
        renderer.setProperty(newImg, 'src', imgs[i]);

        newImg.addEventListener("click", () => showModal(newImg));
        imgContainer.appendChild(newImg);
      }
    }
  }

  await Storage.set({
    key: "catalog_singleTruckImgs",
    value: JSON.stringify(imgs)
  })

  async function showModal(imgClicked) {
    var id = imgClicked.id;
    var img = imgClicked.src;

    const modal = modalCtrl.create({
      component: ModalpagePage,
      componentProps: {
        img_id: id,
        img_src: img
      }
    });

    return (await modal).present();
  }
}
