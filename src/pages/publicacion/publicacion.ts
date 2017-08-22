import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from "rxjs/Observable";
import * as firebase from 'firebase/app';
import { LoginPage } from "../login/login";
import { SignupPage } from "../signup/signup";

@IonicPage({
  segment: 'publicacion/:pubId'
})
@Component({
  selector: 'page-publicacion',
  templateUrl: 'publicacion.html',
})
export class PublicacionPage {

  pubId: string;
  items: FirebaseListObservable<any[]>;
  logged: boolean;
  user: Observable<firebase.User>;
  uidUser: string;

  constructor(private loadingCtrl: LoadingController, public afAuth: AngularFireAuth,
    public modalCtrl: ModalController,
    public navCtrl: NavController, public navParams: NavParams, private afDB: AngularFireDatabase) {
    afAuth.authState.subscribe(user => {
      if (!user) {
        this.logged = false;        
        return;
      }
      this.uidUser = user.uid;
      this.logged = true;      
    });
  }

  goToArticulo(articuloId: string, pubId: string){
    this.presentLoading();
    this.navCtrl.push('ArticuloPage', { articuloId, pubId});
  }
  
  ionViewDidLoad() {
    this.pubId = this.navParams.get('pubId');
    this.items = this.afDB.list('/articulos/' + this.pubId);
  }

  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Cargando...",
      dismissOnPageChange: true
    });
    loader.present();
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
