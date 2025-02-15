import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { InlineSVGService } from '../services/inline-svg.service';
import { InlineSVGDirective } from './inline-svg.directive';
//import { InlineSVGService } from './inline-svg.service';

@Component({
    selector: 'inline-svg',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class InlineSVGComponent implements AfterViewInit, OnChanges {
  @Input() context: InlineSVGDirective;
  @Input() content: HTMLElement | SVGElement;
  @Input() replaceContents: boolean;
  @Input() prepend: boolean;

  /** @internal */
  _el: ElementRef;

  constructor(private _inlineSVGService: InlineSVGService, private el: ElementRef) {
    this._el = el;
  }

  ngAfterViewInit(): void {
    this._updateContent();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['content']) {
      this._updateContent();
    }
  }

  private _updateContent(): void {
    this._inlineSVGService.insertEl(
      this.context,
      this._el.nativeElement,
      this.content,
      this.replaceContents,
      this.prepend
    );
  }
}
