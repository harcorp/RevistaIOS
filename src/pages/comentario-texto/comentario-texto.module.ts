import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComentarioTextoPage } from './comentario-texto';

@NgModule({
  declarations: [
    ComentarioTextoPage,
  ],
  imports: [
    IonicPageModule.forChild(ComentarioTextoPage),
  ],
})
export class ComentarioTextoPageModule {}
