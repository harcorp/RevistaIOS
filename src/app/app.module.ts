import { InAppBrowser } from '@ionic-native/in-app-browser';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, enableProdMode } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AuthProvider } from '../providers/auth/auth';
import { LoginPage } from "../pages/login/login";
import { ComentarioTextoPage } from "../pages/comentario-texto/comentario-texto";
import { ComentarioVoicePage } from "../pages/comentario-voice/comentario-voice";
import { ComentarioVideoPage } from "../pages/comentario-video/comentario-video";
import { SignupPage } from "../pages/signup/signup";
import { GooglePlus } from '@ionic-native/google-plus';
import { StreamingMedia } from "@ionic-native/streaming-media";
import { Facebook } from "@ionic-native/facebook";
import { VideoCapturePlus } from "@ionic-native/video-capture-plus";
import { MediaCapture } from '@ionic-native/media-capture';

export const firebaseConfig = {
  apiKey: "AIzaSyB0f-eM3Eq-_V960Re-sOGlj_YA8HGvSpw",
  authDomain: "revista-digital-bb5d4.firebaseapp.com",
  databaseURL: "https://revista-digital-bb5d4.firebaseio.com",
  projectId: "revista-digital-bb5d4",
  storageBucket: "revista-digital-bb5d4.appspot.com",
  messagingSenderId: "17548864478"
};

 enableProdMode();
@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: 'Volver',
      platforms: {
        ios: {
          statusbarPadding: false
        }
      }
    }),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    SignupPage,
    ComentarioTextoPage,
    ComentarioVideoPage,
    ComentarioVoicePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    GooglePlus,
    Facebook,
    StreamingMedia,
    VideoCapturePlus,
    MediaCapture,
    InAppBrowser
  ],
})
export class AppModule {}
