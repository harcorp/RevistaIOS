import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComentarioVoicePage } from './comentario-voice';

@NgModule({
  declarations: [
    ComentarioVoicePage,
  ],
  imports: [
    IonicPageModule.forChild(ComentarioVoicePage),
  ],
})
export class ComentarioVoicePageModule {}
