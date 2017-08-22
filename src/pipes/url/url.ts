import { Pipe, PipeTransform } from '@angular/core';
import { FirebaseApp } from 'angularfire2';
import 'firebase/storage';

@Pipe({
  name: 'url',
})
export class UrlPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  constructor(private fb: FirebaseApp){
    
  }
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, args) {
    if(value != null){
      return new Promise(resolve => {
        this.fb.storage().ref().child(value).getDownloadURL()
          .then(v => {
            resolve(v);
          });
      })
    }
  }
}
