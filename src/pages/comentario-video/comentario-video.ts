import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, LoadingController } from 'ionic-angular';
import * as RecordRTC from 'recordrtc';
import { AngularFireDatabase ,FirebaseListObservable } from "angularfire2/database";
import { FirebaseApp } from 'angularfire2';
import 'firebase/storage';
import { UUID } from 'angular2-uuid';
import { TimerObservable } from "rxjs/observable/TimerObservable";

@IonicPage()
@Component({
  selector: 'page-comentario-video',
  templateUrl: 'comentario-video.html',
})
export class ComentarioVideoPage {

  articuloId: string;
  grabando: boolean = false;
  grabado: boolean = false;
  uidUser: string;
  pubId: string;
  comments: FirebaseListObservable<any>;
  commentsUser: FirebaseListObservable<any>;
  duracion: any;
  timer: any;

  private stream: MediaStream;
  private recordRTC: any;
  readyToRecord: boolean = false;
  duration: number = 15 * 1000;
  reaming: number = this.duration;
  @ViewChild('video') video;

  constructor(private toastCtrl: ToastController, private fb: FirebaseApp, private afDB: AngularFireDatabase,
     private loadingCtrl: LoadingController,
    public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {

      this.uidUser = this.navParams.get('uidUser');
      this.articuloId = this.navParams.get('articuloId');
      this.pubId = this.navParams.get('pubId');

    let mediaConstraints = {
      video: {width: {exact: 320}, height: {exact: 240}},
      audio: true,
    };
    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then(this.successCallback.bind(this), this.errorCallback.bind(this));
  }

  afterViewInit(){
    let video:HTMLVideoElement = this.video.nativeElement;
    video.muted = true;
    video.controls = false;
    video.autoplay = true;
  }

  toggleControls() {
    let video: HTMLVideoElement = this.video.nativeElement;
    video.muted = !video.muted;
    video.controls = !video.controls;
    video.autoplay = !video.autoplay;
  }

  successCallback(stream: MediaStream) {
    this.readyToRecord = true;
    this.stream = stream;
    let video: HTMLVideoElement = this.video.nativeElement;
    video.src = window.URL.createObjectURL(this.stream);
  }

  errorCallback() {
    //handle error here
  }

  processVideo(audioVideoWebMURL, loading) {
    this.grabado = true;
    this.grabando = false;
    let video: HTMLVideoElement = this.video.nativeElement;
    video.src = audioVideoWebMURL;
    this.toggleControls();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  startRecording() {
    if(this.readyToRecord){
      this.grabando = true;
      this.timer = TimerObservable.create(0, 1000).subscribe(t => { 
        if(t <= 15 && this.grabando){
          this.duracion = "15:" + t;
        }else{
          this.timer = null;
        }
      });
      var options = {
        mimeType: 'video/webm\;codecs=h264', // or video/webm\;codecs=h264 or video/webm\;codecs=vp9
        audioBitsPerSecond: 64000,
        videoBitsPerSecond: 64000,
        bitsPerSecond: 64000 // if this line is provided, skip above two
      };
      this.recordRTC = RecordRTC(this.stream, options);
      this.recordRTC.setRecordingDuration(this.duration).onRecordingStopped(this.processVideo.bind(this));
      this.recordRTC.startRecording();
      let video: HTMLVideoElement = this.video.nativeElement;
      video.src = window.URL.createObjectURL(this.stream);
    }
  }

  volverCargar(){
    this.toggleControls();
    this.grabado = false;
    this.duracion = null;
    let mediaConstraints = {
      video: {width: {exact: 320}, height: {exact: 240}},
      audio: true,
    };
    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then(this.successCallback.bind(this), this.errorCallback.bind(this));
  }

  stopRecording() {
    this.grabando = false;
    let recordRTC = this.recordRTC;
    recordRTC.stopRecording(this.processVideo.bind(this));
    let stream = this.stream;
    stream.getAudioTracks().forEach(track => track.stop());
    stream.getVideoTracks().forEach(track => track.stop());
  }

    upload() {
    let loader = this.loadingCtrl.create({
      content: "Cargando...",
      dismissOnPageChange: true
    });
    loader.present();
    var time = Date.now() / 1000 * -1;
    let recordRTC = this.recordRTC;
    this.comments = this.afDB.list('/comentarios/' + this.articuloId);
    this.commentsUser = this.afDB.list('/user-comentarios/' + this.uidUser + '/' + this.articuloId);
    var recordedBlob = recordRTC.getBlob();
    var filename = '/videos/' + this.articuloId + '/' + UUID.UUID() + '.webm';
    this.fb.storage().ref( filename).put(recordedBlob).then(resultado => {
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
        this.dismiss();
      });
    });
    });
  }

  presentToast(mensaje: string) {
    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: 3000
    });
    toast.present();
  }
}
