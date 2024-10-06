import {
  AfterViewInit, ChangeDetectorRef, Component, Inject,
  OnDestroy, OnInit
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { PageEvent } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { Router } from "@angular/router";
import { TranslateService } from '@ngx-translate/core';
import {
  CoreUserModel,
  DataFieldInfoModel,
  EstatePropertyHistoryService,
  FilterModel, FormInfoModel,
  SortTypeEnum, TokenInfoModel
} from "ntk-cms-api";
import { Subscription } from "rxjs";
import { ComponentOptionSearchModel } from "src/app/core/cmsComponent/base/componentOptionSearchModel";
import { ComponentOptionStatistModel } from "src/app/core/cmsComponent/base/componentOptionStatistModel";
import { ListBaseComponent } from "src/app/core/cmsComponent/listBaseComponent";
import { PublicHelper } from "src/app/core/helpers/publicHelper";
import { TokenHelper } from "src/app/core/helpers/tokenHelper";
import { CmsToastrService } from "src/app/core/services/cmsToastr.service";
import { PageInfoService } from "src/app/core/services/page-info.service";


@Component({
  selector: 'app-estate-property-history-responsible-user-list',
  templateUrl: './responsible-user-list.component.html',
})
export class EstatePropertyHistoryResponsibleUserListComponent extends ListBaseComponent<EstatePropertyHistoryService, CoreUserModel, number>
  implements OnInit, OnDestroy, AfterViewInit {
  requestTitle = "";
  requestPropertyId = "";
  constructorInfoAreaId = this.constructor.name;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EstatePropertyHistoryResponsibleUserListComponent>,
    public contentService: EstatePropertyHistoryService,
    private cmsToastrService: CmsToastrService,
    public tokenHelper: TokenHelper,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
    public pageInfo: PageInfoService,
    public publicHelper: PublicHelper,
    public dialog: MatDialog,
  ) {
    super(contentService, new CoreUserModel(), publicHelper, tokenHelper, translate);
    this.publicHelper.processService.cdr = this.cdr;
    if (data) {
      if (data.title)
        this.requestTitle = data.title + '';
      if (data.id)
        this.requestPropertyId = data.id + '';
    }
    this.optionsSearch.parentMethods = {
      onSubmit: (model) => this.onSubmitOptionsSearch(model),
    };


  }

  dataSource: any;
  tablePropertySelected = [];
  filteModelContent = new FilterModel();
  formInfo: FormInfoModel = new FormInfoModel();


  optionsSearch: ComponentOptionSearchModel = new ComponentOptionSearchModel();
  optionsStatist: ComponentOptionStatistModel =
    new ComponentOptionStatistModel();

  tokenInfo = new TokenInfoModel();



  tabledisplayedColumns: string[] = [];
  tabledisplayedColumnsSource: string[] = [
    'LinkMainImageIdSrc',
    'Id',
    'RecordStatus',
    'Name',
    'LastName',
    'CompanyName',
    'email',
    'mobile',
    'action_menu',
  ];
  tabledisplayedColumnsMobileSource: string[] = [
    'Id',
    'RecordStatus',
    'Name',
    'LastName',
    'action_menu',
  ];
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<
    string,
    DataFieldInfoModel
  >();
  cmsApiStoreSubscribe: Subscription;
  ngOnInit(): void {
    this.formInfo.formTitle = this.translate.instant('TITLE.QUICK_VIEW');

    this.tokenHelper.getTokenInfoState().then((value) => {
      this.tokenInfo = value;
      if (!this.firstLoadDataRunned)
        this.DataGetAll();
      this.tokenHelper.CheckIsAdmin();
    });

    this.cmsApiStoreSubscribe = this.tokenHelper
      .getTokenInfoStateOnChange()
      .subscribe({
        next: (ret) => {
          this.tokenInfo = ret;
          this.firstLoadDataRunned = true;
          this.DataGetAll();
          this.tokenHelper.CheckIsAdmin();
        }
      });
  }

  ngAfterViewInit(): void {

  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }

  DataGetAll(): void {

    this.tabledisplayedColumns = this.publicHelper.TableDisplayedColumns(this.tabledisplayedColumnsSource, this.tabledisplayedColumnsMobileSource, [], this.tokenInfo);

    this.tableRowsSelected = [];
    this.onActionTableRowSelect(new CoreUserModel());
    const pName = this.constructor.name + "main";
    this.translate.get('MESSAGE.get_information_list').subscribe((str: string) => { this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId); });
    this.filteModelContent.accessLoad = true;
    /*filter CLone*/
    const filterModel = JSON.parse(JSON.stringify(this.filteModelContent));
    /*filter CLone*/



    // ** */
    this.contentService
      .ServiceGetAllResponsibleUserId(this.requestPropertyId, filterModel)
      .subscribe({
        next: (ret) => {
          this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
          if (ret.isSuccess) {
            this.dataModelResult = ret;
            this.tableSource.data = ret.listItems;
          } else {
            this.cmsToastrService.typeErrorGetAll(ret.errorMessage);
          }
          this.publicHelper.processService.processStop(pName);
        },
        error: (er) => {
          this.cmsToastrService.typeError(er);
          this.publicHelper.processService.processStop(pName);
        }
      }
      );
    // ** */

  }

  onTableSortData(sort: MatSort): void {
    if (
      this.tableSource &&
      this.tableSource.sort &&
      this.tableSource.sort.active === sort.active
    ) {
      if (this.tableSource.sort.start === "asc") {
        sort.start = "desc";
        this.filteModelContent.sortColumn = sort.active;
        this.filteModelContent.sortType = SortTypeEnum.Descending;
      } else if (this.tableSource.sort.start === "desc") {
        sort.start = 'asc';
        this.filteModelContent.sortColumn = "";
        this.filteModelContent.sortType = SortTypeEnum.Ascending;
      } else {
        sort.start = "desc";
      }
    } else {
      this.filteModelContent.sortColumn = sort.active;
      this.filteModelContent.sortType = SortTypeEnum.Descending;
    }
    this.tableSource.sort = sort;
    this.filteModelContent.currentPageNumber = 0;
    this.DataGetAll();
  }
  onTablePageingData(event?: PageEvent): void {
    this.filteModelContent.currentPageNumber = event.pageIndex + 1;
    this.filteModelContent.rowPerPage = event.pageSize;
    this.DataGetAll();
  }






  onActionButtonReload(): void {
    this.DataGetAll();
  }
  onActionCopied(): void {
    this.cmsToastrService.typeSuccessCopedToClipboard();
  }
  onSubmitOptionsSearch(model: any): void {
    this.filteModelContent.filters = model;
    this.DataGetAll();
  }

  onActionBackToParent(): void {
    this.router.navigate(["/ticketing/departemen/"]);
  }

  expandedElement: any;




  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}
