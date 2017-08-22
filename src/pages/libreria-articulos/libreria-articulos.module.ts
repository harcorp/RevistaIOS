import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LibreriaArticulosPage } from './libreria-articulos';
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    LibreriaArticulosPage,
  ],
  imports: [
    IonicPageModule.forChild(LibreriaArticulosPage),
    PipesModule
  ],
})
export class LibreriaArticulosPageModule {}
