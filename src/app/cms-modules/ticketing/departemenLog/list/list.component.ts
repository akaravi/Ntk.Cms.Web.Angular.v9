import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  ApplicationSourceModel, ClauseTypeEnum,
  FilterDataModel,
  FilterModel, RecordStatusEnum, SortTypeEnum, TicketingDepartemenLogModel,
  TicketingDepartemenLogService
} from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { ListBaseComponent } from 'src/app/core/cmsComponent/listBaseComponent';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { PageInfoService } from 'src/app/core/services/page-info.service';

@Component({
  selector: 'app-application-app-list',
  templateUrl: './list.component.html'
})
export class TicketingDepartemenLogListComponent extends ListBaseComponent<TicketingDepartemenLogService, TicketingDepartemenLogModel, number> implements OnInit, OnDestroy {
  requestDepartemenId = 0;
  requestOperatorId = 0;
  constructor(
    public contentService: TicketingDepartemenLogService,
    private activatedRoute: ActivatedRoute,
    private cmsToastrService: CmsToastrService,
    private router: Router,
    public tokenHelper: TokenHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
    public pageInfo: PageInfoService,
    public publicHelper: PublicHelper,
    public dialog: MatDialog) {
    super(contentService, new TicketingDepartemenLogModel, publicHelper, tokenHelper);
    this.loading.cdr = this.cdr; this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    this.requestDepartemenId = + Number(this.activatedRoute.snapshot.paramMap.get('DepartemenId'));
    this.requestOperatorId = + Number(this.activatedRoute.snapshot.paramMap.get('OperatorId'));
    this.optionsSearch.parentMethods = {
      onSubmit: (model) => this.onSubmitOptionsSearch(model),
    };

    /*filter Sort*/
    this.filteModelContent.sortColumn = 'CreatedDate';
    this.filteModelContent.sortType = SortTypeEnum.Descending;
  }

  comment: string;
  author: string;
  dataSource: any;
  flag = false;
  tableContentSelected = [];

  filteModelContent = new FilterModel();





  categoryModelSelected: ApplicationSourceModel;

  tabledisplayedColumns: string[] = [];
  tabledisplayedColumnsSource: string[] = [
    'Id',
    'RecordStatus',
    'Title',
    'LinkSourceId',
    'CreatedDate',
    'UpdatedDate',
    // 'Action'
  ];

  expandedElement: TicketingDepartemenLogModel | null;
  cmsApiStoreSubscribe: Subscription;

