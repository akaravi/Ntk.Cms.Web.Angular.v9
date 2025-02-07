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
  EstateAccountExpertFilterModel,
  EstateAccountExpertModel,
  EstateAccountExpertService,
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
  FilterDataModelSearchTypesEnum,
  RecordStatusEnum
} from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';

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
    standalone: false
})
export class EstateOverviewEventsComponent implements OnInit, OnDestroy {
  constructorInfoAreaId = this.constructor.name;
  constructor(
    public estatePropertyService: EstatePropertyService,
    public estatePropertyHistoryService: EstatePropertyHistoryService,
    public estatePropertyCompanyService: EstatePropertyCompanyService,
    public estatePropertySupplierService: EstatePropertySupplierService,
    public estatePropertyProjectService: EstatePropertyProjectService,
    public estateCustomerOrderService: EstateCustomerOrderService,
    public estateAccountExpertService: EstateAccountExpertService,
    public estateAccountAgencyService: EstateAccountAgencyService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    private cmsToastrService: CmsToastrService,
    private router: Router,
    public dialog: MatDialog,
    public translate: TranslateService,
    public tokenHelper: TokenHelper,

  ) {
    this.publicHelper.processService.cdr = this.cdr;

    this.filterChildrecordStatus = new FilterDataModel();
    /** */
    this.filterChildrecordStatusAvailable = new FilterDataModel();
    this.filterChildrecordStatusAvailable.propertyName = 'recordStatus';
    this.filterChildrecordStatusAvailable.value = RecordStatusEnum.Available;
    this.filterChildrecordStatusAvailable.searchType = FilterDataModelSearchTypesEnum.Equal;
    /** */
    this.filterChildrecordStatusNotAvailable = new FilterDataModel();
    this.filterChildrecordStatusNotAvailable.propertyName = 'recordStatus';
    this.filterChildrecordStatusNotAvailable.value = RecordStatusEnum.Available;
    this.filterChildrecordStatusNotAvailable.searchType = FilterDataModelSearchTypesEnum.NotEqual;
  }
  filterChildrecordStatusAvailable: FilterDataModel;
  filterChildrecordStatusNotAvailable: FilterDataModel;
  filterChildrecordStatus: FilterDataModel;

