import { Component, OnInit, Renderer2 } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { BarcodeScanner, BarcodeScannerOptions } from "@ionic-native/barcode-scanner/ngx";
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ModalpagePage } from '../modals/modalpage/modalpage.page';
import { GlobalConstants } from '../common/global'

@Component({
  selector: 'app-ftl-upload',
  templateUrl: './ftl-upload.page.html',
  styleUrls: ['./ftl-upload.page.scss'],
})
export class FtlUploadPage implements OnInit {

  scannedData: string = "";
  itemBarcode: string = "";

  constructor(private barcodeCtrl: BarcodeScanner, private camera: Camera, private renderer: Renderer2, private modalCtrl: ModalController) { }

  ngOnInit() {
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
      this.scannedData = barcodeData.text;
      var barcodeElement = (<HTMLInputElement>document.getElementById("itemBarcode"));
      barcodeElement.value = this.scannedData;

      this.itemBarcode = this.scannedData;
    }).catch(err => {
      alert(err);
    });
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

      GlobalConstants.numOfImages = 0;
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

  async showModal(imgClicked) {
    console.log(imgClicked);

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

export function deleteImg(id) {
  GlobalConstants.allImgs.splice(id, 1);
  GlobalConstants.numOfImages--;
}