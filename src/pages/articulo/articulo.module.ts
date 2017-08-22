import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ArticuloPage } from './articulo';
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    ArticuloPage,
  ],
  imports: [
    IonicPageModule.forChild(ArticuloPage),
    PipesModule,
  ],
})
export class ArticuloPageModule {}
