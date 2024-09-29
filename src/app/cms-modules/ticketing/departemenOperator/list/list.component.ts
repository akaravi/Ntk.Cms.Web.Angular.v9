import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  ApplicationSourceModel,
  FilterDataModel,
  FilterModel, RecordStatusEnum, SortTypeEnum, TicketingDepartemenOperatorModel,
  TicketingDepartemenOperatorService
} from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { ListBaseComponent } from 'src/app/core/cmsComponent/listBaseComponent';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { PageInfoService } from 'src/app/core/services/page-info.service';

@Component({
  selector: 'app-ticketing-departemenoperator-list',
  templateUrl: './list.component.html'
})
export class TicketingDepartemenOperatorListComponent extends ListBaseComponent<TicketingDepartemenOperatorService, TicketingDepartemenOperatorModel, number> implements OnInit, OnDestroy {
  requestDepartemenId = 0;
  constructorInfoAreaId = this.constructor.name;
  constructor(
    public contentService: TicketingDepartemenOperatorService,
    private activatedRoute: ActivatedRoute,
    private cmsToastrService: CmsToastrService,
    private router: Router,
    public tokenHelper: TokenHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
    public pageInfo: PageInfoService,
    public publicHelper: PublicHelper,
    public dialog: MatDialog) {
    super(contentService, new TicketingDepartemenOperatorModel, publicHelper, tokenHelper, translate);
    this.publicHelper.processService.cdr = this.cdr;
    this.optionsSearch.parentMethods = {
      onSubmit: (model) => this.onSubmitOptionsSearch(model),
    };

    /*filter Sort*/
    this.filteModelContent.sortColumn = 'Id';
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
    // 'Title',
    'LinkSourceId',
    'CreatedDate',
    'UpdatedDate',
    // 'Action'
  ];
  tabledisplayedColumnsMobileSource: string[] = [
    'Id',
    'RecordStatus',
    // 'Title',
    'LinkSourceId',
    'CreatedDate',
    'UpdatedDate',
    // 'Action'
  ];



  expandedElement: TicketingDepartemenOperatorModel | null;
  cmsApiStoreSubscribe: Subscription;

  ngOnInit(): void {
    this.requestDepartemenId = + Number(this.activatedRoute.snapshot.paramMap.get('SourceId'));
    this.tokenHelper.getTokenInfoState().then((value) => {
      this.tokenInfo = value;
      this.DataGetAll();
    });

    this.cmsApiStoreSubscribe = this.tokenHelper.getTokenInfoStateOnChange().subscribe({
      next: (ret) => {
        this.tokenInfo = ret;
        this.firstLoadDataRunned = true;
        this.DataGetAll();
      }
    });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }

  DataGetAll(): void {
    this.tabledisplayedColumns = this.publicHelper.TableDisplayedColumns(this.tabledisplayedColumnsSource, this.tabledisplayedColumnsMobileSource, [], this.tokenInfo);

    if (this.requestDepartemenId === 0) {
      this.tabledisplayedColumns = this.publicHelper.listRemoveIfExist(
        this.tabledisplayedColumns,
        'LinkSourceId'
      );
    }
    this.tableRowsSelected = [];
    this.onActionTableRowSelect(new TicketingDepartemenOperatorModel());
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.get_information_list').subscribe((str: string) => { this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId); });
    this.filteModelContent.accessLoad = true;
    /*filter CLone*/
    const filterModel = JSON.parse(JSON.stringify(this.filteModelContent));
    /*filter CLone*/
    const filter = new FilterDataModel();
    if (this.requestDepartemenId > 0) {
      filter.propertyName = 'LinkSourceId';
      filter.value = this.requestDepartemenId;
      filterModel.filters.push(filter);
    }
    if (this.categoryModelSelected && this.categoryModelSelected.id > 0) {
      filter.propertyName = 'LinkSourceId';
      filter.value = this.categoryModelSelected.id;
      filterModel.filters.push(filter);
    }
    this.contentService.ServiceGetAllEditor(filterModel).subscribe({
      next: (ret) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
        if (ret.isSuccess) {
          this.dataModelResult = ret;
          this.tableSource.data = ret.listItems;

          if (this.optionsStatist?.data?.show)
            this.onActionButtonStatist(true);
          setTimeout(() => {
            if (this.optionsSearch.childMethods)
              this.optionsSearch.childMethods.setAccess(ret.access);
          }, 1000);
        }
        else {
          this.cmsToastrService.typeErrorGetAll(ret.errorMessage);

        }
        this.publicHelper.processService.processStop(pName);

      },
      error: (err) => {
        this.cmsToastrService.typeError(err);

        this.publicHelper.processService.processStop(pName);
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


  onActionButtonNewRow(): void {
    if (
      this.requestDepartemenId == null ||
      this.requestDepartemenId === 0
    ) {
      this.translate.get('MESSAGE.Content_not_selected').subscribe((str: string) => { this.cmsToastrService.typeErrorSelected(str); });

      return;
    }
    if (
      this.dataModelResult == null ||
      this.dataModelResult.access == null ||
      !this.dataModelResult.access.accessAddRow
    ) {
      this.cmsToastrService.typeErrorAccessAdd();
      return;
    }

    this.router.navigate(['/application/app/add/', this.requestDepartemenId]);

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
  onActionButtonEditRow(mode: TicketingDepartemenOperatorModel = this.tableRowSelected): void {
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
  onActionButtonDeleteRow(mode: TicketingDepartemenOperatorModel = this.tableRowSelected): void {
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
  onActionButtonStatist(view = !this.optionsStatist.data.show): void {
    this.optionsStatist.data.show = view;
    if (!this.optionsStatist.data.show) {
      return;
    }
    const statist = new Map<string, number>();
    this.translate.get('MESSAGE.Active').subscribe((str: string) => { statist.set(str, 0); });
    this.translate.get('MESSAGE.All').subscribe((str: string) => { statist.set(str, 0); });
    const pName = this.constructor.name + '.ServiceStatist';
    this.translate.get('MESSAGE.Get_the_statist').subscribe((str: string) => { this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId); });
    this.contentService.ServiceGetCount(this.filteModelContent).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          statist.set('All', ret.totalRowCount);
          this.optionsStatist.childMethods.setStatistValue(statist);
        }
        this.publicHelper.processService.processStop(pName);
      },
      error: (err) => {
        this.cmsToastrService.typeError(err);
        this.publicHelper.processService.processStop(pName);
      }
    }
    );

    const filterStatist1 = JSON.parse(JSON.stringify(this.filteModelContent));
    const fastfilter = new FilterDataModel();
    fastfilter.propertyName = 'RecordStatus';
    fastfilter.value = RecordStatusEnum.Available;
    filterStatist1.filters.push(fastfilter);
    this.contentService.ServiceGetCount(filterStatist1).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          statist.set('Active', ret.totalRowCount);
          this.optionsStatist.childMethods.setStatistValue(statist);
        }
        this.publicHelper.processService.processStop(pName);
      }
      ,
      error: (err) => {
        this.cmsToastrService.typeError(err);
        this.publicHelper.processService.processStop(pName);
      }
    }
    );

  }




  onActionButtonReload(): void {
    this.DataGetAll();
  }
  onSubmitOptionsSearch(model: any): void {
    this.filteModelContent.filters = model;
    this.DataGetAll();
  }

  onActionBackToParent(): void {
    this.router.navigate(['/ticketing/departeman/']);
  }

}
