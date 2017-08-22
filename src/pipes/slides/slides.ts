import { Pipe, PipeTransform } from '@angular/core';
import { FirebaseApp } from 'angularfire2';
import 'firebase/database';

@Pipe({
  name: 'slides',
})
export class SlidesPipe implements PipeTransform {

  constructor(public fb: FirebaseApp){

  }

  transform(value, args) {
    return new Promise(resolve => {
      let keys = [];
      this.fb.database().ref('/articulos/' + value).once('value')
        .then(v => {
          v.forEach(element => {
            keys.push(element.val().thumbnail);
          });
          resolve(keys);
        });
    });
  } 
}
