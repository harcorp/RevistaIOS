import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PublicacionPage } from './publicacion';
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    PublicacionPage,
  ],
  imports: [
    IonicPageModule.forChild(PublicacionPage),
    PipesModule
  ],
})
export class PublicacionPageModule {}
