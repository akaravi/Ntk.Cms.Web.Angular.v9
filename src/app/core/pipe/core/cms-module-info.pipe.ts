import { Pipe, PipeTransform } from '@angular/core';
import { CoreModuleService } from 'ntk-cms-api';
import { Observable, map } from 'rxjs';

@Pipe({
    name: 'cmsmoduleinfo',
    standalone: false
})
export class CmsModuleInfoPipe implements PipeTransform {
  constructor(public service: CoreModuleService) {

  }
  transform(value: number): Observable<string> {
    if (!value || value <= 0) {
      return new Observable<string>();
    }
    return this.service.ServiceGetOneById(value, 1000000)
      .pipe(
        map((ret) => {
          var retOut = '';
          if (ret.isSuccess) {
            if (ret.item.titleML && ret.item.titleML.length > 0)
              retOut = ret.item.titleML
            ///** */
            if (ret.item.id && ret.item.id > 0) {
              if (retOut.length > 0)
                retOut = retOut + " | ";
              retOut = retOut + ret.item.id
            }
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
