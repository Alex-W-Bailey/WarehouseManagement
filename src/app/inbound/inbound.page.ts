import { Component, OnInit } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { LoadingController, AlertController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';

import { ApiService } from '../api.service';

const { Storage } = Plugins;

@Component({
  selector: 'app-inbound',
  templateUrl: './inbound.page.html',
  styleUrls: ['./inbound.page.scss'],
})
export class InboundPage implements OnInit {

  constructor(private barcodeCtrl: BarcodeScanner, private api: ApiService, private loadingCtrl: LoadingController, private alertCtrl: AlertController) { }

  slotId: string = "";
  po_soId: string = "";

  companyId: any;
  pro_number: any;

  async ngOnInit() {
    const { value } = await Storage.get({ key: "catalog_login" });
    const userData = JSON.parse(value);

    this.companyId = userData.company_id;

    await this.api.getCompanyInfo(this.companyId).subscribe((data) => {
      var companyNameElement = document.getElementById("companyName");
      var companyName = data[0].company_name;

      companyNameElement.innerHTML = companyName;
    });
  }

  scanBarcode(itemScanned) {
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

      if (itemScanned == "slot") {
        this.slotId = this.pro_number;
      }
      else {
        this.po_soId = this.pro_number;
      }
    }).catch(err => {
      alert(err);
    });
  }

  async addOrderToBin() {
    const loading = await this.loadingCtrl.create({});
    await loading.present();

    if (this.po_soId == "") {
      loading.dismiss();

      const errAlert = await this.alertCtrl.create({
        message: "PO/SO is required",
        buttons: [
          {
            text: 'OK',
            handler: async () => {
              await errAlert.dismiss();
            }
          }
        ]
      });

      errAlert.present();
    }
    else if (this.slotId == "") {
      loading.dismiss();

      const errAlert = await this.alertCtrl.create({
        message: "Slot ID is required",
        buttons: [
          {
            text: 'OK',
            handler: async () => {
              await errAlert.dismiss();
            }
          }
        ]
      });

      errAlert.present();
    }
    else {
      await this.api.slotCheckin(this.companyId, this.slotId, this.po_soId, "InboundTest").subscribe(async (result) => {
        console.log(result);

        var dataVals = Object.values(result)
        console.log(dataVals)

        if (dataVals[2].includes("Slot ID does not exists")) {
          const errAlert = await this.alertCtrl.create({
            message: "Slot Does Not Exist",
            buttons: [
              {
                text: 'OK',
                handler: async () => {
                  await errAlert.dismiss();
                }
              }
            ]
          });

          errAlert.present();
        }
        else {
          const successAlert = await this.alertCtrl.create({
            message: "Item Added To Slot",
            buttons: [
              {
                text: 'OK',
                handler: async () => {
                  await successAlert.dismiss();
                  window.location.href = "/home";
                }
              }
            ]
          });

          successAlert.present();
        }

        await loading.dismiss();
      });
    }
  }
}
