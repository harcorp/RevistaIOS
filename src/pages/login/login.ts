import { SignupPage } from './../signup/signup';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, AlertController, ViewController, ToastController, Platform, ModalController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { EmailValidator } from '../../validators/email';
import { AngularFireAuth } from "angularfire2/auth";
import {AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database'
import * as firebase from 'firebase/app';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from "@ionic-native/google-plus";

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
        private modalCtrl: ModalController,
        private platform: Platform, private fb: Facebook, private googlePlus: GooglePlus,
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
          this.loading.dismiss();
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

        this.presentLoading();
      }
  }

  presentLoading(){
    this.loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
    });
    this.loading.present();
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
    this.presentLoading();
    if (this.platform.is('cordova')) {
      this.fb.login(['email', 'public_profile']).then(res => {
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        this.afAuth.auth.signInWithCredential(facebookCredential).then(res => {
          
          this.usuario = this.afDB.object('/users/' + res.uid);
          this.usuario.set({nombre: res.displayName, profilePicture: res.photoURL})
            .then(result => {
              let toast = this.toastCtrl.create({
                message: 'Ingreso correcto',
                duration: 3000
              });
              toast.present();
              this.loading.dismiss();
              this.viewCtrl.dismiss();
            });
        });
      })
    }
  }

  signInGoogle(){
    this.presentLoading();
    if (this.platform.is('cordova')) {
        this.googlePlus.login({
          'webClientId': '17548864478-3vrj2t96p0l96sblij6l0pbjf53rs5as.apps.googleusercontent.com'
        }).then(res => {
          this.afAuth.auth.signInWithCredential(res.idToken).then(res => {
            
            this.usuario = this.afDB.object('/users/' + res.uid);
            this.usuario.set({nombre: res.displayName, profilePicture: res.photoURL})
              .then(result => {
                let toast = this.toastCtrl.create({
                  message: 'Ingreso correcto',
                  duration: 3000
                });
                toast.present();
                this.loading.dismiss();
                this.viewCtrl.dismiss();
              });
          });
        });
      }
  }

  goToSignUp() {
    let modal = this.modalCtrl.create(SignupPage);
    modal.present();
  }
}
