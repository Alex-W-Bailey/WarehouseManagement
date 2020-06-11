import { Component, OnInit } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { Plugins } from '@capacitor/core';

import { ApiService } from '../api.service';

const { Storage } = Plugins;

@Component({
  selector: 'app-inbound',
  templateUrl: './inbound.page.html',
  styleUrls: ['./inbound.page.scss'],
})
export class InboundPage implements OnInit {

  constructor(private barcodeCtrl: BarcodeScanner, private api: ApiService) { }

  slotId: string = "";
  po_soId: string = "";

  pro_number: any;

  async ngOnInit() {
    const { value } = await Storage.get({ key: "catalog_login"});
    const userData = JSON.parse(value);

    var companyNum = userData.company_id;

    await this.api.getCompanyInfo(companyNum).subscribe((data) => {
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

      if(itemScanned == "slot") {
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
    await this.api.setWarehouseSlot(603, 123, 1, "Inbound").subscribe((data) => {
      console.log(data);
    });
  }
}
