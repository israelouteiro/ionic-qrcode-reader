import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { InAppBrowser } from '@ionic-native/in-app-browser';

declare let cordova:any

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  scanSub

  constructor(public navCtrl: NavController, public qrScanner: QRScanner, public iap: InAppBrowser ) {

  }

  ngAfterViewInit(){
    setTimeout(()=>{
      this.readQRCode();
    }, 300)
  }


  readQRCode(){
    // Optionally request the permission early

    document.getElementById('a-center').style.display = 'none';
    document.getElementById('bt-close').style.display = 'block';

    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
         if (status.authorized) {
           // camera permission was granted

           // start scanning
           this.scanSub = this.qrScanner.scan().subscribe((text: string) => {


                 if( text.indexOf('http://') !== -1 || text.indexOf('https://') !== -1 ) {
                    cordova.InAppBrowser.open( text , "_system", "location=yes");
                 }

               document.getElementById('paragrafro-resultado').innerHTML = text

             this.closeQRCode();
           });

           // show camera preview
           this.qrScanner.show();

           // wait for user to scan something, then the observable callback will be called

         } else if (status.denied) {
           console.log('no have permission')
         } else {
           console.log('permission fail')
           // permission was denied, but not permanently. You can ask for permission again at a later time.
         }
      }) .catch((e: any) => console.log('Error is', e));
  }


  closeQRCode(){
    document.getElementById('a-center').style.display = 'flex';
    document.getElementById('bt-close').style.display = 'none';
    this.qrScanner.hide();
    this.scanSub.unsubscribe();
  }


}