  ngOnInit(): void {

    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
      this.DataGetAll();
    });

    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {
      this.tokenInfo = next;
      this.DataGetAll();
    });
    let filter = new FilterDataModel();
    if (this.requestOperatorId > 0) {
      filter.propertyName = 'LinkFromOperatorId';
      filter.value = this.requestOperatorId;
      this.filteModelContent.filters.push(filter);
    }

    if (this.requestDepartemenId > 0) {
      filter = new FilterDataModel();
      filter.propertyName = 'LinkFromTicketingDepartemenId';
      filter.value = this.requestDepartemenId;
      filter.clauseType = ClauseTypeEnum.Or;
      this.filteModelContent.filters.push(filter);
      /*filter*/
      filter = new FilterDataModel();
      filter.propertyName = 'LinkToTicketingDepartemenId';
      filter.value = this.requestDepartemenId;
      filter.clauseType = ClauseTypeEnum.Or;
      this.filteModelContent.filters.push(filter);
    }

  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }

  DataGetAll(): void {
    this.tabledisplayedColumns = this.publicHelper.TabledisplayedColumnsCheckByAllDataAccess(this.tabledisplayedColumnsSource, [], this.tokenInfo);
    this.tableRowsSelected = [];
    this.onActionTableRowSelect(new TicketingDepartemenLogModel());
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName, this.translate.instant('MESSAGE.get_information_list'));
    this.filteModelContent.accessLoad = true;
    /*filter CLone*/
    const filterModel = JSON.parse(JSON.stringify(this.filteModelContent));
    /*filter CLone*/
    if (this.categoryModelSelected && this.categoryModelSelected.id > 0) {
      const fastfilter = new FilterDataModel();
      fastfilter.propertyName = 'LinkFromTicketingDepartemenId';
      fastfilter.value = this.categoryModelSelected.id;
      filterModel.filters.push(fastfilter);
    }
    this.contentService.setAccessLoad();
    this.contentService.ServiceGetAllEditor(filterModel).subscribe(
      (next) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.access);


        if (next.isSuccess) {
          this.dataModelResult = next;
          this.tableSource.data = next.listItems;


          if (this.optionsSearch.childMethods) {
            this.optionsSearch.childMethods.setAccess(next.access);
          }
        }
        else {
          this.cmsToastrService.typeErrorGetAll(next.errorMessage);

        }
        this.loading.Stop(pName);

      },
      (error) => {
        this.cmsToastrService.typeError(error);

        this.loading.Stop(pName);

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



  onActionSelectorSelect(model: ApplicationSourceModel | null): void {
    /*filter */
    var sortColumn = this.filteModelContent.sortColumn;
    var sortType = this.filteModelContent.sortType;
    this.filteModelContent = new FilterModel();
    this.filteModelContent.sortColumn = sortColumn;
    this.filteModelContent.sortType = sortType;
    /*filter */
    this.categoryModelSelected = model;

    this.DataGetAll();
  }
  onActionbuttonEditRow(mode: TicketingDepartemenLogModel = this.tableRowSelected): void {
    if (!mode || !mode.id || mode.id === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    this.tableRowSelected = mode;
    if (
      this.dataModelResult == null ||
      this.dataModelResult.access == null ||
      !this.dataModelResult.access.accessEditRow
    ) {
      this.cmsToastrService.typeErrorAccessEdit();
      return;
    }

    this.router.navigate(['/application/app/edit/', this.tableRowSelected.id]);

  }
  onActionbuttonDeleteRow(mode: TicketingDepartemenLogModel = this.tableRowSelected): void {
    if (mode == null || !mode.id || mode.id === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    this.tableRowSelected = mode;
    if (
      this.dataModelResult == null ||
      this.dataModelResult.access == null ||
      !this.dataModelResult.access.accessDeleteRow
    ) {
      this.cmsToastrService.typeErrorAccessDelete();
      return;
    }

    this.router.navigate(['/application/app/delete/', this.tableRowSelected.id]);

  }
  onActionbuttonStatist(): void {
    this.optionsStatist.data.show = !this.optionsStatist.data.show;
    if (!this.optionsStatist.data.show) {
      return;
    }
    const statist = new Map<string, number>();
    statist.set(this.translate.instant('MESSAGE.Active'), 0);
    statist.set(this.translate.instant('MESSAGE.All'), 0);
    const pName = this.constructor.name + '.ServiceStatist';
    this.loading.Start(pName, this.translate.instant('MESSAGE.Get_the_statist'));
    this.contentService.ServiceGetCount(this.filteModelContent).subscribe(
      (next) => {
        if (next.isSuccess) {
          statist.set('All', next.totalRowCount);
          this.optionsStatist.childMethods.setStatistValue(statist);
        }
        this.loading.Stop(pName);
      },
      (error) => {
        this.cmsToastrService.typeError(error);
        this.loading.Stop(pName);
      }
    );

    const filterStatist1 = JSON.parse(JSON.stringify(this.filteModelContent));
    const fastfilter = new FilterDataModel();
    fastfilter.propertyName = 'RecordStatus';
    fastfilter.value = RecordStatusEnum.Available;
    filterStatist1.filters.push(fastfilter);
    this.contentService.ServiceGetCount(filterStatist1).subscribe(
      (next) => {
        if (next.isSuccess) {
          statist.set('Active', next.totalRowCount);
          this.optionsStatist.childMethods.setStatistValue(statist);
        }
        this.loading.Stop(pName);
      }
      ,
      (error) => {
        this.cmsToastrService.typeError(error);
        this.loading.Stop(pName);
      }
    );

  }




  onActionbuttonReload(): void {
    this.DataGetAll();
  }
  onSubmitOptionsSearch(model: any): void {
    this.filteModelContent.filters = model;
    this.DataGetAll();
  }

  onActionBackToParent(): void {
    if (this.requestOperatorId > 0)
      this.router.navigate(['/application/app/']);
    if (this.requestDepartemenId > 0)
      this.router.navigate(['/ticketing/departemen/']);
  }

}
