import { Component } from '@angular/core';
import { IonicPage, 
        NavController, 
        NavParams, 
        LoadingController, 
        AlertController, 
        ToastController,
        ModalController,
} from 'ionic-angular';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from "rxjs/Observable";
import { LoginPage } from "../login/login";
import { ComentarioTextoPage } from "../comentario-texto/comentario-texto";
import { ComentarioVoicePage } from "../comentario-voice/comentario-voice";
import { ComentarioVideoPage } from "../comentario-video/comentario-video";
import { SignupPage } from "../signup/signup";
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';
import { Articulo } from "../../models/articulo";


@IonicPage({
  segment: 'articulo/:pubId/:articuloId'
})
@Component({
  selector: 'page-articulo',
  templateUrl: 'articulo.html',
})
export class ArticuloPage {

  pubId: string;
  articuloId: string;
  uidUser: string;
  art: FirebaseObjectObservable<any>;
  articulo: Articulo = new Articulo;

  user: Observable<firebase.User>;
  displayName: string;
  logged: boolean;

  comentarios: FirebaseListObservable<any>;
  comentsUser: FirebaseListObservable<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
              private afDB: AngularFireDatabase, public loadingCtrl: LoadingController,
            public afAuth: AngularFireAuth, public alertCtrl: AlertController,
            private youtube: YoutubeVideoPlayer,
            public toastCtrl: ToastController, private modalCtrl: ModalController) {
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

  playVideo(){
    this.youtube.openVideo(this.articulo.video);
  }

  ionViewDidLoad() {
    this.pubId = this.navParams.get('pubId');
    this.articuloId = this.navParams.get('articuloId');
    this.art = this.afDB.object('/articulos/' + this.pubId + '/' + this.articuloId, {preserveSnapshot: true});
    this.art.subscribe(v => {
      this.articulo = v.val();
    });
    this.comentarios = this.afDB.list('/comentarios/' + this.articuloId,{
      query: {
        orderByChild: 'aproved',
        equalTo: true
      }
    });
  }


  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Cargando...",
      duration: 2000
    });
    loader.present();
  }

  presentToast(mensaje: string) {
    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: 3000
    });
    toast.present();
  }

  modalComentarioTexto(){
    let modal = this.modalCtrl.create(ComentarioTextoPage, {uidUser: this.uidUser, articuloId: this.articuloId, pubId: this.pubId});
    modal.present();
  }

  modalComentarioVoice(){
    let modal = this.modalCtrl.create(ComentarioVoicePage, {uidUser: this.uidUser, articuloId: this.articuloId, pubId: this.pubId});
    modal.present();
  }

  modalComentarioVideo(){
    let modal = this.modalCtrl.create(ComentarioVideoPage, {uidUser: this.uidUser, articuloId: this.articuloId, pubId: this.pubId});
    modal.present();
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