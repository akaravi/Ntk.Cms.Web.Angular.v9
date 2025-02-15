import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'keys',
    standalone: false
})
export class KeysPipe implements PipeTransform {
  transform(value: any): string[] {
    return Object.keys(value)
  }
}
