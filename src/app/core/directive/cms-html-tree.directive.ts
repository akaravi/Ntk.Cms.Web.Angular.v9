import { Directive, ElementRef } from '@angular/core';

@Directive({
    selector: '[cmsHtmlTreeHeader]',
    standalone: false
})
export class CmsHtmlTreeHeaderDirective {
  constructor(
    private el: ElementRef,
  ) { }
  host: {
    '[style.background-color]': '"yellow"',
  }
}
@Directive({
    selector: '[cmsHtmlTreeAction]',
    standalone: false
})
export class CmsHtmlTreeActionDirective {
  constructor(
    private el: ElementRef,
  ) { }
  host: {
    '[style.background-color]': '"yellow"',
  }
}
@Directive({
    selector: '[cmsHtmlTreeBody]',
    standalone: false
})
export class CmsHtmlTreeBodyDirective {
  constructor(
    private el: ElementRef,
  ) { }
  host: {
    '[style.background-color]': '"yellow"',
  }
}
@Directive({
    selector: '[cmsHtmlTreeFooter]',
    standalone: false
})
export class CmsHtmlTreeFooterDirective {
  constructor(
    private el: ElementRef,
  ) { }
  host: {
    '[style.background-color]': '"yellow"',
  }
}
