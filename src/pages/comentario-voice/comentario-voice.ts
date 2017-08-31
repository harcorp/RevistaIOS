import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, LoadingController } from 'ionic-angular';
import { AngularFireDatabase ,FirebaseListObservable } from "angularfire2/database";
import { FirebaseApp } from 'angularfire2';
import 'firebase/storage';
import { UUID } from 'angular2-uuid';
import { MediaCapture, MediaFile, CaptureAudioOptions, CaptureError } from '@ionic-native/media-capture';

@IonicPage()
@Component({
  selector: 'page-comentario-voice',
  templateUrl: 'comentario-voice.html',
})
export class ComentarioVoicePage {

  articuloId: string;
  uidUser: string;
  pubId: string;
  comments: FirebaseListObservable<any>;
  commentsUser: FirebaseListObservable<any>;
  loader: any;
  nativepath: any;

  constructor(private toastCtrl: ToastController, private fb: FirebaseApp, private afDB: AngularFireDatabase,
    private loadingCtrl: LoadingController, private mediaCapture: MediaCapture,
    public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.uidUser = this.navParams.get('uidUser');
    this.articuloId = this.navParams.get('articuloId');
    this.pubId = this.navParams.get('pubId');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  presentToast(mensaje: string) {
    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: 3000
    });
    toast.present();
  }

  startRecording(){
    let options: CaptureAudioOptions = {
      limit: 1,
      duration: 120
    }

    this.mediaCapture.captureAudio(options).then((mediaFiles: MediaFile[]) => {
      this.nativepath = mediaFiles[0].fullPath;
      this.upload();
    }, (err: CaptureError) => {
      if(err.code == "3")
      this.presentToast("No se grabo ningun audio.");
    });
  }

  upload() {
    let loader = this.loadingCtrl.create({
      content: "Cargando...",
      dismissOnPageChange: true
    });
    loader.present();
    this.nativepath = "file://" + this.nativepath;
    (<any>window).resolveLocalFileSystemURL(this.nativepath, (res) => {
      res.file((resFile) => {
        var reader = new FileReader();
        reader.readAsArrayBuffer(resFile);
        reader.onloadend = (evt: any) => {
          var time = Date.now() / 1000 * -1;
          this.comments = this.afDB.list('/comentarios/' + this.articuloId);
          this.commentsUser = this.afDB.list('/user-comentarios/' + this.uidUser + '/' + this.articuloId);
          var recordedBlob = new Blob([evt.target.result], { type: 'audio/wav' });
          var filename = '/videos/' + this.articuloId + '/' + UUID.UUID();
          var uploadTask = this.fb.storage().ref(filename).put(recordedBlob)
          uploadTask.on('state_changed', function(snapshot){
            var progress = (uploadTask.snapshot.bytesTransferred / uploadTask.snapshot.totalBytes) * 100;
            loader.setContent('Cargando ' + Math.floor(progress) + '% / 100%');
          });
          uploadTask.then(resultado => {
          this.comments.push({
            aproved: false,
            file: filename,
            type: 2,
            uid_user: this.uidUser,
            timestamp: time,
            parent: this.pubId,
          }).then(result => {
            this.commentsUser.update(result.key, {
              aproved: false,
              file: filename,
              type: 2,
              uid_user: this.uidUser,
              timestamp: time,
              parent: this.pubId,
            }).then(resultado => {
              loader.dismiss();
              this.dismiss();
              this.presentToast('Su comentario de audio fue enviado con exito. A la espera de aprobación');
            });
            });
          });
        }
      })
    });
  }

  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Cargando..."
    });
    this.loader.present();
  }

}
