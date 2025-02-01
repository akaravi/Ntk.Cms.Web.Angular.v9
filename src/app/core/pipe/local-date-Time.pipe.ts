import { Injectable, Pipe } from '@angular/core';
import { PersianCalendarService } from './persian-date/persian-date.service';


/*
  Generated class for the PersianDate pipe.

  See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
  Angular 2 Pipes.
*/
// tslint:disable-next-line: use-pipe-transform-interface
@Pipe({
  name: 'localeDateTime'
})
@Injectable()
export class LocaleDateTime {
  /**
   *
   */
  constructor(public persianCalendarService: PersianCalendarService) {

  }
  /*
    Takes a value and convert it to
   */
  transform(value: string | Date): string {
    if (typeof value === 'string') {
      if (!value || value.length === 0) {
        return '';
      }
      const d = new Date(value);
      if (!d) {
        return '';
      }
      return d.toLocaleDateString('fa-Ir') + ' ' + d.getHours() + ':' + d.getMinutes();
      //return this.persianCalendarService.PersianCalendar(d);
    }
    if (typeof value === typeof Date) {
      if (!value) {
        return '';
      }
      return value.toLocaleDateString('fa-Ir') + ' ' + value.getHours() + ':' + value.getMinutes();
      //return this.persianCalendarService.PersianCalendar(value);
    }
    return "";

    
  }
}
