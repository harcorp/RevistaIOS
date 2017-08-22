import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { LoginPage } from "../login/login";
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database'
import { SignupPage } from "../signup/signup";

@IonicPage()
@Component({
  selector: 'page-libreria-digital',
  templateUrl: 'libreria-digital.html',
})
export class LibreriaDigitalPage {

  articulos: FirebaseListObservable<any>;
  displayName: string;
  uidUser: string;
  logged: boolean;

  constructor(private modalCtrl: ModalController, private afAuth: AngularFireAuth,
    private afDb: AngularFireDatabase,
    public navCtrl: NavController, public navParams: NavParams) {

    this.articulos = this.afDb.list('/biblioteca_libreria', {
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

  signOut() {
    this.afAuth.auth.signOut();
  }

  goToLogin() {
    let modal = this.modalCtrl.create(LoginPage);
    modal.present();
  }

  goToSignUp() {
    let modal = this.modalCtrl.create(SignupPage);
    modal.present();
  }
}
