import { Component, OnInit, Renderer2 } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { NavParams, ModalController, AlertController, LoadingController } from '@ionic/angular';
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

  constructor(private camera: Camera, private renderer: Renderer2, private modalCtrl: ModalController, private loadingCtrl: LoadingController, private alertCtrl: AlertController, private apiService: ApiService) { }

  orderId: any;

  ngOnInit() {
    var url = window.location.href;
    var splitUrl = url.split("/");
    this.orderId = splitUrl[4];

    var truckIdText = document.getElementById("truckId");
    truckIdText.innerHTML = this.orderId;

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

      this.getImgs();
    }, (err) => {
      alert(err);
    });
  }

  private async getImgs() {
    const { value } = await Storage.get({ key: "catalog_singleTruckImgs" });
    const truckImgs = JSON.parse(value);

    if(truckImgs) {
      GlobalConstants.singleTruckImgs = truckImgs;
    }
    else {
      GlobalConstants.singleTruckImgs = [];
    }

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
            const loading = await this.loadingCtrl.create();
            await loading.present();

            await this.resetTruckloadId();
            await this.resetTruckItems();

            const { value } = await Storage.get({ key: "catalog_login" });
            const user_info = JSON.parse(value);
            const companyId = parseInt(user_info.company_id);

            await this.apiService.addTrailer(companyId, this.orderId).subscribe(async (result) => {
              var obj = Object.values(result);
              var houseId = obj[0].id;

              var allTruckImgs = GlobalConstants.singleTruckImgs;

              if(allTruckImgs) {
                if (allTruckImgs.length > 0) {
                  for (var i = 0; i < allTruckImgs.length; i++) {
                    await this.apiService.addPicture(houseId, allTruckImgs[i]).then((data) => {
                      if (data) {
                        console.log("img uploaded");
                      }
                      else {
                        showErr(this.alertCtrl);
  
                        async function showErr(alertCtrl) {
                          const error = alertCtrl.create({
                            message: "Something went wrong. Please try again...",
                            buttons: [
                              {
                                text: "OK",
                                handler: async () => {
                                  await error.dismiss();
                                }
                              }
                            ]
                          });
  
                          await error.present();
                        }
                      }
                    });
  
                    if(i == (allTruckImgs.length - 1)) {
                      loading.dismiss();
                      window.location.href = "/ftl-upload/1";
                    }
                  }
                }
                else {
                  window.location.href = "ftl-upload/1";
                }
              }
            });
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

    GlobalConstants.singleTruckImgs.splice(id, 1);

    if (imgs.length === 0) {
      var imgContainer = document.getElementById("imgs-section");
      imgContainer.innerHTML = "No Images Captured...";
    }
    else {
      var imgContainer = document.getElementById("imgs-section");
      imgContainer.innerHTML = "";
  
      var numOfImgs = document.getElementById("numOfItems");

      var numOfImages: number[] = [];
      var num: number = 0;

      for (var i = 0; i < imgs.length; i++) {
        numOfImages.push(num);
        num++;

        if (imgs.length > 0) {
          numOfImgs.innerHTML = imgs.length;
  
          for (var i = 0; i < imgs.length; i++) {
            var newImg = renderer.createElement("img");
            renderer.addClass(newImg, "new-item-img");
            renderer.setProperty(newImg, "id", i);
            renderer.setProperty(newImg, "name", "item-img");
            renderer.setProperty(newImg, "src", imgs[i]);
            renderer.addClass(newImg, "float-left");
  
            imgContainer.appendChild(newImg);
          }
  
          var itemImg = document.getElementsByName("item-img");
          for (var x = 0; x < itemImg.length; x++) {
            itemImg[x].addEventListener("click", (evt) => this.showModal(evt));
          }
        }
      }
    }
  }

  await Storage.set({
    key: "catalog_singleTruckImgs",
    value: JSON.stringify(imgs)
  });

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
