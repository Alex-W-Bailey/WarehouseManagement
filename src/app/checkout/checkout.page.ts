import { Component, OnInit } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { LoadingController, AlertController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';

import { ApiService } from '../api.service';

const { Storage } = Plugins;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {

  constructor(private barcodeCtrl: BarcodeScanner, private api: ApiService, private loadingCtrl: LoadingController, private alertCtrl: AlertController) { }

  slotId: string = "";
  po_soId: string = "";

  shouldSingleCheckout: boolean = true;
  shouldBulkCheckout: boolean = false;

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

  linkClick(itemClicked) {
    if (itemClicked === "single") {
      this.po_soId = "";
      this.slotId = "";
      this.shouldSingleCheckout = true;
      this.shouldBulkCheckout = false;

      showSection("single");
    }
    else {
      this.po_soId = "";
      this.slotId = "";
      this.shouldSingleCheckout = false;
      this.shouldBulkCheckout = true;

      showSection("bulk");
    }

    function showSection(itemToChangeToBlue) {
      var singleSection = document.getElementById("single-section");
      var bulkSection = document.getElementById("bulk-section");

      var singleTitle = document.getElementById("single");
      var bulkTitle = document.getElementById("bulk");

      singleSection.classList.remove("show");
      singleSection.classList.remove("remove");
      bulkSection.classList.remove("show");
      bulkSection.classList.remove("remove");

      singleTitle.classList.remove("alt-blue-text");
      singleTitle.classList.remove("white-text");
      bulkTitle.classList.remove("alt-blue-text");
      bulkTitle.classList.remove("white-text");

      if (itemToChangeToBlue === "single") {
        singleSection.classList.add("show");
        bulkSection.classList.add("hide");

        singleTitle.classList.add("alt-blue-text");
        bulkTitle.classList.add("white-text");
      }
      else {
        bulkSection.classList.add("show");
        singleSection.classList.add("hide");

        bulkTitle.classList.add("alt-blue-text");
        singleTitle.classList.add("white-text");
      }
    }
  }

  async checkoutItem() {
    console.log("single: " + this.shouldSingleCheckout);
    console.log("bulk: " + this.shouldBulkCheckout + "\n");
    console.log("po/so: " + this.po_soId);
    console.log("slot_id: " + this.slotId);

    const loading = await this.loadingCtrl.create({});
    await loading.present();

    if (this.shouldSingleCheckout) {
      await this.api.slotCheckoutSingle(this.companyId, this.slotId, this.po_soId).subscribe(async (result) => {
        var dataVals = Object.values(result);

        if (dataVals[2].includes("Slot ID does not exists!")) {
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
            message: "Item Removed From Slot",
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
    else if (this.shouldBulkCheckout) {
      await this.api.slotCheckoutBulk(this.companyId, this.po_soId).subscribe(async (result) => {
        var dataVals = Object.values(result);
  
        if (dataVals[2].includes("does not exists")) {
          const errAlert = await this.alertCtrl.create({
            message: "PO Does Not Exist",
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
            message: "Item Removed From All Slots",
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
