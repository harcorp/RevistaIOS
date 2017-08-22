import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LibreriaDigitalPage } from './libreria-digital';
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    LibreriaDigitalPage,
  ],
  imports: [
    IonicPageModule.forChild(LibreriaDigitalPage),
    PipesModule
  ],
})
export class LibreriaDigitalPageModule {}
