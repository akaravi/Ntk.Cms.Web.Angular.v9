import { Directive, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { ClipboardService } from '../services/ngx-clipboard.service';



@Directive({
    selector: '[ngxClipboardIfSupported]',
    standalone: false
})
export class ClipboardIfSupportedDirective implements OnInit {
    constructor(
        private _clipboardService: ClipboardService,
        private _viewContainerRef: ViewContainerRef,
        private _templateRef: TemplateRef<any>
    ) {}

    ngOnInit() {
        if (this._clipboardService.isSupported) {
            this._viewContainerRef.createEmbeddedView(this._templateRef);
        }
    }
}
