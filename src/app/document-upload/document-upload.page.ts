import { Component, OnInit, Renderer2 } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { GlobalConstants } from '../common/global';
import { Plugins } from '@capacitor/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { ApiService } from '../api.service';

const { Storage } = Plugins;

@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.page.html',
  styleUrls: ['./document-upload.page.scss'],
})
export class DocumentUploadPage implements OnInit {

  constructor(private camera: Camera, private renderer: Renderer2, private api: ApiService, private loading: LoadingController, private alert: AlertController) { }

  documentName: string = "";
  companyId: any = "";
  userId: any = "";

  ngOnInit() {
    this.getLoginData();
  }

  async getLoginData() {
    const { value } = await Storage.get({ key: "catalog_login" });
    const userData = JSON.parse(value);

    this.companyId = userData.company_id;
    this.userId = userData.id;
  }

  takePhoto() {
    console.log("takePhoto");

    GlobalConstants.allDocImgs = [];

    const options: CameraOptions = {
      quality: 95,
      targetHeight: 4032,
      targetWidth: 3024,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
    }

    this.camera.getPicture(options).then((imgData) => {
      var base64Image = "data:image/jpeg;base64," + imgData;
      GlobalConstants.allDocImgs.push(base64Image)

      this.showImgs();
    }, (err) => {
      alert(err);
    });
  }

  public showImgs() {
    console.log(GlobalConstants.allDocImgs);

    if (GlobalConstants.allDocImgs.length === 0) {
      var imgContainer = document.getElementById("all-document-imgs");
      imgContainer.innerHTML = "No Images Captured...";
    }
    else {
      var imgContainer = document.getElementById("all-document-imgs");
      imgContainer.innerHTML = "";

      var numOfImages: number[] = [];
      var num: number = 0;

      for (var i = 0; i < GlobalConstants.allDocImgs.length; i++) {
        numOfImages.push(num);
        num++;

        const newImg = this.renderer.createElement('img');
        this.renderer.addClass(newImg, "item-img");
        this.renderer.addClass(newImg, "inline");
        this.renderer.setProperty(newImg, "id", numOfImages[i]);
        this.renderer.setProperty(newImg, 'src', GlobalConstants.allDocImgs[i]);

        imgContainer.appendChild(newImg);
      }
    }
  }

  async upload() {
    console.log("upload");

    var dataVals = {
      name: "document",
      company_id: this.companyId,
      user_id: this.userId,
      pro_number: this.documentName,
      base64: GlobalConstants.allDocImgs,
      weight: "0",
      width: "0",
      len: "0",
      height: "0",
      address: "",
      city: "",
      state: "",
      zipcode: "",
      scanned_terminal_id: 0,
      scanner_id: 0
    }

    const loading = await this.loading.create();
    await loading.present();

    this.api.addShipment(dataVals)
      .then( async response => {
        var data = JSON.parse(response.data)

        loading.dismiss();

        if(data.message == "Shipment added successfully") {
          const msg = this.alert.create({
            message: "Uploaded!",
            buttons: [
              {
                text: "OK",
                handler: async () => {
                   (await msg).dismiss();
                }
              }
            ]
          });
  
         (await msg).present();
        }
        else {
          const msg = this.alert.create({
            message: "Error! Try Again",
            buttons: [
              {
                text: "OK",
                handler: async () => {
                   (await msg).dismiss();
                }
              }
            ]
          });
  
         (await msg).present();
        }

        
        console.log(dataVals)
        console.log(response)
      });
  }
}
