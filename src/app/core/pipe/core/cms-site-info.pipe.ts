import { Pipe, PipeTransform } from '@angular/core';
import { CoreSiteService } from 'ntk-cms-api';
import { Observable, map } from 'rxjs';

@Pipe({ name: 'cmssiteinfo' })
export class CmsSiteInfoPipe implements PipeTransform {
  constructor(public service: CoreSiteService) {

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
            if (ret.item.title && ret.item.title.length > 0)
              retOut = ret.item.title
            ///** */
            if (ret.item.id && ret.item.id > 0) {
              if (retOut.length > 0)
                retOut = retOut + " | ";
              retOut = retOut + ret.item.id
            }
            ///** */
            if (ret.item.domain && ret.item.domain.length > 0 && ret.item.subDomain && ret.item.subDomain.length > 0) {
              if (retOut.length > 0)
                retOut = retOut + " | ";
              retOut = retOut + ret.item.subDomain + "." + ret.item.domain;
            }
            else if (ret.item.domain && ret.item.domain.length > 0) {
              if (retOut.length > 0)
                retOut = retOut + " | ";
              retOut = retOut + ret.item.domain
            }

          }
          if (retOut.length === 0)
            retOut = value.toString();
          return retOut;
        },
          (er) => {
            return value.toString();
          })  // needed only if you need projection
      );

  }

}
