import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { LoginPage } from "../login/login";
import { SignupPage } from "../signup/signup";
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

  constructor(private afAuth : AngularFireAuth, private afDb: AngularFireDatabase,
    private modalCtrl: ModalController,
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
}
