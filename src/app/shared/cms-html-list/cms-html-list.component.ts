import { Component, Input, OnInit } from '@angular/core';
import { ItemMenuModel, RowMenuModel } from 'src/app/core/models/itemMenuModel';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';

@Component({
  selector: 'app-cms-html-list',
  templateUrl: './cms-html-list.component.html',
})
export class CmsHtmlListComponent implements OnInit {
  static nextId = 0;
  id = ++CmsHtmlListComponent.nextId;
  @Input() optionHeaderDisplay = true;
  @Input() optionActionDisplay = true;
  @Input() optionFooterDisplay = true;
  @Input() optionActionRowDisplay = false;
  @Input() optionClassTree = 'col-xl-3';
  @Input() optionClassList = 'col-xl-9';
  @Input() optionClassBody = 'ntk-cms-html-tree-body';

  @Input() optionTreeDisplay = true;
  @Input()
  public set optionLoading(v: ProgressSpinnerModel) {
    this.loading = v;
  }
  loading = new ProgressSpinnerModel();
  itemMenu = new ItemMenuModel();
  constructor() { }
  ngOnInit(): void {
    this.itemMenu.title = "اشتراک گذاری 1111";
    this.itemMenu.titleClick = "کلیک کنید";
    this.itemMenu.rowItems = [];
    var row = new RowMenuModel();
    row.title = "فیس بوک";
    row.hrefStr = "https://fb.com";
    this.itemMenu.rowItems.push(row);
    row = new RowMenuModel();
    row.title = "اینستا ";
    row.hrefStr = "https://fb.com";
    this.itemMenu.rowItems.push(row);
    row = new RowMenuModel();
    row.title = "اینستا ";
    row.hrefStr = "https://fb.com";
    this.itemMenu.rowItems.push(row);
    row = new RowMenuModel();
    row.title = "اینستا ";
    row.hrefStr = "https://fb.com";
    this.itemMenu.rowItems.push(row);
    row = new RowMenuModel();
    row.title = "اینستا ";
    row.hrefStr = "https://fb.com";
    this.itemMenu.rowItems.push(row);
  }
  /*
  <app-cms-html-list [optionLoading]="loading" [optionTreeDisplay]="true">
    <ng-container cms-tree>
      <!--begin:::::::::::::::::::::::::::::::::::::::::cms-tree-->
      --------------------------------------
      <!--end:::::::::::::::::::::::::::::::::::::::::cms-tree-->
    </ng-container>
    <ng-container cms-header>
      <!--begin:::::::::::::::::::::::::::::::::::::::::cms-header-->
      --------------------------------------
      <!--end:::::::::::::::::::::::::::::::::::::::::cms-header-->
    </ng-container>
    <ng-container cms-action>
      <!--begin:::::::::::::::::::::::::::::::::::::::::cms-action-->
      --------------------------------------
      <!--end:::::::::::::::::::::::::::::::::::::::::cms-action-->
    </ng-container>
    <ng-container cms-action-area>
      <!--begin:::::::::::::::::::::::::::::::::::::::::cms-action-area-->
      --------------------------------------
      <!--end:::::::::::::::::::::::::::::::::::::::::cms-action-area-->
    </ng-container>
    <ng-container cms-body>
      <!--begin:::::::::::::::::::::::::::::::::::::::::cms-body-->
      --------------------------------------
      <!--end:::::::::::::::::::::::::::::::::::::::::cms-body-->
    </ng-container>
    <ng-container cms-message>
      <!--begin:::::::::::::::::::::::::::::::::::::::::cms-message-->
      --------------------------------------
      <!--end:::::::::::::::::::::::::::::::::::::::::cms-message-->
    </ng-container>
    <ng-container cms-footer>
      <!--begin:::::::::::::::::::::::::::::::::::::::::cms-footer-->
      --------------------------------------
      <!--end:::::::::::::::::::::::::::::::::::::::::cms-footer-->
    </ng-container>
  </app-cms-html-list>
*/
}

