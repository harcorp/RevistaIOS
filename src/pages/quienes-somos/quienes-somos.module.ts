import { PipesModule } from './../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuienesSomosPage } from './quienes-somos';

@NgModule({
  declarations: [
    QuienesSomosPage,
  ],
  imports: [
    IonicPageModule.forChild(QuienesSomosPage),
    PipesModule
  ],
})
export class QuienesSomosPageModule {}
