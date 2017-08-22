import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase/app';

@Injectable()
export class AuthProvider {

  constructor(public afAuth: AngularFireAuth){

  }

  loginUser(newEmail: string, newPassword: string): firebase.Promise<any>{
    return this.afAuth.auth.signInWithEmailAndPassword(newEmail, newPassword);
  }

  signupUser(newEmail: string, newPassword: string): firebase.Promise<any>{
    return this.afAuth.auth.createUserWithEmailAndPassword(newEmail, newPassword);
  }

  logoutUser(): firebase.Promise<any>{
    return this.afAuth.auth.signOut();
  }

  resetPassword(email: string): firebase.Promise<any>{
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }
}
