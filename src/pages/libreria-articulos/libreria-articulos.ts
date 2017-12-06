import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { LoginPage } from "../login/login";
import { SignupPage } from "../signup/signup";
import { InAppBrowser , InAppBrowserOptions } from '@ionic-native/in-app-browser';

@IonicPage()
@Component({
  selector: 'page-libreria-articulos',
  templateUrl: 'libreria-articulos.html',
})
export class LibreriaArticulosPage {

  articulos: FirebaseListObservable<any>;
  displayName: string;
  logged: boolean;
  uidUser: string;

  options : InAppBrowserOptions = {
    location : 'yes',//Or 'no' 
    hidden : 'no', //Or  'yes'
    clearcache : 'yes',
    clearsessioncache : 'yes',
    zoom : 'yes',//Android only ,shows browser zoom controls 
    hardwareback : 'yes',
    mediaPlaybackRequiresUserAction : 'no',
    shouldPauseOnSuspend : 'no', //Android only 
    closebuttoncaption : 'Close', //iOS only
    disallowoverscroll : 'no', //iOS only 
    toolbar : 'yes', //iOS only 
    enableViewportScale : 'no', //iOS only 
    allowInlineMediaPlayback : 'no',//iOS only 
    presentationstyle : 'pagesheet',//iOS only 
    fullscreen : 'yes',//Windows only    
};

  constructor(private afAuth : AngularFireAuth, private afDb: AngularFireDatabase,
    private modalCtrl: ModalController, private inAppBrow: InAppBrowser,
    public navCtrl: NavController, public navParams: NavParams) {

    this.articulos = this.afDb.list('/biblioteca_articulos', {
      query: {
        orderByChild: 'fecha'
      }
    });

    afAuth.authState.subscribe(user => {
      if (!user) {
        this.displayName = null;
        this.logged = false;        
        return;
      }
      this.uidUser = user.uid;
      this.displayName = user.displayName;
      this.logged = true;      
    });
  }

  goToLogin() {
    let modal = this.modalCtrl.create(LoginPage);
    modal.present();
  }

  goToSignUp() {
    let modal = this.modalCtrl.create(SignupPage);
    modal.present();
  }

  signOut() {
    this.afAuth.auth.signOut();
  }

  openLink(url: string){
    let target = "_blank";
    this.inAppBrow.create(url,target,this.options);
  }
}
