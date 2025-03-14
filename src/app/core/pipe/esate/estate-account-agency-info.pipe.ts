import { Pipe, PipeTransform } from '@angular/core';
import { EstateAccountAgencyService } from 'ntk-cms-api';
import { Observable, map } from 'rxjs';

@Pipe({
    name: 'estateAccountAgencyInfo',
    standalone: false
})
export class estateAccountAgencyInfoPipe implements PipeTransform {
  constructor(public service: EstateAccountAgencyService) {
  }
  transform(value: string): Observable<string> {
    if (!value || value.length <= 0) {
      return new Observable<string>();
    }
    return this.service.ServiceGetOneById(value, 1000000)
      .pipe(
        map((ret) => {
          var retOut = '';
          if (ret.isSuccess) {
            if (ret.item.title && ret.item.title.length > 0)
              retOut = ret.item.title
            ///** */
          }
          return retOut;
        },
          (er) => {
            return '';
          })  // needed only if you need projection
      );

  }

}
