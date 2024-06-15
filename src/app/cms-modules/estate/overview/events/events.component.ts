import {
  ChangeDetectorRef, Component,
  OnDestroy, OnInit
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  CoreUserModel,
  DataFieldInfoModel, ErrorExceptionResult,
  EstateAccountAgencyFilterModel,
  EstateAccountAgencyModel,
  EstateAccountAgencyService,
  EstateAccountUserFilterModel,
  EstateAccountUserModel,
  EstateAccountUserService,
  EstateCustomerOrderFilterModel,
  EstateCustomerOrderModel,
  EstateCustomerOrderService,
  EstatePropertyCompanyFilterModel,
  EstatePropertyCompanyModel,
  EstatePropertyCompanyService,
  EstatePropertyFilterModel,
  EstatePropertyHistoryFilterModel,
  EstatePropertyHistoryModel,
  EstatePropertyHistoryService,
  EstatePropertyModel,
  EstatePropertyProjectFilterModel,
  EstatePropertyProjectModel,
  EstatePropertyProjectService,
  EstatePropertyService, EstatePropertySupplierFilterModel, EstatePropertySupplierModel, EstatePropertySupplierService, FilterDataModel,
  RecordStatusEnum
} from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';

import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { environment } from 'src/environments/environment';
import { EstateCustomerOrderQuickViewComponent } from '../../customer-order/quick-view/quick-view.component';
import { EstatePropertyCompanyQuickViewComponent } from '../../property-company/quick-view/quick-view.component';
import { EstatePropertyHistoryQuickViewComponent } from '../../property-history/quick-view/quick-view.component';
import { EstatePropertyProjectQuickViewComponent } from '../../property-project/quick-view/quick-view.component';
import { EstatePropertySupplierQuickViewComponent } from '../../property-supplier/quick-view/quick-view.component';
import { EstatePropertyQuickViewComponent } from '../../property/quick-view/quick-view.component';
@Component({
  selector: 'app-estate-overview-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EstateOverviewEventsComponent implements OnInit, OnDestroy {
  constructor(
    public estatePropertyService: EstatePropertyService,
    public estatePropertyHistoryService: EstatePropertyHistoryService,
    public estatePropertyCompanyService: EstatePropertyCompanyService,
    public estatePropertySupplierService: EstatePropertySupplierService,
    public estatePropertyProjectService: EstatePropertyProjectService,
    public estateCustomerOrderService: EstateCustomerOrderService,
    public estateAccountUserService: EstateAccountUserService,
    public estateAccountAgencyService: EstateAccountAgencyService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    private cmsToastrService: CmsToastrService,
    private router: Router,
    public dialog: MatDialog,
    public translate: TranslateService,
    public tokenHelper: TokenHelper,

  ) {
    this.loading.cdr = this.cdr;
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => { this.loading.message = str; });


    this.filterChildrecordStatus = new FilterDataModel();
    this.filterChildrecordStatus.propertyName = 'recordStatus';
    this.filterChildrecordStatus.value = RecordStatusEnum.Available;

  }
  filterChildrecordStatus: FilterDataModel;
  loading = new ProgressSpinnerModel();
  dataModelPropertyResult: ErrorExceptionResult<EstatePropertyModel> = new ErrorExceptionResult<EstatePropertyModel>();
  dataModelCustomerOrderResult: ErrorExceptionResult<EstateCustomerOrderModel> = new ErrorExceptionResult<EstateCustomerOrderModel>();
  dataModelHistoryResult: ErrorExceptionResult<EstatePropertyHistoryModel> = new ErrorExceptionResult<EstatePropertyHistoryModel>();
  dataModelAccountUserResult: ErrorExceptionResult<EstateAccountUserModel> = new ErrorExceptionResult<EstateAccountUserModel>();
  dataModelAccountAgencyResult: ErrorExceptionResult<EstateAccountAgencyModel> = new ErrorExceptionResult<EstateAccountAgencyModel>();
  dataModelPropertyCompanyResult: ErrorExceptionResult<EstatePropertyCompanyModel> = new ErrorExceptionResult<EstatePropertyCompanyModel>();
  dataModelPropertySupplierResult: ErrorExceptionResult<EstatePropertySupplierModel> = new ErrorExceptionResult<EstatePropertySupplierModel>();
  dataModelPropertyProjectResult: ErrorExceptionResult<EstatePropertyProjectModel> = new ErrorExceptionResult<EstatePropertyProjectModel>();
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  cmsApiStoreSubscribe: Subscription;
  checkingOnDayRange = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
   todayStart = new Date(new Date().setHours(0, 0, 0, 0))
 todayEnd = new Date(new Date().setHours(23, 59, 59, 999))
  ngOnInit(): void {
    if (!this.checkingOnDayRange.controls.start?.value)
      this.checkingOnDayRange.controls.start.setValue(this.todayStart);
    if (!this.checkingOnDayRange.controls.end?.value)
      this.checkingOnDayRange.controls.end.setValue(this.todayEnd);

    var lStorlinkCmsUserId = this.publicHelper.getComponentLocalStorageMap(this.constructor.name, 'linkCmsUserId');
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {
      this.linkCmsUserId = next.userId;
      if (Number.isFinite(lStorlinkCmsUserId) && +lStorlinkCmsUserId >= 0)
        this.linkCmsUserId = +lStorlinkCmsUserId;
      this.onActionButtonOnDateSearch();
      //this.singlarService.login(next.token);
    });
    if (this.tokenHelper?.tokenInfo?.userId > 0) {
      this.linkCmsUserId = this.tokenHelper.tokenInfo.userId
      //this.singlarService.login(this.tokenHelper.tokenInfo.token);
    }
    if (Number.isFinite(lStorlinkCmsUserId) && +lStorlinkCmsUserId >= 0)
      this.linkCmsUserId = +lStorlinkCmsUserId;


    this.onActionButtonOnDateSearch();
  }
  DataGetAllProperty(): void {
    const pName = this.constructor.name + 'DataGetAllProperty';

    let filterModelOnDay = new EstatePropertyFilterModel();
    // filterModelOnDay = filterModel;
    if (!this.checkingOnDayRange.controls.start?.value)
      this.checkingOnDayRange.controls.start.setValue(this.todayStart);
    if (!this.checkingOnDayRange.controls.end?.value)
      this.checkingOnDayRange.controls.end.setValue(this.todayEnd);
    filterModelOnDay.onDateTimeFrom = this.checkingOnDayRange.controls.start.value;
    filterModelOnDay.onDateTimeTo = this.checkingOnDayRange.controls.end.value;
    filterModelOnDay.countLoad = true;
    if(this.linkCmsUserId>0)
    filterModelOnDay.linkResponsibleUserId = this.linkCmsUserId;
    filterModelOnDay.filters.push(this.filterChildrecordStatus);
    this.loading.Start(pName);
    /** Search On Select Day */
    this.estatePropertyService.ServiceGetAll(filterModelOnDay).subscribe({
      next: (ret) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
        if (ret.isSuccess) {
          this.dataModelPropertyResult = ret;
          this.loading.Stop(pName);
        }
        error: (er) => {
          this.cmsToastrService.typeError(er);
          this.loading.Stop(pName);
        }
      }
    }
    );
  }
  DataGetAllCustomerOrder(): void {
    const pName = this.constructor.name + 'DataGetAllCustomerOrder';
    let filterModelOnDay = new EstateCustomerOrderFilterModel();
    // filterModelOnDay = filterModel;
    if (!this.checkingOnDayRange.controls.start?.value)
      this.checkingOnDayRange.controls.start.setValue(this.todayStart);
    if (!this.checkingOnDayRange.controls.end?.value)
      this.checkingOnDayRange.controls.end.setValue(this.todayEnd);
    filterModelOnDay.onDateTimeFrom = this.checkingOnDayRange.controls.start.value;
    filterModelOnDay.onDateTimeTo = this.checkingOnDayRange.controls.end.value;
    filterModelOnDay.countLoad = true;
    if(this.linkCmsUserId>0)
    filterModelOnDay.linkResponsibleUserId = this.linkCmsUserId;
    filterModelOnDay.filters.push(this.filterChildrecordStatus);
    this.loading.Start(pName);
    /** Search On Select Day */
    this.estateCustomerOrderService.ServiceGetAll(filterModelOnDay).subscribe({
      next: (ret) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
        if (ret.isSuccess) {
          this.dataModelCustomerOrderResult = ret;
          this.loading.Stop(pName);
        }
        error: (er) => {
          this.cmsToastrService.typeError(er);
          this.loading.Stop(pName);
        }
      }
    }
    );
  }
  DataGetAllPropertyHistory(): void {
    const pName = this.constructor.name + 'DataGetAllPropertyHistory';

    let filterModelOnDay = new EstatePropertyHistoryFilterModel();
    // filterModelOnDay = filterModel;
    if (!this.checkingOnDayRange.controls.start?.value)
      this.checkingOnDayRange.controls.start.setValue(this.todayStart);
    if (!this.checkingOnDayRange.controls.end?.value)
      this.checkingOnDayRange.controls.end.setValue(this.todayEnd);
    filterModelOnDay.onDateTimeFrom = this.checkingOnDayRange.controls.start.value;
    filterModelOnDay.onDateTimeTo = this.checkingOnDayRange.controls.end.value;
    filterModelOnDay.countLoad = true;
    if(this.linkCmsUserId>0)
    filterModelOnDay.linkResponsibleUserId = this.linkCmsUserId;
    filterModelOnDay.filters.push(this.filterChildrecordStatus);
    this.loading.Start(pName);
    /** Search On Select Day */
    this.estatePropertyHistoryService.ServiceGetAll(filterModelOnDay).subscribe({
      next: (ret) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
        if (ret.isSuccess) {
          this.dataModelHistoryResult = ret;
          this.loading.Stop(pName);
        }
        error: (er) => {
          this.cmsToastrService.typeError(er);
          this.loading.Stop(pName);
        }
      }
    }
    );
  }
  DataGetAllPropertyCompany(): void {
    const pName = this.constructor.name + 'DataGetAllPropertyCompany';

    let filterModelOnDay = new EstatePropertyCompanyFilterModel();
    // filterModelOnDay = filterModel;
    if (!this.checkingOnDayRange.controls.start?.value)
      this.checkingOnDayRange.controls.start.setValue(this.todayStart);
    if (!this.checkingOnDayRange.controls.end?.value)
      this.checkingOnDayRange.controls.end.setValue(this.todayEnd);
    filterModelOnDay.onDateTimeFrom = this.checkingOnDayRange.controls.start.value;
    filterModelOnDay.onDateTimeTo = this.checkingOnDayRange.controls.end.value;
    filterModelOnDay.countLoad = true;
    if(this.linkCmsUserId>0)
    filterModelOnDay.linkResponsibleUserId = this.linkCmsUserId;
    filterModelOnDay.filters.push(this.filterChildrecordStatus);
    this.loading.Start(pName);
    /** Search On Select Day */
    this.estatePropertyCompanyService.ServiceGetAll(filterModelOnDay).subscribe({
      next: (ret) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
        if (ret.isSuccess) {
          this.dataModelPropertyCompanyResult = ret;
          this.loading.Stop(pName);
        }
        error: (er) => {
          this.cmsToastrService.typeError(er);
          this.loading.Stop(pName);
        }
      }
    }
    );
  }
  DataGetAllPropertySupplier(): void {
    const pName = this.constructor.name + 'DataGetAllPropertySupplier';

    let filterModelOnDay = new EstatePropertySupplierFilterModel();
    // filterModelOnDay = filterModel;
    if (!this.checkingOnDayRange.controls.start?.value)
      this.checkingOnDayRange.controls.start.setValue(this.todayStart);
    if (!this.checkingOnDayRange.controls.end?.value)
      this.checkingOnDayRange.controls.end.setValue(this.todayEnd);
    filterModelOnDay.onDateTimeFrom = this.checkingOnDayRange.controls.start.value;
    filterModelOnDay.onDateTimeTo = this.checkingOnDayRange.controls.end.value;
    filterModelOnDay.countLoad = true;
    if(this.linkCmsUserId>0)
    filterModelOnDay.linkResponsibleUserId = this.linkCmsUserId;
    filterModelOnDay.filters.push(this.filterChildrecordStatus);
    this.loading.Start(pName);
    /** Search On Select Day */
    this.estatePropertySupplierService.ServiceGetAll(filterModelOnDay).subscribe({
      next: (ret) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
        if (ret.isSuccess) {
          this.dataModelPropertySupplierResult = ret;
          this.loading.Stop(pName);
        }
        error: (er) => {
          this.cmsToastrService.typeError(er);
          this.loading.Stop(pName);
        }
      }
    }
    );
  }
  DataGetAllPropertyProject(): void {
    const pName = this.constructor.name + 'DataGetAllPropertyProject';

    let filterModelOnDay = new EstatePropertyProjectFilterModel();
    // filterModelOnDay = filterModel;
    if (!this.checkingOnDayRange.controls.start?.value)
      this.checkingOnDayRange.controls.start.setValue(this.todayStart);
    if (!this.checkingOnDayRange.controls.end?.value)
      this.checkingOnDayRange.controls.end.setValue(this.todayEnd);
    filterModelOnDay.onDateTimeFrom = this.checkingOnDayRange.controls.start.value;
    filterModelOnDay.onDateTimeTo = this.checkingOnDayRange.controls.end.value;
    filterModelOnDay.countLoad = true;
    if(this.linkCmsUserId>0)
    filterModelOnDay.linkResponsibleUserId = this.linkCmsUserId;
    filterModelOnDay.filters.push(this.filterChildrecordStatus);
    this.loading.Start(pName);
    /** Search On Select Day */
    this.estatePropertyProjectService.ServiceGetAll(filterModelOnDay).subscribe({
      next: (ret) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
        if (ret.isSuccess) {
          this.dataModelPropertyProjectResult = ret;
          this.loading.Stop(pName);
        }
        error: (er) => {
          this.cmsToastrService.typeError(er);
          this.loading.Stop(pName);
        }
      }
    }
    );
  }
  DataGetAllAccountUser(): void {
    const pName = this.constructor.name + 'DataGetAllAccountUser';

    let filterModelOnDay = new EstateAccountUserFilterModel();
    // filterModelOnDay = filterModel;
    if (!this.checkingOnDayRange.controls.start?.value)
      this.checkingOnDayRange.controls.start.setValue(this.todayStart);
    if (!this.checkingOnDayRange.controls.end?.value)
      this.checkingOnDayRange.controls.end.setValue(this.todayEnd);
    filterModelOnDay.onDateTimeFrom = this.checkingOnDayRange.controls.start.value;
    filterModelOnDay.onDateTimeTo = this.checkingOnDayRange.controls.end.value;
    filterModelOnDay.countLoad = true;
    if(this.linkCmsUserId>0)
    filterModelOnDay.linkResponsibleUserId = this.linkCmsUserId;
    filterModelOnDay.filters.push(this.filterChildrecordStatus);
    this.loading.Start(pName);
    /** Search On Select Day */
    this.estateAccountUserService.ServiceGetAll(filterModelOnDay).subscribe({
      next: (ret) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
        if (ret.isSuccess) {
          this.dataModelAccountUserResult = ret;
          this.loading.Stop(pName);
        }
        error: (er) => {
          this.cmsToastrService.typeError(er);
          this.loading.Stop(pName);
        }
      }
    }
    );
  }

  DataGetAllAccountAgency(): void {
    const pName = this.constructor.name + 'DataGetAllAccountAgency';

    let filterModelOnDay = new EstateAccountAgencyFilterModel();
    // filterModelOnDay = filterModel;
    if (!this.checkingOnDayRange.controls.start?.value)
      this.checkingOnDayRange.controls.start.setValue(this.todayStart);
    if (!this.checkingOnDayRange.controls.end?.value)
      this.checkingOnDayRange.controls.end.setValue(this.todayEnd);
    filterModelOnDay.onDateTimeFrom = this.checkingOnDayRange.controls.start.value;
    filterModelOnDay.onDateTimeTo = this.checkingOnDayRange.controls.end.value;
    filterModelOnDay.countLoad = true;
    if(this.linkCmsUserId>0)
    filterModelOnDay.linkResponsibleUserId = this.linkCmsUserId;
    filterModelOnDay.filters.push(this.filterChildrecordStatus);
    this.loading.Start(pName);
    /** Search On Select Day */
    this.estateAccountAgencyService.ServiceGetAll(filterModelOnDay).subscribe({
      next: (ret) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
        if (ret.isSuccess) {
          this.dataModelAccountAgencyResult = ret;
          this.loading.Stop(pName);
        }
        error: (er) => {
          this.cmsToastrService.typeError(er);
          this.loading.Stop(pName);
        }
      }
    }
    );
  }

  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  viewOnlyTime = false;
  onActionButtonOnDateSearch() {
    this.viewOnlyTime = false;
    if (this.checkingOnDayRange.controls.start?.value &&
      this.checkingOnDayRange.controls.end?.value &&
      this.checkingOnDayRange.controls.start.value?.toISOString() === this.checkingOnDayRange.controls.end.value?.toISOString())
      this.viewOnlyTime = true;
    this.DataGetAllProperty();
    this.DataGetAllCustomerOrder();
    this.DataGetAllPropertyHistory();
    this.DataGetAllAccountUser();
    this.DataGetAllAccountAgency();
    this.DataGetAllPropertyCompany();
    this.DataGetAllPropertySupplier();
    this.DataGetAllPropertyProject();

  }
  linkCmsUserId = 0;
  onActionSelectorUser(model: CoreUserModel | null): void {
    this.linkCmsUserId = 0;
    if (model && model.id > 0) {
      this.linkCmsUserId = model.id;
    }
    this.publicHelper.setComponentLocalStorageMap(this.constructor.name, 'linkCmsUserId', this.linkCmsUserId);
    this.onActionButtonOnDateSearch();
  }
  onActionToDay() {
    this.checkingOnDayRange.controls.start.setValue(this.todayStart);
    this.checkingOnDayRange.controls.end.setValue(this.todayEnd);
    this.onActionButtonOnDateSearch();
  }
  onActionNext() {
    if (!this.checkingOnDayRange.controls.start?.value)
      this.checkingOnDayRange.controls.start.setValue(this.todayStart);
    if (!this.checkingOnDayRange.controls.end?.value)
      this.checkingOnDayRange.controls.end.setValue(this.todayEnd);
    this.checkingOnDayRange.controls.start.setValue(this.addDays(this.checkingOnDayRange.controls.start.value, 1));
    this.checkingOnDayRange.controls.end.setValue(this.addDays(this.checkingOnDayRange.controls.end.value, 1));
    this.onActionButtonOnDateSearch();
  }
  onActionPervious() {
    if (!this.checkingOnDayRange.controls.start?.value)
      this.checkingOnDayRange.controls.start.setValue(this.todayStart);
    if (!this.checkingOnDayRange.controls.end?.value)
      this.checkingOnDayRange.controls.end.setValue(this.todayEnd);
    this.checkingOnDayRange.controls.start.setValue(this.addDays(this.checkingOnDayRange.controls.start.value, -1));
    this.checkingOnDayRange.controls.end.setValue(this.addDays(this.checkingOnDayRange.controls.end.value, -1));
    this.onActionButtonOnDateSearch();
  }
  addDays(date: Date, days: number): Date {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };
  onActionButtonProperty(model: EstatePropertyModel, event?: MouseEvent): void {
    if (!model || !model.id || model.id.length === 0) {
      this.translate.get('MESSAGE.no_row_selected_to_display').subscribe((str: string) => { this.cmsToastrService.typeErrorSelected(str); });
      return;
    }
    var nextItem = this.publicHelper.InfoNextRowInList(this.dataModelPropertyResult.listItems, model);
    var perviousItem = this.publicHelper.InfoPerviousRowInList(this.dataModelPropertyResult.listItems, model);
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
      data: {
        id: model.id,
        perviousItem: perviousItem,
        nextItem: nextItem
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate && result.onActionOpenItem && result.onActionOpenItem.id.length > 0) {
        this.onActionButtonProperty(result.onActionOpenItem)
      }
    });
  }
  onActionButtonCustomerOrder(model: EstateCustomerOrderModel, event?: MouseEvent): void {
    if (!model || !model.id || model.id.length === 0) {
      this.translate.get('MESSAGE.no_row_selected_to_display').subscribe((str: string) => { this.cmsToastrService.typeErrorSelected(str); });
      return;
    }

    var nextItem = this.publicHelper.InfoNextRowInList(this.dataModelCustomerOrderResult.listItems, model);
    var perviousItem = this.publicHelper.InfoPerviousRowInList(this.dataModelCustomerOrderResult.listItems, model);
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
      data: {
        id: model.id,
        perviousItem: perviousItem,
        nextItem: nextItem
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate && result.onActionOpenItem && result.onActionOpenItem.id.length > 0) {
        this.onActionButtonCustomerOrder(result.onActionOpenItem)
      }
    });
  }

  onActionButtonHistory(model: EstatePropertyHistoryModel, event?: MouseEvent): void {
    if (!model || !model.id || model.id.length === 0) {
      this.translate.get('MESSAGE.no_row_selected_to_display').subscribe((str: string) => { this.cmsToastrService.typeErrorSelected(str); });
      return;
    }

    var nextItem = this.publicHelper.InfoNextRowInList(this.dataModelHistoryResult.listItems, model);
    var perviousItem = this.publicHelper.InfoPerviousRowInList(this.dataModelHistoryResult.listItems, model);
    var panelClass = '';
    if (this.tokenHelper.isMobile)
      panelClass = 'dialog-fullscreen';
    else
      panelClass = 'dialog-min';
    const dialogRef = this.dialog.open(EstatePropertyHistoryQuickViewComponent, {
      height: '90%',
      panelClass: panelClass,
      enterAnimationDuration: environment.cmsViewConfig.enterAnimationDuration,
      exitAnimationDuration: environment.cmsViewConfig.exitAnimationDuration,
      data: {
        id: model.id,
        perviousItem: perviousItem,
        nextItem: nextItem
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate && result.onActionOpenItem && result.onActionOpenItem.id.length > 0) {
        this.onActionButtonHistory(result.onActionOpenItem)
      }
    });
  }
  onActionButtonAccountAgency(model: EstateAccountAgencyModel, event?: MouseEvent): void {
    if (!model || !model.id || model.id.length === 0) {
      this.translate.get('MESSAGE.no_row_selected_to_display').subscribe((str: string) => { this.cmsToastrService.typeErrorSelected(str); });
      return;
    }

    if (event?.ctrlKey) {
      var link = "/#/estate/account-agency/LinkCustomerOrderId/" + model.id;
      window.open(link, "_blank");
    } else {
      this.router.navigate(['/estate/account-agency/LinkCustomerOrderId/', model.id]);
    }
  }
  onActionButtonAccountUser(model: EstateAccountUserModel, event?: MouseEvent): void {
    if (!model || !model.id || model.id.length === 0) {
      this.translate.get('MESSAGE.no_row_selected_to_display').subscribe((str: string) => { this.cmsToastrService.typeErrorSelected(str); });
      return;
    }

    if (event?.ctrlKey) {
      var link = "/#/estate/account-user/LinkCustomerOrderId/" + model.id;
      window.open(link, "_blank");
    } else {
      this.router.navigate(['/estate/account-user/LinkCustomerOrderId/', model.id]);
    }
  }

  onActionButtonPropertyProject(model: EstatePropertyProjectModel, event?: MouseEvent): void {
    if (!model || !model.id || model.id.length === 0) {
      this.translate.get('MESSAGE.no_row_selected_to_display').subscribe((str: string) => { this.cmsToastrService.typeErrorSelected(str); });
      return;
    }

    var nextItem = this.publicHelper.InfoNextRowInList(this.dataModelCustomerOrderResult.listItems, model);
    var perviousItem = this.publicHelper.InfoPerviousRowInList(this.dataModelCustomerOrderResult.listItems, model);
    var panelClass = '';
    if (this.tokenHelper.isMobile)
      panelClass = 'dialog-fullscreen';
    else
      panelClass = 'dialog-min';
    const dialogRef = this.dialog.open(EstatePropertyProjectQuickViewComponent, {
      height: '90%',
      panelClass: panelClass,
      enterAnimationDuration: environment.cmsViewConfig.enterAnimationDuration,
      exitAnimationDuration: environment.cmsViewConfig.exitAnimationDuration,
      data: {
        id: model.id,
        perviousItem: perviousItem,
        nextItem: nextItem
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate && result.onActionOpenItem && result.onActionOpenItem.id.length > 0) {
        this.onActionButtonPropertyProject(result.onActionOpenItem)
      }
    });
  }
  onActionButtonPropertySupplier(model: EstatePropertySupplierModel, event?: MouseEvent): void {
    if (!model || !model.id || model.id.length === 0) {
      this.translate.get('MESSAGE.no_row_selected_to_display').subscribe((str: string) => { this.cmsToastrService.typeErrorSelected(str); });
      return;
    }

    var nextItem = this.publicHelper.InfoNextRowInList(this.dataModelCustomerOrderResult.listItems, model);
    var perviousItem = this.publicHelper.InfoPerviousRowInList(this.dataModelCustomerOrderResult.listItems, model);
    var panelClass = '';
    if (this.tokenHelper.isMobile)
      panelClass = 'dialog-fullscreen';
    else
      panelClass = 'dialog-min';
    const dialogRef = this.dialog.open(EstatePropertySupplierQuickViewComponent, {
      height: '90%',
      panelClass: panelClass,
      enterAnimationDuration: environment.cmsViewConfig.enterAnimationDuration,
      exitAnimationDuration: environment.cmsViewConfig.exitAnimationDuration,
      data: {
        id: model.id,
        perviousItem: perviousItem,
        nextItem: nextItem
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate && result.onActionOpenItem && result.onActionOpenItem.id.length > 0) {
        this.onActionButtonPropertySupplier(result.onActionOpenItem)
      }
    });
  }
  onActionButtonPropertyCompany(model: EstatePropertyCompanyModel, event?: MouseEvent): void {
    if (!model || !model.id || model.id.length === 0) {
      this.translate.get('MESSAGE.no_row_selected_to_display').subscribe((str: string) => { this.cmsToastrService.typeErrorSelected(str); });
      return;
    }

    var nextItem = this.publicHelper.InfoNextRowInList(this.dataModelCustomerOrderResult.listItems, model);
    var perviousItem = this.publicHelper.InfoPerviousRowInList(this.dataModelCustomerOrderResult.listItems, model);
    var panelClass = '';
    if (this.tokenHelper.isMobile)
      panelClass = 'dialog-fullscreen';
    else
      panelClass = 'dialog-min';
    const dialogRef = this.dialog.open(EstatePropertyCompanyQuickViewComponent, {
      height: '90%',
      panelClass: panelClass,
      enterAnimationDuration: environment.cmsViewConfig.enterAnimationDuration,
      exitAnimationDuration: environment.cmsViewConfig.exitAnimationDuration,
      data: {
        id: model.id,
        perviousItem: perviousItem,
        nextItem: nextItem
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate && result.onActionOpenItem && result.onActionOpenItem.id.length > 0) {
        this.onActionButtonPropertyCompany(result.onActionOpenItem)
      }
    });

  }
}