  /** All*/
  dataModelPropertyResult: ErrorExceptionResult<EstatePropertyModel> = new ErrorExceptionResult<EstatePropertyModel>();
  dataModelCustomerOrderResult: ErrorExceptionResult<EstateCustomerOrderModel> = new ErrorExceptionResult<EstateCustomerOrderModel>();
  dataModelHistoryResult: ErrorExceptionResult<EstatePropertyHistoryModel> = new ErrorExceptionResult<EstatePropertyHistoryModel>();
  dataModelAccountUserResult: ErrorExceptionResult<EstateAccountExpertModel> = new ErrorExceptionResult<EstateAccountExpertModel>();
  dataModelAccountAgencyResult: ErrorExceptionResult<EstateAccountAgencyModel> = new ErrorExceptionResult<EstateAccountAgencyModel>();
  dataModelPropertyCompanyResult: ErrorExceptionResult<EstatePropertyCompanyModel> = new ErrorExceptionResult<EstatePropertyCompanyModel>();
  dataModelPropertySupplierResult: ErrorExceptionResult<EstatePropertySupplierModel> = new ErrorExceptionResult<EstatePropertySupplierModel>();
  dataModelPropertyProjectResult: ErrorExceptionResult<EstatePropertyProjectModel> = new ErrorExceptionResult<EstatePropertyProjectModel>();
  /** All*/
  /** Available*/
  dataModelPropertyResultAvailable: ErrorExceptionResult<EstatePropertyModel> = new ErrorExceptionResult<EstatePropertyModel>();
  dataModelCustomerOrderResultAvailable: ErrorExceptionResult<EstateCustomerOrderModel> = new ErrorExceptionResult<EstateCustomerOrderModel>();
  /** Available*/
  /** Not Available*/
  dataModelPropertyResultNotAvailable: ErrorExceptionResult<EstatePropertyModel> = new ErrorExceptionResult<EstatePropertyModel>();
  dataModelCustomerOrderResultNotAvailable: ErrorExceptionResult<EstateCustomerOrderModel> = new ErrorExceptionResult<EstateCustomerOrderModel>();
  /** Not Available*/
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
    this.cmsApiStoreSubscribe = this.tokenHelper.getTokenInfoStateOnChange().subscribe({
      next: (ret) => {
        this.linkCmsUserId = ret.userId;
        if (Number.isFinite(lStorlinkCmsUserId) && +lStorlinkCmsUserId >= 0)
          this.linkCmsUserId = +lStorlinkCmsUserId;
        this.onActionButtonOnDateSearch();
        //this.singlarService.login(ret.token);
      }
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
    if (this.linkCmsUserId > 0)
      filterModelOnDay.linkResponsibleUserId = this.linkCmsUserId;
    filterModelOnDay.filters.push(this.filterChildrecordStatus);
    this.publicHelper.processService.processStart(pName, "دریافت اطلاعات املاک", "dataModelPropertyResult");
    /** Search On Select Day */
    this.estatePropertyService.ServiceGetAll(filterModelOnDay).subscribe({
      next: (ret) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
        if (ret.isSuccess) {
          this.dataModelPropertyResult = ret;
          this.publicHelper.processService.processStop(pName);
        }
        error: (er) => {
          this.cmsToastrService.typeError(er);
          this.publicHelper.processService.processStop(pName, false);
        }
      }
    }
    );
  }
  DataGetAllPropertyAvailable(): void {
    const pName = this.constructor.name + 'DataGetAllPropertyAvailable';

    let filterModelOnDay = new EstatePropertyFilterModel();
    // filterModelOnDay = filterModel;
    if (!this.checkingOnDayRange.controls.start?.value)
      this.checkingOnDayRange.controls.start.setValue(this.todayStart);
    if (!this.checkingOnDayRange.controls.end?.value)
      this.checkingOnDayRange.controls.end.setValue(this.todayEnd);
    filterModelOnDay.onDateTimeFrom = this.checkingOnDayRange.controls.start.value;
    filterModelOnDay.onDateTimeTo = this.checkingOnDayRange.controls.end.value;
    filterModelOnDay.countLoad = true;
    if (this.linkCmsUserId > 0)
      filterModelOnDay.linkResponsibleUserId = this.linkCmsUserId;
    filterModelOnDay.filters.push(this.filterChildrecordStatusAvailable);
    this.publicHelper.processService.processStart(pName, "دریافت اطلاعات املاک", "dataModelPropertyResultAvailable");
    /** Search On Select Day */
    this.estatePropertyService.ServiceGetAll(filterModelOnDay).subscribe({
      next: (ret) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
        if (ret.isSuccess) {
          this.dataModelPropertyResultAvailable = ret;
          this.publicHelper.processService.processStop(pName);
        }
        error: (er) => {
          this.cmsToastrService.typeError(er);
          this.publicHelper.processService.processStop(pName, false);
        }
      }
    }
    );
  }
  DataGetAllPropertyNotAvailable(): void {
    const pName = this.constructor.name + 'DataGetAllPropertyNotAvailable';

    let filterModelOnDay = new EstatePropertyFilterModel();
    // filterModelOnDay = filterModel;
    if (!this.checkingOnDayRange.controls.start?.value)
      this.checkingOnDayRange.controls.start.setValue(this.todayStart);
    if (!this.checkingOnDayRange.controls.end?.value)
      this.checkingOnDayRange.controls.end.setValue(this.todayEnd);
    filterModelOnDay.onDateTimeFrom = this.checkingOnDayRange.controls.start.value;
    filterModelOnDay.onDateTimeTo = this.checkingOnDayRange.controls.end.value;
    filterModelOnDay.countLoad = true;
    if (this.linkCmsUserId > 0)
      filterModelOnDay.linkResponsibleUserId = this.linkCmsUserId;
    filterModelOnDay.filters.push(this.filterChildrecordStatusNotAvailable);
    this.publicHelper.processService.processStart(pName, "دریافت اطلاعات املاک", "dataModelPropertyResultNotAvailable");
    /** Search On Select Day */
    this.estatePropertyService.ServiceGetAll(filterModelOnDay).subscribe({
      next: (ret) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
        if (ret.isSuccess) {
          this.dataModelPropertyResultNotAvailable = ret;
          this.publicHelper.processService.processStop(pName);
        }
        error: (er) => {
          this.cmsToastrService.typeError(er);
          this.publicHelper.processService.processStop(pName, false);
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
    if (this.linkCmsUserId > 0)
      filterModelOnDay.linkResponsibleUserId = this.linkCmsUserId;
    filterModelOnDay.filters.push(this.filterChildrecordStatus);
    this.publicHelper.processService.processStart(pName, "دریافت اطلاعات سفارشات", "dataModelCustomerOrderResult");
    /** Search On Select Day */
    this.estateCustomerOrderService.ServiceGetAll(filterModelOnDay).subscribe({
      next: (ret) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
        if (ret.isSuccess) {
          this.dataModelCustomerOrderResult = ret;
          this.publicHelper.processService.processStop(pName);
        }
        error: (er) => {
          this.cmsToastrService.typeError(er);
          this.publicHelper.processService.processStop(pName, false);
        }
      }
    }
    );
  }
  DataGetAllCustomerOrderAvailable(): void {
    const pName = this.constructor.name + 'DataGetAllCustomerOrderAvailable';
    let filterModelOnDay = new EstateCustomerOrderFilterModel();
    // filterModelOnDay = filterModel;
    if (!this.checkingOnDayRange.controls.start?.value)
      this.checkingOnDayRange.controls.start.setValue(this.todayStart);
    if (!this.checkingOnDayRange.controls.end?.value)
      this.checkingOnDayRange.controls.end.setValue(this.todayEnd);
    filterModelOnDay.onDateTimeFrom = this.checkingOnDayRange.controls.start.value;
    filterModelOnDay.onDateTimeTo = this.checkingOnDayRange.controls.end.value;
    filterModelOnDay.countLoad = true;
    if (this.linkCmsUserId > 0)
      filterModelOnDay.linkResponsibleUserId = this.linkCmsUserId;
    filterModelOnDay.filters.push(this.filterChildrecordStatusAvailable);
    this.publicHelper.processService.processStart(pName, "دریافت اطلاعات سفارشات", "dataModelCustomerOrderResultAvailable");
    /** Search On Select Day */
    this.estateCustomerOrderService.ServiceGetAll(filterModelOnDay).subscribe({
      next: (ret) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
        if (ret.isSuccess) {
          this.dataModelCustomerOrderResultAvailable = ret;
          this.publicHelper.processService.processStop(pName);
        }
        error: (er) => {
          this.cmsToastrService.typeError(er);
          this.publicHelper.processService.processStop(pName, false);
        }
      }
    }
    );
  }
  DataGetAllCustomerOrderNotAvailable(): void {
    const pName = this.constructor.name + 'DataGetAllCustomerOrderNotAvailable';
    let filterModelOnDay = new EstateCustomerOrderFilterModel();
    // filterModelOnDay = filterModel;
    if (!this.checkingOnDayRange.controls.start?.value)
      this.checkingOnDayRange.controls.start.setValue(this.todayStart);
    if (!this.checkingOnDayRange.controls.end?.value)
      this.checkingOnDayRange.controls.end.setValue(this.todayEnd);
    filterModelOnDay.onDateTimeFrom = this.checkingOnDayRange.controls.start.value;
    filterModelOnDay.onDateTimeTo = this.checkingOnDayRange.controls.end.value;
    filterModelOnDay.countLoad = true;
    if (this.linkCmsUserId > 0)
      filterModelOnDay.linkResponsibleUserId = this.linkCmsUserId;
    filterModelOnDay.filters.push(this.filterChildrecordStatusNotAvailable);
    this.publicHelper.processService.processStart(pName, "دریافت اطلاعات سفارشات", "dataModelCustomerOrderResultNotAvailable");
    /** Search On Select Day */
    this.estateCustomerOrderService.ServiceGetAll(filterModelOnDay).subscribe({
      next: (ret) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
        if (ret.isSuccess) {
          this.dataModelCustomerOrderResultNotAvailable = ret;
          this.publicHelper.processService.processStop(pName);
        }
        error: (er) => {
          this.cmsToastrService.typeError(er);
          this.publicHelper.processService.processStop(pName, false);
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
    if (this.linkCmsUserId > 0)
      filterModelOnDay.linkResponsibleUserId = this.linkCmsUserId;
    filterModelOnDay.filters.push(this.filterChildrecordStatus);
    this.publicHelper.processService.processStart(pName, "دریافت اطلاعات تاریخچه", "dataModelHistoryResult");
    /** Search On Select Day */
    this.estatePropertyHistoryService.ServiceGetAll(filterModelOnDay).subscribe({
      next: (ret) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
        if (ret.isSuccess) {
          this.dataModelHistoryResult = ret;
          this.publicHelper.processService.processStop(pName);
        }
        error: (er) => {
          this.cmsToastrService.typeError(er);
          this.publicHelper.processService.processStop(pName, false);
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
    if (this.linkCmsUserId > 0)
      filterModelOnDay.linkResponsibleUserId = this.linkCmsUserId;
    filterModelOnDay.filters.push(this.filterChildrecordStatus);
    this.publicHelper.processService.processStart(pName, "دریافت اطلاعات شرکت های ساختمانی", "dataModelPropertyCompanyResult");
    /** Search On Select Day */
    this.estatePropertyCompanyService.ServiceGetAll(filterModelOnDay).subscribe({
      next: (ret) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
        if (ret.isSuccess) {
          this.dataModelPropertyCompanyResult = ret;
          this.publicHelper.processService.processStop(pName);
        }
        error: (er) => {
          this.cmsToastrService.typeError(er);
          this.publicHelper.processService.processStop(pName, false);
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
    if (this.linkCmsUserId > 0)
      filterModelOnDay.linkResponsibleUserId = this.linkCmsUserId;
    filterModelOnDay.filters.push(this.filterChildrecordStatus);
    this.publicHelper.processService.processStart(pName, "دریافت اطلاعات تامین کنند", "dataModelPropertySupplierResult");
    /** Search On Select Day */
    this.estatePropertySupplierService.ServiceGetAll(filterModelOnDay).subscribe({
      next: (ret) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
        if (ret.isSuccess) {
          this.dataModelPropertySupplierResult = ret;
          this.publicHelper.processService.processStop(pName);
        }
        error: (er) => {
          this.cmsToastrService.typeError(er);
          this.publicHelper.processService.processStop(pName, false);
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
    if (this.linkCmsUserId > 0)
      filterModelOnDay.linkResponsibleUserId = this.linkCmsUserId;
    filterModelOnDay.filters.push(this.filterChildrecordStatus);
    this.publicHelper.processService.processStart(pName, "دریافت اطلاعات پروژه ها", "dataModelPropertyProjectResult");
    /** Search On Select Day */
    this.estatePropertyProjectService.ServiceGetAll(filterModelOnDay).subscribe({
      next: (ret) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
        if (ret.isSuccess) {
          this.dataModelPropertyProjectResult = ret;
          this.publicHelper.processService.processStop(pName);
        }
        error: (er) => {
          this.cmsToastrService.typeError(er);
          this.publicHelper.processService.processStop(pName, false);
        }
      }
    }
    );
  }
  DataGetAllAccountUser(): void {
    const pName = this.constructor.name + 'DataGetAllAccountUser';

    let filterModelOnDay = new EstateAccountExpertFilterModel();
    // filterModelOnDay = filterModel;
    if (!this.checkingOnDayRange.controls.start?.value)
      this.checkingOnDayRange.controls.start.setValue(this.todayStart);
    if (!this.checkingOnDayRange.controls.end?.value)
      this.checkingOnDayRange.controls.end.setValue(this.todayEnd);
    filterModelOnDay.onDateTimeFrom = this.checkingOnDayRange.controls.start.value;
    filterModelOnDay.onDateTimeTo = this.checkingOnDayRange.controls.end.value;
    filterModelOnDay.countLoad = true;
    if (this.linkCmsUserId > 0)
      filterModelOnDay.linkResponsibleUserId = this.linkCmsUserId;
    filterModelOnDay.filters.push(this.filterChildrecordStatus);
    this.publicHelper.processService.processStart(pName, "دریافت اطلاعات حساب کاربری", "dataModelAccountUserResult");
    /** Search On Select Day */
    this.estateAccountExpertService.ServiceGetAll(filterModelOnDay).subscribe({
      next: (ret) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
        if (ret.isSuccess) {
          this.dataModelAccountUserResult = ret;
          this.publicHelper.processService.processStop(pName);
        }
        error: (er) => {
          this.cmsToastrService.typeError(er);
          this.publicHelper.processService.processStop(pName, false);
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
    if (this.linkCmsUserId > 0)
      filterModelOnDay.linkResponsibleUserId = this.linkCmsUserId;
    filterModelOnDay.filters.push(this.filterChildrecordStatus);
    this.publicHelper.processService.processStart(pName, "دریافت اطلاعات کارشناس", "dataModelAccountAgencyResult");
    /** Search On Select Day */
    this.estateAccountAgencyService.ServiceGetAll(filterModelOnDay).subscribe({
      next: (ret) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
        if (ret.isSuccess) {
          this.dataModelAccountAgencyResult = ret;
          this.publicHelper.processService.processStop(pName);
        }
        error: (er) => {
          this.cmsToastrService.typeError(er);
          this.publicHelper.processService.processStop(pName, false);
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
    /** */
    this.DataGetAllProperty();
    this.DataGetAllPropertyAvailable();
    this.DataGetAllPropertyNotAvailable();
    /** */
    this.DataGetAllCustomerOrder();
    this.DataGetAllCustomerOrderAvailable();
    this.DataGetAllCustomerOrderNotAvailable();
    /** */
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
  onActionButtonProperty(model: EstatePropertyModel, listItems: EstatePropertyModel[], event?: MouseEvent): void {
    if (!model || !model.id || model.id.length === 0) {
      this.translate.get('MESSAGE.no_row_selected_to_display').subscribe((str: string) => { this.cmsToastrService.typeErrorSelected(str); });
      return;
    }
    var nextItem = this.publicHelper.InfoNextRowInList(listItems, model);
    var perviousItem = this.publicHelper.InfoPerviousRowInList(listItems, model);
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
        this.onActionButtonProperty(result.onActionOpenItem, listItems)
      }
    });
  }
  onActionButtonCustomerOrder(model: EstateCustomerOrderModel, listItems: EstateCustomerOrderModel[], event?: MouseEvent): void {
    if (!model || !model.id || model.id.length === 0) {
      this.translate.get('MESSAGE.no_row_selected_to_display').subscribe((str: string) => { this.cmsToastrService.typeErrorSelected(str); });
      return;
    }

    var nextItem = this.publicHelper.InfoNextRowInList(listItems, model);
    var perviousItem = this.publicHelper.InfoPerviousRowInList(listItems, model);
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
        this.onActionButtonCustomerOrder(result.onActionOpenItem, listItems)
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
  onActionButtonAccountUser(model: EstateAccountExpertModel, event?: MouseEvent): void {
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

    var nextItem = this.publicHelper.InfoNextRowInList(this.dataModelPropertyProjectResult.listItems, model);
    var perviousItem = this.publicHelper.InfoPerviousRowInList(this.dataModelPropertyProjectResult.listItems, model);
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

    var nextItem = this.publicHelper.InfoNextRowInList(this.dataModelPropertySupplierResult.listItems, model);
    var perviousItem = this.publicHelper.InfoPerviousRowInList(this.dataModelPropertySupplierResult.listItems, model);
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

    var nextItem = this.publicHelper.InfoNextRowInList(this.dataModelPropertyCompanyResult.listItems, model);
    var perviousItem = this.publicHelper.InfoPerviousRowInList(this.dataModelPropertyCompanyResult.listItems, model);
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
