import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'cmstitle',
    standalone: false
})
export class CmsTitlePipe implements PipeTransform {
  transform(value, args: any[], argTitle: string = 'title', argTitleML: string = 'titleML'): any {
    if (!value || !args || args.length === 0) {
      return '';
    }
    const find = args.find(x => x.id === value);
    if (!find) {
      return value;
    }
    // if (!find.titleML || find.titleML.length === 0) {
    //   return find.title;
    // }
    // return find.titleML;
    if (!argTitleML || argTitleML.length == 0 || !find[argTitleML] || find[argTitleML].length === 0) {
      return find[argTitle];
    }
    if (argTitleML && argTitleML.length > 0)
      return find[argTitleML];
    return '';
  }
}
