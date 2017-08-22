import { Component } from '@angular/core';
import { IonicPage, 
  NavController, 
  NavParams, 
  LoadingController, 
  Loading, 
  AlertController, 
  ViewController,
  ToastController
} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { EmailValidator } from '../../validators/email';
import { AngularFireDatabase, FirebaseObjectObservable} from 'angularfire2/database';

@IonicPage({
  segment: 'registrarse'
})
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  public signupForm:FormGroup;
  public loading:Loading;
  usuario: FirebaseObjectObservable<any>;

  constructor(public authData: AuthProvider, public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController, public alertCtrl: AlertController,
    public afDB: AngularFireDatabase, public toastCtrl: ToastController,
    public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {

    this.signupForm = formBuilder.group({
      nombres: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });
  }

    signupUser(){
    if (!this.signupForm.valid){
      console.log(this.signupForm.value);
    } else {
      this.authData.signupUser(this.signupForm.value.email, this.signupForm.value.password)
      .then(res => {
          this.usuario = this.afDB.object('/users/' + res.uid);
          this.usuario.set({nombre: this.signupForm.value.nombres, profilePicture: res.photoURL})
            .then(result => {
              this.loading.dismiss();
              let toast = this.toastCtrl.create({
                message: 'Ingreso correcto',
                duration: 3000
              });
              toast.present();
              this.viewCtrl.dismiss();
            });
      }, (error) => {
        this.loading.dismiss().then( () => {
          var errorMessage: string = error.message;
            let alert = this.alertCtrl.create({
              message: errorMessage,
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

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
