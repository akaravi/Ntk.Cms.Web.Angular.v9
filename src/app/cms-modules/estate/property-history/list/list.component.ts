import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  ErrorExceptionResult,
  EstateActivityTypeModel,
  EstateActivityTypeService,
  EstateEnumService,
  EstatePropertyHistoryFilterModel,
  EstatePropertyHistoryModel,
  EstatePropertyHistoryService,
  FilterDataModel,
  FilterModel,
  InfoEnumModel,
  RecordStatusEnum,
  SortTypeEnum
} from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { ListBaseComponent } from 'src/app/core/cmsComponent/listBaseComponent';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { PageInfoService } from 'src/app/core/services/page-info.service';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { environment } from 'src/environments/environment';
import { EstateCustomerOrderQuickViewComponent } from '../../customer-order/quick-view/quick-view.component';
import { EstatePropertyQuickViewComponent } from '../../property/quick-view/quick-view.component';
import { EstatePropertyHistoryAddComponent } from '../add/add.component';
import { EstatePropertyHistoryAddMobileComponent } from '../add/add.mobile.component';
import { EstatePropertyHistoryEditComponent } from '../edit/edit.component';
import { EstatePropertyHistoryEditMobileComponent } from '../edit/edit.mobile.component';
import { EstatePropertyHistoryQuickViewComponent } from '../quick-view/quick-view.component';
@Component({
  selector: 'app-estate-property-history-list',
  templateUrl: './list.component.html',
})
export class EstatePropertyHistoryListComponent extends ListBaseComponent<EstatePropertyHistoryService, EstatePropertyHistoryModel, string> implements OnInit, OnDestroy {
  requestLinkPropertyId = '';
  requestLinkEstateUserId = '';
  requestLinkCustomerOrderId = '';
  requestLinkEstateAgencyId = '';

  constructor(
    public contentService: EstatePropertyHistoryService,
    private cmsConfirmationDialogService: CmsConfirmationDialogService,
    private cmsToastrService: CmsToastrService,
    private estateActivityTypeService: EstateActivityTypeService,
    public estateEnumService: EstateEnumService,
    public tokenHelper: TokenHelper,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
    public pageInfo: PageInfoService,
    public publicHelper: PublicHelper,
    public dialog: MatDialog,
  ) {
    super(contentService, new EstatePropertyHistoryModel(), publicHelper, tokenHelper, translate);

    pageInfo.updateContentService(contentService);
    this.publicHelper.processService.cdr = this.cdr;
    this.loading.message = this.translate.instant(
      'MESSAGE.Receiving_information'
    );
    this.requestLinkPropertyId =
      this.activatedRoute.snapshot.paramMap.get('LinkPropertyId');
    this.requestLinkEstateUserId =
      this.activatedRoute.snapshot.paramMap.get('LinkEstateUserId');
    this.requestLinkCustomerOrderId = this.activatedRoute.snapshot.paramMap.get(
      'LinkCustomerOrderId'
    );
    this.requestLinkEstateAgencyId =
      this.activatedRoute.snapshot.paramMap.get('LinkEstateAgencyId');
    this.popupAdd =
      this.activatedRoute.snapshot.paramMap.get('Action')?.toLowerCase() ===
      'add';
    /**recordStatus */
    this.requestRecordStatus =
      RecordStatusEnum[
      this.activatedRoute.snapshot.paramMap.get('RecordStatus') + ''
      ];
    if (this.requestRecordStatus) {
      this.optionsSearch.data.show = true;
      this.optionsSearch.data.defaultQuery =
        '{"condition":"and","rules":[{"field":"RecordStatus","type":"select","operator":"equal","value":"' +
        this.requestRecordStatus +
        '"}]}';
      this.requestRecordStatus = null;
    }
    /**recordStatus */
    this.optionsSearch.parentMethods = {
      onSubmit: (model) => this.onSubmitOptionsSearch(model),
    };
    if (this.activatedRoute.snapshot.paramMap.get('InCheckingOnDay')) {
      this.searchInCheckingOnDay =
        this.activatedRoute.snapshot.paramMap.get('InCheckingOnDay') === 'true';
    }
    /*filter Sort*/
    this.filteModelContent.sortColumn = 'CreatedDate';
    this.filteModelContent.sortType = SortTypeEnum.Descending;
  }
  @Input() optionloadComponent = true;
  @Input() optionloadByRoute = true;
  @Input() set optionLinkCustomerOrderId(id: string) {
    if (id && id.length > 0) {
      this.requestLinkCustomerOrderId = id;
    }
  }
  @Input() set optionLinkPropertyId(id: string) {
    if (id && id.length > 0) {
      this.requestLinkPropertyId = id;
    }
  }

