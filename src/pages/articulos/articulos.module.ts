import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ArticulosPage } from './articulos';
import { PipesModule } from "../../pipes/pipes.module";


@NgModule({
  declarations: [
    ArticulosPage
  ],
  imports: [
    IonicPageModule.forChild(ArticulosPage),
    PipesModule,
  ],
})
export class ArticulosPageModule {
}
