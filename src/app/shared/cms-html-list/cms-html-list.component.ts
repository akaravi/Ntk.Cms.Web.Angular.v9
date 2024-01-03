import { Component, Input, OnInit } from '@angular/core';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
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
  @Input() optionTitle = 'منوی عملیات';
  @Input() optionCategoryTitle = 'دسته بندی';
  @Input() optionSelectRowItemTitle = '';
  @Input() optionClassBody = 'ntk-cms-html-tree-body';

  @Input() optionTreeDisplay = true;
  @Input()
  public set optionLoading(v: ProgressSpinnerModel) {
    this.loading = v;
  }
  loading = new ProgressSpinnerModel();

  constructor(
    public tokenHelper: TokenHelper,
  ) { }
  ngOnInit(): void {

  }
  viewMenuItemRow = false;
  viewMenuMain = false;
  viewTree = false;
  actionViewTree(state?: boolean) {
    if (state == true) {
      this.viewTree = false;
    } else if (state == false) {
      this.viewTree = true;
    } else {
      this.viewTree = !this.viewTree;
    }
    this.viewMenuMain = false;
    this.viewMenuItemRow = false;
  }
  actionViewMenuItemRow(state?: boolean) {
    if (state == true) {
      this.viewMenuItemRow =true ;
    } else if (state == false) {
      this.viewMenuItemRow = false;
    } else {
      this.viewMenuItemRow = !this.viewMenuItemRow;
    }

    this.viewMenuMain = false;
    this.viewTree = false;
  }

  actionViewMenuMain(state?: boolean) {
    if (state == true) {
      this.viewMenuMain = true;
    } else if (state == false) {
      this.viewMenuMain = false;
    } else {
      this.viewMenuMain = !this.viewMenuMain;
    }

    this.viewMenuItemRow = false;
    this.viewTree = false;
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

