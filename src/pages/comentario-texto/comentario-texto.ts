import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireDatabase ,FirebaseListObservable } from "angularfire2/database";


@IonicPage()
@Component({
  selector: 'page-comentario-texto',
  templateUrl: 'comentario-texto.html',
})
export class ComentarioTextoPage {

  commentForm: FormGroup;
  commentsUser: FirebaseListObservable<any>;
  comments: FirebaseListObservable<any>;
  uidUser: string;
  articuloId: string;
  pubId: string;

  constructor(private afDB: AngularFireDatabase, private toastCtrl: ToastController,
    public viewCtrl: ViewController,
    public navCtrl: NavController, public navParams: NavParams, public fb: FormBuilder) {
    this.commentForm = fb.group({
      comentario: ['', Validators.compose([Validators.maxLength(255), Validators.required])]
    });

    this.uidUser = this.navParams.get('uidUser');
    this.articuloId = this.navParams.get('articuloId');
    this.pubId = this.navParams.get('pubId');
  }

  cargarComentarioTexto(mensaje: string){
    if (!this.commentForm.valid){
        console.log(this.commentForm.value);
      } else {
    var time = Date.now() / 1000 * -1;
    this.comments = this.afDB.list('/comentarios/' + this.articuloId);
    this.commentsUser = this.afDB.list('/user-comentarios/' + this.uidUser + '/' + this.articuloId);
    this.comments.push({
      aproved: false,
      texto: this.commentForm.value.comentario,
      type: 1,
      timestamp: time,
      parent: this.pubId,
      uid_user: this.uidUser
    }).then(result => {
      this.commentsUser.update(result.key, {
        aproved: false,
        texto: this.commentForm.value.comentario,
        type: 1,
        timestamp: time,
        parent: this.pubId,
        uid_user: this.uidUser
      }).then(resultado => {
        this.presentToast('Su comentario fue enviado con exito. A la espera de aprobación');
        this.dismiss();
      });
    });
    }
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
