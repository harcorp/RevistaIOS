import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, LoadingController } from 'ionic-angular';
import * as RecordRTC from 'recordrtc/recordrtc.min';
import { AngularFireDatabase ,FirebaseListObservable } from "angularfire2/database";
import { FirebaseApp } from 'angularfire2';
import 'firebase/storage';
import { UUID } from 'angular2-uuid';

@IonicPage()
@Component({
  selector: 'page-comentario-voice',
  templateUrl: 'comentario-voice.html',
})
export class ComentarioVoicePage {

  articuloId: string;
  grabando: boolean = false;
  grabado: boolean = false;
  uidUser: string;
  pubId: string;
  comments: FirebaseListObservable<any>;
  commentsUser: FirebaseListObservable<any>;
  loader: any;

  private stream: MediaStream;
  private recordRTC: any;
  duration: number = 60 * 1000;
  reaming: number = this.duration;
  @ViewChild('audio') audio;

  constructor(private toastCtrl: ToastController, private fb: FirebaseApp, private afDB: AngularFireDatabase,
    private loadingCtrl: LoadingController,
    public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.uidUser = this.navParams.get('uidUser');
    this.articuloId = this.navParams.get('articuloId');
    this.pubId = this.navParams.get('pubId');
  }

  afterViewInit(){
    let audio:HTMLVideoElement = this.audio.nativeElement;
    audio.muted = false;
  }

  toggleControls() {
    let audio: HTMLVideoElement = this.audio.nativeElement;
    audio.muted = !audio.muted;
  }

  successCallback(stream: MediaStream) {
    this.grabando = true;
    var options = {
      type: 'audio',
      mimeType: 'audio/wav',
      recorderType: RecordRTC.StereoAudioRecorder,
      numberOfAudioChannels: 1,
      desiredSampRate: 8 * 1000,
    };
    this.stream = stream;
    this.recordRTC = RecordRTC(stream, options);
    this.recordRTC.setRecordingDuration(this.duration);
    this.recordRTC.startRecording();
    let audio: HTMLVideoElement = this.audio.nativeElement;
    audio.src = window.URL.createObjectURL(stream);
    this.toggleControls();
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

  processAudio(audioVideoWebMURL) {
    this.grabado = true;
    let audio: HTMLVideoElement = this.audio.nativeElement;
    audio.src = audioVideoWebMURL;
    this.loader.dismiss();
  }

  errorCallback() {
    //handle error here
  }

  startRecording() {

    this.grabado = false;
    let mediaConstraints = { audio: true, video: false};
    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then(this.successCallback.bind(this), this.errorCallback.bind(this));
  }

  stopRecording() {
    this.presentLoading();
    this.toggleControls();
    this.grabando = false;
    let recordRTC = this.recordRTC;
    recordRTC.stopRecording(this.processAudio.bind(this));
    let stream = this.stream;
    stream.getAudioTracks().forEach(track => track.stop());
  }


  upload() {
    let loader = this.loadingCtrl.create({
      content: "Cargando...",
      dismissOnPageChange: true
    });
    loader.present();
    let recordRTC = this.recordRTC;
    this.comments = this.afDB.list('/comentarios/' + this.articuloId);
    this.commentsUser = this.afDB.list('/user-comentarios/' + this.uidUser + '/' + this.articuloId);
    var recordedBlob = recordRTC.getBlob();
    var filename = '/audios/' + this.articuloId + '/' + UUID.UUID() + '.wav';
    var time = Date.now() / 1000 * -1;
    this.fb.storage().ref( filename).put(recordedBlob).then(resultado => {
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
        this.presentToast('Su comentario fue enviado con exito. A la espera de aprobación');
        this.dismiss();
      });
    });
    });
  }

    presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Cargando..."
    });
    this.loader.present();
  }

}
