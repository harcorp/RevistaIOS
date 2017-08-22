import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, AlertController, ViewController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { EmailValidator } from '../../validators/email';
import { AngularFireAuth } from "angularfire2/auth";
import {AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database'
import * as firebase from 'firebase/app';

@IonicPage({
  segment: 'ingresar'
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public loginForm:FormGroup;
  public loading:Loading;

  usuario: FirebaseObjectObservable<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams,
        public authData: AuthProvider, public formBuilder: FormBuilder,
        public viewCtrl: ViewController, public afAuth: AngularFireAuth,
        public toastCtrl: ToastController,public afDB: AngularFireDatabase,
        public alertCtrl: AlertController, public loadingCtrl: LoadingController) {

      this.loginForm = formBuilder.group({
        email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
        password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
      });
  }

  loginUser(){
      if (!this.loginForm.valid){
        console.log(this.loginForm.value);
      } else {
        this.authData.loginUser(this.loginForm.value.email, this.loginForm.value.password)
        .then( authData => {
          this.navCtrl.pop();
        }, error => {
          this.loading.dismiss().then( () => {
            let alert = this.alertCtrl.create({
              message: error.message,
              buttons: [
                {
                  text: "Ok",
                  role: 'cancel'
                }
              ]
            });
            alert.present();
          });
        });

        this.loading = this.loadingCtrl.create({
          dismissOnPageChange: true,
        });
        this.loading.present();
      }
  }

  goToResetPassword(){
    this.navCtrl.push('ResetPassswordPage');
  }

  createAccount(){
    this.navCtrl.push('SignupPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  signInFacebook() {
    this.afAuth.auth
      .signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then(res => {
          this.usuario = this.afDB.object('/users/' + res.user.uid);
          this.usuario.set({nombre: res.user.displayName, profilePicture: res.user.photoURL})
            .then(result => {
              let toast = this.toastCtrl.create({
                message: 'Ingreso correcto',
                duration: 3000
              });
              toast.present();
              this.viewCtrl.dismiss();
            });
      });
  }

  signInGoogle(){
        this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(res => {
          this.usuario = this.afDB.object('/users/' + res.user.uid);
          this.usuario.set({nombre: res.user.displayName, profilePicture: res.user.photoURL})
            .then(result => {
              let toast = this.toastCtrl.create({
                message: 'Ingreso correcto',
                duration: 3000
              });
              toast.present();
              this.viewCtrl.dismiss();
            });
        });

  }

}