  popupAdd = false;
  comment: string;
  author: string;
  dataSource: any;
  flag = false;
  tableContentSelected = [];

  filteModelContent = new FilterModel();
  dataModelActivityTypeResult: ErrorExceptionResult<EstateActivityTypeModel> =
    new ErrorExceptionResult<EstateActivityTypeModel>();


  categoryModelSelected: EstateActivityTypeModel;
  searchInCheckingOnDay = false;
  searchInCheckingOnDayChecked = false;

  tabledisplayedColumns: string[] = [];
  tabledisplayedColumnsSource: string[] = [
    'Id',
    'RecordStatus',
    // 'Title',
    'CreatedDate',
    'AppointmentDateFrom',
    'AppointmentDateTo',
    'LinkActivityTypeId',
    'ActivityStatus',
    'QuickView',
    'action_menu',
  ];
  tabledisplayedColumnsMobileSource: string[] = [
    'Id',
    'RecordStatus',
    // 'Title',
    'CreatedDate',
    // 'AppointmentDateFrom',
    // 'AppointmentDateTo',
    // 'LinkActivityTypeId',
    'ActivityStatus',
    'QuickView',
    'action_menu',
  ];


  dataModelEstateActivityStatusEnumResult: ErrorExceptionResult<InfoEnumModel> =
    new ErrorExceptionResult<InfoEnumModel>();

  expandedElement: EstatePropertyHistoryModel | null;
  cmsApiStoreSubscribe: Subscription;

