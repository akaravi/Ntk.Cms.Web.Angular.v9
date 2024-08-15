
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import {
  CoreSiteCategoryCmsModuleModel,
  CoreSiteCategoryCmsModuleService,
  DataFieldInfoModel, ErrorExceptionResult,
  FilterDataModel,
  FilterModel, SortTypeEnum, TokenInfoModel
} from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-core-sitecategorycmsmodule-listview',
  templateUrl: './listview.component.html',
})
export class CoreSiteCategoryCmsModuleListViewComponent implements OnInit, OnDestroy {
  @Input() set optionSiteCategoryId(x: number) {
    this.LinkSiteCategoryId = x;
    this.DataGetAll();
  }
  LinkSiteCategoryId = 0;
  constructorInfoAreaId = this.constructor.name;
  constructor(
    private coreSiteCategoryCmsModuleService: CoreSiteCategoryCmsModuleService,
    public publicHelper: PublicHelper,
    private cmsToastrService: CmsToastrService,
    private tokenHelper: TokenHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {
    this.publicHelper.processService.cdr = this.cdr;

  }
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  tableContentSelected = [];
  filteModelContent = new FilterModel();
  dataModelResult: ErrorExceptionResult<CoreSiteCategoryCmsModuleModel> = new ErrorExceptionResult<CoreSiteCategoryCmsModuleModel>();
  tokenInfo = new TokenInfoModel();


  tableRowsSelected: Array<CoreSiteCategoryCmsModuleModel> = [];
  tableRowSelected: CoreSiteCategoryCmsModuleModel = new CoreSiteCategoryCmsModuleModel();
  tableSource: MatTableDataSource<CoreSiteCategoryCmsModuleModel> = new MatTableDataSource<CoreSiteCategoryCmsModuleModel>();


  tabledisplayedColumns: string[] = [];
  tabledisplayedColumnsSource: string[] = [
    'virtual_CmsSiteCategory.title',
    'virtual_CmsModule.title',
    'virtual_CmsModule.Description',
  ];
  tabledisplayedColumnsMobileSource: string[] = [
    'virtual_CmsSiteCategory.title',
    'virtual_CmsModule.title',
    'virtual_CmsModule.Description',
  ];

  cmsApiStoreSubscribe: Subscription;

  ngOnInit(): void {
    this.filteModelContent.sortColumn = 'Title';
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
      this.DataGetAll();
    });

    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe({
      next: (ret) => {
        this.tokenInfo = ret;
        this.DataGetAll();
      }
    });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  DataGetAll(): void {
    this.tabledisplayedColumns = this.publicHelper.TableDisplayedColumns(this.tabledisplayedColumnsSource, this.tabledisplayedColumnsMobileSource, [], this.tokenInfo);
    this.tableRowsSelected = [];
    this.onActionTableRowSelect(new CoreSiteCategoryCmsModuleModel());
    this.filteModelContent.accessLoad = true;

    const filterModel = JSON.parse(JSON.stringify(this.filteModelContent));
    if (this.LinkSiteCategoryId && this.LinkSiteCategoryId > 0) {
      const fastfilter = new FilterDataModel();
      fastfilter.propertyName = 'LinkCmsSiteCategoryId';
      fastfilter.value = this.LinkSiteCategoryId;
      filterModel.filters.push(fastfilter);
    }
    const pName = this.constructor.name + '.ServiceGetAll';
    this.translate.get('MESSAGE.Request_new_access').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });
    this.coreSiteCategoryCmsModuleService.ServiceGetAll(filterModel).subscribe({
      next: (ret) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);

        if (ret.isSuccess) {
          if (this.LinkSiteCategoryId && this.LinkSiteCategoryId > 0) {
            this.tabledisplayedColumns = this.publicHelper.listRemoveIfExist(
              this.tabledisplayedColumns,
              'virtual_CmsSiteCategory.title'
            );
          }
          this.dataModelResult = ret;
          this.tableSource.data = ret.listItems;
        } else {
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.publicHelper.processService.processStop(pName);
      },
      error: (er) => {
        this.cmsToastrService.typeError(er);
        this.publicHelper.processService.processStop(pName, false);
      }
    }
    );
  }


  onTableSortData(sort: MatSort): void {
    if (this.tableSource && this.tableSource.sort && this.tableSource.sort.active === sort.active) {
      if (this.tableSource.sort.start === 'asc') {
        sort.start = 'desc';
        this.filteModelContent.sortColumn = sort.active;
        this.filteModelContent.sortType = SortTypeEnum.Descending;
      } else if (this.tableSource.sort.start === 'desc') {
        sort.start = 'asc';
        this.filteModelContent.sortColumn = '';
        this.filteModelContent.sortType = SortTypeEnum.Ascending;
      } else {
        sort.start = 'desc';
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

  onActionTableRowSelect(row: CoreSiteCategoryCmsModuleModel): void {
    this.tableRowSelected = row;
    if (!row["expanded"])
      row["expanded"] = false;
    row["expanded"] = !row["expanded"];
  }

}
