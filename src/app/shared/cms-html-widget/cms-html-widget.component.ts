import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cms-html-widget',
  templateUrl: './cms-html-widget.component.html',
})
export class CmsHtmlWidgetComponent implements OnInit {
  static nextId = 0;
  id = ++CmsHtmlWidgetComponent.nextId;



  constructor() { }
  ngOnInit(): void {

  }
  /*
  <app-cms-html-widget >
    <ng-container  cms-header>
      <!--begin:::::::::::::::::::::::::::::::::::::::::cms-header-->
      --------------------------------------
      <!--end:::::::::::::::::::::::::::::::::::::::::cms-header-->
    </ng-container>
    <ng-container  cms-body>
      <!--begin:::::::::::::::::::::::::::::::::::::::::cms-body-->
      --------------------------------------
      <!--end:::::::::::::::::::::::::::::::::::::::::cms-body-->
    </ng-container>
    <ng-container  cms-footer>
      <!--begin:::::::::::::::::::::::::::::::::::::::::cms-footer-->
      --------------------------------------
      <!--end:::::::::::::::::::::::::::::::::::::::::cms-footer-->
    </ng-container>
  </app-cms-html-widget>
*/
}