  ngOnInit(): void {
    this.filteModelContent.sortColumn = 'CreatedDate';
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
      this.DataGetAll();
    });

    this.cmsApiStoreSubscribe = this.tokenHelper
      .getCurrentTokenOnChange()
      .subscribe({
        next: (ret) => {
          this.tokenInfo = ret;
          this.DataGetAll();
        }
      });
    this.getEstateActivityStatusEnum();
    this.getActivityTypeList();
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  ngAfterViewInit(): void {
    if (this.searchInCheckingOnDay) {
      this.searchInCheckingOnDayChecked = true;
    }
  }
  getEstateActivityStatusEnum(): void {
    this.estateEnumService
      .ServiceEstateActivityStatusEnum()
      .subscribe({
        next: (ret) => {
          this.dataModelEstateActivityStatusEnumResult = ret;
        }
      });
  }
  getActivityTypeList(): void {
    const filter = new FilterModel();
    filter.rowPerPage = 100;
    this.estateActivityTypeService
      .ServiceGetAllEditor(filter)
      .subscribe({
        next: (ret) => {
          this.dataModelActivityTypeResult = ret;
        }
      });
  }
  checkingOnDayRange = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  DataGetAll(): void {
    this.tabledisplayedColumns =
      this.publicHelper.TableDisplayedColumns(this.tabledisplayedColumnsSource, this.tabledisplayedColumnsMobileSource, [], this.tokenInfo);
    if (!this.optionloadComponent) {
      return;
    }

    this.tableRowsSelected = [];
    this.onActionTableRowSelect(new EstatePropertyHistoryModel());
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.get_information_list').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructor.name);
    });

    this.filteModelContent.accessLoad = true;
    /*filter CLone*/
    const filterModel = JSON.parse(JSON.stringify(this.filteModelContent));
    /*filter CLone*/

    if (this.requestLinkPropertyId && this.requestLinkPropertyId.length > 0) {
      const filter = new FilterDataModel();
      filter.propertyName = 'LinkPropertyId';
      filter.value = this.requestLinkPropertyId;
      filterModel.filters.push(filter);
    }
    if (
      this.requestLinkEstateUserId &&
      this.requestLinkEstateUserId.length > 0
    ) {
      const filter = new FilterDataModel();
      filter.propertyName = 'linkEstateUserId';
      filter.value = this.requestLinkEstateUserId;
      filterModel.filters.push(filter);
    }
    if (
      this.requestLinkCustomerOrderId &&
      this.requestLinkCustomerOrderId.length > 0
    ) {
      const filter = new FilterDataModel();
      filter.propertyName = 'linkCustomerOrderId';
      filter.value = this.requestLinkCustomerOrderId;
      filterModel.filters.push(filter);
    }
    if (
      this.requestLinkEstateAgencyId &&
      this.requestLinkEstateAgencyId.length > 0
    ) {
      const filter = new FilterDataModel();
      filter.propertyName = 'linkEstateAgencyId';
      filter.value = this.requestLinkEstateAgencyId;
      filterModel.filters.push(filter);
    }

    /** filter Category */
    if (
      this.categoryModelSelected &&
      this.categoryModelSelected.id.length > 0
    ) {
      const filterChild = new FilterDataModel();
      filterChild.propertyName = 'LinkActivityTypeId';
      filterChild.value = this.categoryModelSelected.id;
      filterModel.filters.push(filterChild);
    }
    /** filter Category */

    if (this.searchInCheckingOnDay) {
      // const CheckingOnDay = new Date();
      let filterModelOnDay = new EstatePropertyHistoryFilterModel();
      filterModelOnDay = filterModel;
      if (!this.checkingOnDayRange.controls.start?.value)
        this.checkingOnDayRange.controls.start.setValue(new Date());
      if (!this.checkingOnDayRange.controls.end?.value)
        this.checkingOnDayRange.controls.end.setValue(new Date());
      filterModelOnDay.onDateTimeFrom =
        this.checkingOnDayRange.controls.start.value;
      filterModelOnDay.onDateTimeTo =
        this.checkingOnDayRange.controls.end.value;

      /** Search On Select Day */
      this.contentService.ServiceGetAll(filterModelOnDay).subscribe({
        next: (ret) => {
          this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
          if (ret.isSuccess) {
            this.dataModelResult = ret;
            this.tableSource.data = ret.listItems;

            if (this.optionsStatist?.data?.show)
              this.onActionButtonStatist(true);
            if (this.optionsSearch.childMethods) {
              this.optionsSearch.childMethods.setAccess(ret.access);
            }
          } else {
            this.cmsToastrService.typeErrorMessage(ret.errorMessage);
          }
          this.publicHelper.processService.processStop(pName);
          if (this.popupAdd) {
            this.onActionButtonNewRow();
          }
        },
        error: (er) => {
          this.cmsToastrService.typeError(er);
          this.publicHelper.processService.processStop(pName, false);
        },
      });
      /** Search On Select Day */
    } else {
      this.contentService.ServiceGetAll(filterModel).subscribe({
        next: (ret) => {
          this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
          if (ret.isSuccess) {
            this.dataModelResult = ret;
            this.tableSource.data = ret.listItems;

            if (this.optionsStatist?.data?.show)
              this.onActionButtonStatist(true);
            if (this.optionsSearch.childMethods) {
              this.optionsSearch.childMethods.setAccess(ret.access);
            }
          } else {
            this.cmsToastrService.typeErrorMessage(ret.errorMessage);
          }
          this.publicHelper.processService.processStop(pName);
          if (this.popupAdd) {
            this.onActionButtonNewRow();
          }
        },
        error: (er) => {
          this.cmsToastrService.typeError(er);
          this.publicHelper.processService.processStop(pName, false);
        },
      });
    }
  }

  onTableSortData(sort: MatSort): void {
    if (
      this.tableSource &&
      this.tableSource.sort &&
      this.tableSource.sort.active === sort.active
    ) {
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
    // if (!this.popupAdd && (this.categoryModelSelected == null || this.categoryModelSelected.id.length === 0)) {
    //   const message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorCategoryNotSelected');
    //   this.cmsToastrService.typeErrorSelected(message);
    //   return;
    // }
    this.popupAdd = false;
    if (
      this.dataModelResult == null ||
      this.dataModelResult.access == null ||
      !this.dataModelResult.access.accessAddRow
    ) {
      this.cmsToastrService.typeErrorAccessAdd();
      return;
    }
    var panelClass = '';
    if (this.tokenHelper.isMobile)
      panelClass = 'dialog-fullscreen';
    else
      panelClass = 'dialog-min';
    if (this.publicHelper.isMobile) {
      const dialogRef = this.dialog.open(
        EstatePropertyHistoryAddMobileComponent,
        {
          height: '90%',
          panelClass: panelClass,
          enterAnimationDuration:
            environment.cmsViewConfig.enterAnimationDuration,
          exitAnimationDuration:
            environment.cmsViewConfig.exitAnimationDuration,
          data: {
            linkActivityTypeId: this.categoryModelSelected?.id,
            linkPropertyId: this.requestLinkPropertyId,
            linkEstateUserId: this.requestLinkEstateUserId,
            linkCustomerOrderId: this.requestLinkCustomerOrderId,
            linkEstateAgencyId: this.requestLinkEstateAgencyId,
          },
        }
      );
      dialogRef.afterClosed().subscribe((result) => {
        if (result && result.dialogChangedDate) {
          this.DataGetAll();
        }
      });
    } else {
      const dialogRef = this.dialog.open(EstatePropertyHistoryAddComponent, {
        height: '90%',
        panelClass: panelClass,
        enterAnimationDuration:
          environment.cmsViewConfig.enterAnimationDuration,
        exitAnimationDuration: environment.cmsViewConfig.exitAnimationDuration,
        data: {
          linkActivityTypeId: this.categoryModelSelected?.id,
          linkPropertyId: this.requestLinkPropertyId,
          linkEstateUserId: this.requestLinkEstateUserId,
          linkCustomerOrderId: this.requestLinkCustomerOrderId,
          linkEstateAgencyId: this.requestLinkEstateAgencyId,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result && result.dialogChangedDate) {
          this.DataGetAll();
        }
      });
    }
  }

  onActionButtonEditRow(
    model: EstatePropertyHistoryModel = this.tableRowSelected
  ): void {
    if (!model || !model.id || model.id.length === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    this.onActionTableRowSelect(model);
    if (
      this.dataModelResult == null ||
      this.dataModelResult.access == null ||
      !this.dataModelResult.access.accessEditRow
    ) {
      this.cmsToastrService.typeErrorAccessEdit();
      return;
    }
    var panelClass = '';
    if (this.tokenHelper.isMobile)
      panelClass = 'dialog-fullscreen';
    else
      panelClass = 'dialog-min';
    if (this.publicHelper.isMobile) {
      const dialogRef = this.dialog.open(
        EstatePropertyHistoryEditMobileComponent,
        {
          height: '90%',
          panelClass: panelClass,
          enterAnimationDuration:
            environment.cmsViewConfig.enterAnimationDuration,
          exitAnimationDuration:
            environment.cmsViewConfig.exitAnimationDuration,
          data: { id: this.tableRowSelected.id },
        }
      );
      dialogRef.afterClosed().subscribe((result) => {
        if (result && result.dialogChangedDate) {
          this.DataGetAll();
        }
      });
    } else {
      const dialogRef = this.dialog.open(EstatePropertyHistoryEditComponent, {
        height: '90%',
        panelClass: panelClass,
        enterAnimationDuration:
          environment.cmsViewConfig.enterAnimationDuration,
        exitAnimationDuration: environment.cmsViewConfig.exitAnimationDuration,
        data: { id: this.tableRowSelected.id },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result && result.dialogChangedDate) {
          this.DataGetAll();
        }
      });
    }
  }
  onActionButtonDeleteRow(
    model: EstatePropertyHistoryModel = this.tableRowSelected
  ): void {
    if (!model || !model.id || model.id.length === 0) {
      const emessage = this.translate.instant(
        'MESSAGE.no_row_selected_to_delete'
      );
      this.cmsToastrService.typeErrorSelected(emessage);
      return;
    }
    this.onActionTableRowSelect(model);

    if (
      this.dataModelResult == null ||
      this.dataModelResult.access == null ||
      !this.dataModelResult.access.accessDeleteRow
    ) {
      this.cmsToastrService.typeErrorAccessDelete();
      return;
    }



    var title = "";
    var message = "";
    this.translate.get(['MESSAGE.Please_Confirm', 'MESSAGE.Do_you_want_to_delete_this_content']).subscribe((str: string) => {
      title = str['MESSAGE.Please_Confirm'];
      message = str['MESSAGE.Do_you_want_to_delete_this_content'] + '?' + '<br> ( ' + this.tableRowSelected.title + ' ) ';
    });
    this.cmsConfirmationDialogService
      .confirm(title, message)
      .then((confirmed) => {
        if (confirmed) {
          const pName = this.constructor.name + 'main';
          this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
            this.publicHelper.processService.processStart(pName, str, this.constructor.name);
          });

          this.contentService
            .ServiceDelete(this.tableRowSelected.id)
            .subscribe({
              next: (ret) => {
                if (ret.isSuccess) {
                  this.cmsToastrService.typeSuccessRemove();
                  this.DataGetAll();
                } else {
                  this.cmsToastrService.typeErrorRemove();
                }
                this.publicHelper.processService.processStop(pName);
              },
              error: (er) => {
                this.cmsToastrService.typeError(er);
                this.publicHelper.processService.processStop(pName);
              },
            });
        }
      })
      .catch(() => {
        // console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)')
      });
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
    this.translate.get('MESSAGE.Get_the_statist').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructor.name);
    });

    this.contentService.ServiceGetCount(this.filteModelContent).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.translate.get('MESSAGE.All').subscribe((str: string) => { statist.set(str, ret.totalRowCount) });
          this.optionsStatist.childMethods.setStatistValue(statist);
        } else {
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.publicHelper.processService.processStop(pName);
      },
      error: (er) => {
        this.cmsToastrService.typeError(er);
        this.publicHelper.processService.processStop(pName, false);
      },
    });

    const filterStatist1 = JSON.parse(JSON.stringify(this.filteModelContent));
    const fastfilter = new FilterDataModel();
    fastfilter.propertyName = 'RecordStatus';
    fastfilter.value = RecordStatusEnum.Available;
    filterStatist1.filters.push(fastfilter);
    this.contentService.ServiceGetCount(filterStatist1).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          statist.set(
            this.translate.instant('MESSAGE.Active'),
            ret.totalRowCount
          );
          this.optionsStatist.childMethods.setStatistValue(statist);
        } else {
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.publicHelper.processService.processStop(pName);
      },
      error: (er) => {
        this.cmsToastrService.typeError(er);
        this.publicHelper.processService.processStop(pName, false);
      },
    });
  }



  onActionButtonPropertyQuickViewRow(id: any): void {
    if (!id || id.length === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }

    var panelClass = '';
    if (this.tokenHelper.isMobile)
      panelClass = 'dialog-fullscreen';
    else
      panelClass = 'dialog-min';
    const dialogRef = this.dialog.open(EstatePropertyQuickViewComponent, {
      height: '90%',
      panelClass: panelClass,
      enterAnimationDuration: environment.cmsViewConfig.enterAnimationDuration,
      exitAnimationDuration: environment.cmsViewConfig.exitAnimationDuration,
      data: { id: id },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.dialogChangedDate) {
      }
    });
  }



  onActionButtonQuickViewRow(model: EstatePropertyHistoryModel = this.tableRowSelected
  ): void {
    if (!model || !model.id || model.id.length === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    this.onActionTableRowSelect(model);
    this.tableRowSelected = model;
    if (
      this.dataModelResult == null ||
      this.dataModelResult.access == null ||
      !this.dataModelResult.access.accessWatchRow
    ) {
      this.cmsToastrService.typeErrorAccessWatch();
      return;
    }
    var nextItem = this.publicHelper.InfoNextRowInList(
      this.dataModelResult.listItems,
      this.tableRowSelected
    );
    var perviousItem = this.publicHelper.InfoPerviousRowInList(
      this.dataModelResult.listItems,
      this.tableRowSelected
    );
    var panelClass = '';
    if (this.tokenHelper.isMobile)
      panelClass = 'dialog-fullscreen';
    else
      panelClass = 'dialog-min';
    const dialogRef = this.dialog.open(
      EstatePropertyHistoryQuickViewComponent,
      {
        height: '90%',
        panelClass: panelClass,
        enterAnimationDuration:
          environment.cmsViewConfig.enterAnimationDuration,
        exitAnimationDuration: environment.cmsViewConfig.exitAnimationDuration,
        data: {
          id: this.tableRowSelected.id,
          perviousItem: perviousItem,
          nextItem: nextItem,
        },
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (
        result &&
        result.dialogChangedDate &&
        result.onActionOpenItem &&
        result.onActionOpenItem.id.length > 0
      ) {
        this.onActionButtonQuickViewRow(result.onActionOpenItem);
      }
    });
  }
  onActionButtonCustomerOrderQuickViewRow(id: any): void {
    if (!id || id.length === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }

    var panelClass = '';
    if (this.tokenHelper.isMobile)
      panelClass = 'dialog-fullscreen';
    else
      panelClass = 'dialog-min';
    const dialogRef = this.dialog.open(EstateCustomerOrderQuickViewComponent, {
      height: '90%',
      panelClass: panelClass,
      enterAnimationDuration: environment.cmsViewConfig.enterAnimationDuration,
      exitAnimationDuration: environment.cmsViewConfig.exitAnimationDuration,
      data: { id: id },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.dialogChangedDate) {
      }
    });
  }
  onActionSelectorSelect(model: EstateActivityTypeModel | null): void {
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
  onActionButtonReload(): void {
    this.optionloadComponent = true;
    this.DataGetAll();
  }
  onActionCopied(): void {
    this.cmsToastrService.typeSuccessCopedToClipboard();
  }
  onSubmitOptionsSearch(model: any): void {
    this.filteModelContent.filters = model;
    this.DataGetAll();
  }

  onActionButtonInCheckingOnDate(model: boolean): void {
    this.searchInCheckingOnDay = model;
    if (this.searchInCheckingOnDay) {
      if (!this.checkingOnDayRange.controls.start?.value)
        this.checkingOnDayRange.controls.start.setValue(new Date());
      if (!this.checkingOnDayRange.controls.end?.value)
        this.checkingOnDayRange.controls.end.setValue(new Date());
    } else {
      this.DataGetAll();
    }
  }
  onActionButtonInCheckingOnDateSearch() {
    if (this.searchInCheckingOnDay) this.DataGetAll();
  }
  onActionNext() {
    if (!this.checkingOnDayRange.controls.start?.value)
      this.checkingOnDayRange.controls.start.setValue(new Date());
    if (!this.checkingOnDayRange.controls.end?.value)
      this.checkingOnDayRange.controls.end.setValue(new Date());
    this.checkingOnDayRange.controls.start.setValue(
      this.addDays(this.checkingOnDayRange.controls.start.value, 1)
    );
    this.checkingOnDayRange.controls.end.setValue(
      this.addDays(this.checkingOnDayRange.controls.end.value, 1)
    );
  }
  onActionPervious() {
    if (!this.checkingOnDayRange.controls.start?.value)
      this.checkingOnDayRange.controls.start.setValue(new Date());
    if (!this.checkingOnDayRange.controls.end?.value)
      this.checkingOnDayRange.controls.end.setValue(new Date());
    this.checkingOnDayRange.controls.start.setValue(
      this.addDays(this.checkingOnDayRange.controls.start.value, -1)
    );
    this.checkingOnDayRange.controls.end.setValue(
      this.addDays(this.checkingOnDayRange.controls.end.value, -1)
    );
  }
  addDays(date: Date, days: number): Date {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}
