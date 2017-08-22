import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComentarioVideoPage } from './comentario-video';

@NgModule({
  declarations: [
    ComentarioVideoPage,
  ],
  imports: [
    IonicPageModule.forChild(ComentarioVideoPage),
  ],
})
export class ComentarioVideoPageModule {}
