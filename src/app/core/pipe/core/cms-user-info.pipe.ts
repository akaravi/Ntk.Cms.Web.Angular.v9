import { Pipe, PipeTransform } from '@angular/core';
import { CoreUserService } from 'ntk-cms-api';
import { Observable, map } from 'rxjs';

@Pipe({ name: 'cmsuserinfo' })
export class CmsUserInfoPipe implements PipeTransform {
  constructor(public service: CoreUserService) {

  }
  async transform(value: number): Promise<Observable<string>> {
    if (!value || value <= 0) {
      return new Observable<string>();
    }
    const prtfix = "CmsUserInfoPipe_";
    //to
    // while (this.service.cmsApiStore.processInRun(prtfix + value)) {
    //   await delay(10000);
    // }
    this.service.cmsApiStore.processStart(prtfix + value);
    return this.service.ServiceGetOneById(value, 1000000)
      .pipe(
        map((ret) => {
          var retOut = '';
          if (ret.isSuccess) {
            if (ret.item.username && ret.item.username.length > 0)
              retOut = ret.item.username
            ///** */
            if (ret.item.email && ret.item.email.length > 0) {
              if (retOut.length > 0)
                retOut = retOut + " | ";
              retOut = retOut + ret.item.email
            }
            ///** */
            if (ret.item.name && ret.item.name.length > 0) {
              if (retOut.length > 0)
                retOut = retOut + " | ";
              retOut = retOut + ret.item.name
            }
            ///** */
            if (ret.item.lastName && ret.item.lastName.length > 0) {
              if (retOut.length > 0)
                retOut = retOut + " | ";
              retOut = retOut + ret.item.lastName
            }
            ///** */
            if (ret.item.mobile && ret.item.mobile.length > 0) {
              if (retOut.length > 0)
                retOut = retOut + " | ";
              retOut = retOut + ret.item.mobile
            }
          }
          if (retOut.length === 0)
            retOut = value.toString();

          this.service.cmsApiStore.processStop(prtfix + value)
          return retOut;
        },
          (er) => {
            this.service.cmsApiStore.processStop(prtfix + value)
            return value.toString();
          })  // needed only if you need projection
      );

  }

}
