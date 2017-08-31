import { Component} from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, LoadingController } from 'ionic-angular';
import { VideoCapturePlus, VideoCapturePlusOptions, MediaFile } from '@ionic-native/video-capture-plus';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { FirebaseApp } from 'angularfire2';
import 'firebase/storage';
import { UUID } from 'angular2-uuid';

@IonicPage()
@Component({
  selector: 'page-comentario-video',
  templateUrl: 'comentario-video.html',
})
export class ComentarioVideoPage {

  nativepath: any;

  articuloId: string;
  uidUser: string;
  pubId: string;

  comments: FirebaseListObservable<any>;
  commentsUser: FirebaseListObservable<any>;

  constructor(private fb: FirebaseApp,
    private afDB: AngularFireDatabase, private toastCtrl: ToastController,
    private loadingCtrl: LoadingController, private videoCapturePlus: VideoCapturePlus,
    public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {

      this.uidUser = this.navParams.get('uidUser');
      this.articuloId = this.navParams.get('articuloId');
      this.pubId = this.navParams.get('pubId');

  }

  grabar(){
    let options: VideoCapturePlusOptions = {
      limit: 1,
      highquality: false,
      frontcamera: true,
    }
    
      this.videoCapturePlus.captureVideo(options)
      .then(mediaFile => {
         var prueba: MediaFile[] = mediaFile;
          this.nativepath = prueba[0].fullPath;
          this.upload();
      })

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
          var recordedBlob = new Blob([evt.target.result], { type: 'video/mov' });
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
            type: 3,
            uid_user: this.uidUser,
            timestamp: time,
            parent: this.pubId,
          }).then(result => {
            this.commentsUser.update(result.key, {
              aproved: false,
              file: filename,
              type: 3,
              uid_user: this.uidUser,
              timestamp: time,
              parent: this.pubId,
            }).then(resultado => {
              loader.dismiss();
              this.presentToast('Su comentario en video fue enviado con exito. A la espera de aprobación');
            });
            });
          });
        }
      })
    });
  }

  presentToast(mensaje: string) {
    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: 3000
    });
    toast.present();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
