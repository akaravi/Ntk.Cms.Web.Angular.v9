import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Pipe({
    name: 'boolclass',
    standalone: false
})
export class BoolStatusClassPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }

  transform(value: boolean | null): SafeHtml {
    if (value === true) {
      return 'fa fa-check ';

    }
    return 'fa fa-square';
  }

}
