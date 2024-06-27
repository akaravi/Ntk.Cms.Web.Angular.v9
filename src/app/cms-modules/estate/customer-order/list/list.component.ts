
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  CoreCurrencyModel,
  EstateContractTypeModel, EstateCustomerOrderFilterModel, EstateCustomerOrderModel,

  EstateCustomerOrderService, EstatePropertyDetailGroupModel, EstatePropertyDetailGroupService, EstatePropertyDetailValueModel, EstatePropertyTypeLanduseModel, EstatePropertyTypeUsageModel, FilterDataModel,
  FilterModel, InputDataTypeEnum, ManageUserAccessDataTypesEnum, RecordStatusEnum, SortTypeEnum
} from 'ntk-cms-api';

import { Subscription, forkJoin } from 'rxjs';
import { ListBaseComponent } from 'src/app/core/cmsComponent/listBaseComponent';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { PageInfoService } from 'src/app/core/services/page-info.service';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { CmsLinkToComponent } from "src/app/shared/cms-link-to/cms-link-to.component";
import { environment } from 'src/environments/environment';
import { EstatePropertyHistoryAddComponent } from '../../property-history/add/add.component';
import { EstateCustomerOrderAddToEditComponent } from '../add/add-to-edit.component';
@Component({
  selector: 'app-estate-customer-order-list',
  templateUrl: './list.component.html',
})
export class EstateCustomerOrderListComponent extends ListBaseComponent<EstateCustomerOrderService, EstateCustomerOrderModel, string> implements OnInit, OnDestroy {
  requestLinkPropertyId: string;
  requestLinkPropertyIdHaveHistory: string;

  constructor(
    public contentService: EstateCustomerOrderService,
    private cmsConfirmationDialogService: CmsConfirmationDialogService,
    public estatePropertyDetailGroupService: EstatePropertyDetailGroupService,
    private cmsToastrService: CmsToastrService,
    public tokenHelper: TokenHelper,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    public pageInfo: PageInfoService,
    public publicHelper: PublicHelper,
    public dialog: MatDialog,
  ) {
    super(contentService, new EstateCustomerOrderModel(), publicHelper, tokenHelper);

    this.loading.cdr = this.cdr;
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => { this.loading.message = str; });
    this.optionsSearch.parentMethods = {
      onSubmit: (model) => this.onSubmitOptionsSearch(model),
    };

    this.responsibleUserId = +this.activatedRoute.snapshot.paramMap.get('ResponsibleUserId');
    this.requestRecordStatus = RecordStatusEnum[this.activatedRoute.snapshot.paramMap.get('RecordStatus') + ''];
    if (this.requestRecordStatus) {
      this.optionsSearch.data.show = true;
      this.optionsSearch.data.defaultQuery = '{"condition":"and","rules":[{"field":"RecordStatus","type":"select","operator":"equal","value":"' + this.requestRecordStatus + '"}]}';
      this.requestRecordStatus = null;
    }
    /*filter Sort*/
    this.filteModelContent.sortColumn = 'CreatedDate';
    this.filteModelContent.sortType = SortTypeEnum.Descending;

  }

  responsibleUserId = 0;
  searchInResponsible = false;
  searchInResponsibleChecked = false;

  link: string;
  comment: string;
  author: string;
  dataSource: any;
  flag = false;
  tableContentSelected = [];
  filteModelContent = new EstateCustomerOrderFilterModel();


  dataModelPropertyDetailGroups: EstatePropertyDetailGroupModel[] = [];
  enumInputDataType = InputDataTypeEnum;


  tabledisplayedColumns: string[] = [];
  categoryModelSelected: EstateCustomerOrderModel;
  step = 0;
  tabledisplayedColumnsSource: string[] = [
    'Id',
    'LinkSiteId',
    'RecordStatus',
    'Title',
    'CreatedDate',
    'UpdatedDate',
    'scoreRushToBuy',
    'scorePurchaseDecision',
    'scoreLiquidityPower',
    'scorePurchasingPower',
    "CaseCode",
    "LinkTo",
    'action_menu',
  ];
  tabledisplayedColumnsMobileSource: string[] = [
    'Title',
    'RecordStatus',
    "CaseCode",
    "LinkTo",
    'action_menu',
  ];

  expandedElement: EstateCustomerOrderModel | null;
  cmsApiStoreSubscribe: Subscription;
  propertyDetails: Map<string, string> = new Map<string, string>();
  @Input() optionloadComponent = true;
  @Input() optionloadByRoute = true;
  @Input() set optionLinkPropertyId(id: string) {
    if (id && id.length > 0) {
      this.requestLinkPropertyId = id;
    }
  }
  @Input() set optionLinkPropertyIdHaveHistory(id: string) {
    if (id && id.length > 0) {
      this.requestLinkPropertyIdHaveHistory = id;
    }
  }

  ngOnInit(): void {
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
      if (!this.tokenHelper.isAdminSite && !this.tokenHelper.isSupportSite) {
        this.tabledisplayedColumnsSource = this.publicHelper.listRemoveIfExist(this.tabledisplayedColumnsSource, 'scoreRushToBuy');
        this.tabledisplayedColumnsSource = this.publicHelper.listRemoveIfExist(this.tabledisplayedColumnsSource, 'scorePurchaseDecision');
        this.tabledisplayedColumnsSource = this.publicHelper.listRemoveIfExist(this.tabledisplayedColumnsSource, 'scoreLiquidityPower');
        this.tabledisplayedColumnsSource = this.publicHelper.listRemoveIfExist(this.tabledisplayedColumnsSource, 'scorePurchasingPower');
      }
      this.DataGetAll();
    });
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe({
      next: (ret) => {
        this.tokenInfo = ret;
        if (!this.tokenHelper.isAdminSite && this.tokenHelper.isSupportSite) {
          this.tabledisplayedColumnsSource = this.publicHelper.listRemoveIfExist(this.tabledisplayedColumnsSource, 'scoreRushToBuy');
          this.tabledisplayedColumnsSource = this.publicHelper.listRemoveIfExist(this.tabledisplayedColumnsSource, 'scorePurchaseDecision');
          this.tabledisplayedColumnsSource = this.publicHelper.listRemoveIfExist(this.tabledisplayedColumnsSource, 'scoreLiquidityPower');
          this.tabledisplayedColumnsSource = this.publicHelper.listRemoveIfExist(this.tabledisplayedColumnsSource, 'scorePurchasingPower');
        }
        this.DataGetAll();
      }
    });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  DataGetAll(): void {
    this.tabledisplayedColumns = this.publicHelper.TableDisplayedColumns(this.tabledisplayedColumnsSource, this.tabledisplayedColumnsMobileSource, [], this.tokenInfo);
    if (!this.optionloadComponent) {
      return;
    }
    this.tableRowsSelected = [];
    this.onActionTableRowSelect(new EstateCustomerOrderModel());
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.get_information_list').subscribe((str: string) => { this.publicHelper.processService.processStart(pName, str); });
    this.filteModelContent.accessLoad = true;
    /*filter CLone*/
    const filterModel = JSON.parse(JSON.stringify(this.filteModelContent));
    /*filter CLone*/
    /** filter Category */
    if (this.categoryModelSelected && this.categoryModelSelected.id.length > 0) {
      const filterChild = new FilterDataModel();
      filterChild.propertyName = 'linkEstateCustomerCategoryId';
      filterChild.value = this.categoryModelSelected.id;
      filterModel.filters.push(filterChild);
    }
    /** filter Category */
    var setResponsibleUserId = 0;
    if (this.searchInResponsible) {
      setResponsibleUserId = this.tokenInfo.userId;
    } else if (this.responsibleUserId > 0) {
      setResponsibleUserId = this.responsibleUserId;
    }
    if (this.requestLinkPropertyId && this.requestLinkPropertyId.length > 0) {
      /**requestLinkPropertyId */
      this.contentService.ServiceGetAllWithCoverPropertyId(this.requestLinkPropertyId, filterModel).subscribe({
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
        },
        error: (er) => {
          this.cmsToastrService.typeError(er);
          this.publicHelper.processService.processStop(pName, false);
        }
      }
      );
      /**requestLinkPropertyId */
    } else if (this.requestLinkPropertyIdHaveHistory && this.requestLinkPropertyIdHaveHistory.length > 0) {
      /**requestLinkPropertyIdHaveHistory */
      this.contentService.ServiceGetAllWithCoverPropertyIdHaveHistory(this.requestLinkPropertyIdHaveHistory, filterModel).subscribe({
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
        },
        error: (er) => {
          this.cmsToastrService.typeError(er);
          this.publicHelper.processService.processStop(pName, false);
        }
      }
      );
      /**requestLinkPropertyIdHaveHistory */
    }
    else if (setResponsibleUserId > 0) {
      /** ResponsibleUserId  */
      this.contentService.ServiceGetAllWithResponsibleUserId(setResponsibleUserId, filterModel).subscribe({
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
        },
        error: (er) => {
          this.cmsToastrService.typeError(er);
          this.publicHelper.processService.processStop(pName, false);
        }
      }
      );
      /** ResponsibleUserId  */
    } else {
      // ** Save Value */
      var propertyDetailValues = [];
      if (this.dataModelPropertyDetailGroups)
        this.dataModelPropertyDetailGroups.forEach(itemGroup => {
          itemGroup.propertyDetails.forEach(element => {
            const value = new EstatePropertyDetailValueModel();
            value.linkPropertyDetailId = element.id;
            value.value = this.propertyDetails[element.id];
            propertyDetailValues.push(value);
          });
        });
      filterModel.propertyDetailValues = propertyDetailValues;
      // ** Save Value */
      this.contentService.setAccessDataType(ManageUserAccessDataTypesEnum.Editor);
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
        },
        error: (er) => {
          this.cmsToastrService.typeError(er);
          this.publicHelper.processService.processStop(pName, false);
        }
      }
      );
      /** GetAllEditor  */
    }
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
  onActionButtonNewRow(event?: MouseEvent): void {
    if (
      this.dataModelResult == null ||
      this.dataModelResult.access == null ||
      !this.dataModelResult.access.accessAddRow
    ) {
      this.cmsToastrService.typeErrorAccessAdd();
      return;
    }


    //open poup
    var panelClass = '';
    if (this.tokenHelper.isMobile)
      panelClass = 'dialog-fullscreen';// matdialogStyle
    else
      panelClass = 'dialog-min';
    const dialogRef = this.dialog.open(EstateCustomerOrderAddToEditComponent, {
      height: "90%",
      panelClass: panelClass,
      enterAnimationDuration: environment.cmsViewConfig.enterAnimationDuration,
      exitAnimationDuration: environment.cmsViewConfig.exitAnimationDuration,
      data: {
        linkEstateCustomerCategoryId: this.categoryModelSelected?.id
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.dialogChangedDate) {
        this.router.navigate(['/estate/customer-order/edit/', result.id]);
      }
    });
    //open poup


  }
  onActionButtonCopyNewRow(model: EstateCustomerOrderModel = this.tableRowSelected, event?: MouseEvent): void {
    if (!model || !model.id || model.id.length === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    this.onActionTableRowSelect(model);

    //open poup
    var panelClass = '';
    if (this.tokenHelper.isMobile)
      panelClass = 'dialog-fullscreen';// matdialogStyle
    else
      panelClass = 'dialog-min';
    const dialogRef = this.dialog.open(EstateCustomerOrderAddToEditComponent, {
      height: "90%",
      panelClass: panelClass,
      enterAnimationDuration: environment.cmsViewConfig.enterAnimationDuration,
      exitAnimationDuration: environment.cmsViewConfig.exitAnimationDuration,
      data: {
        copyId: model.id,
        linkEstateCustomerCategoryId: this.categoryModelSelected?.id
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.dialogChangedDate) {
        this.router.navigate(['/estate/customer-order/edit/', result.id]);
      }
    });
    //open poup


  }
  onActionButtonEditRow(model: EstateCustomerOrderModel = this.tableRowSelected, event?: MouseEvent): void {
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

    if (event?.ctrlKey) {
      this.link = "/#/estate/customer-order/edit/" + this.tableRowSelected.id;
      window.open(this.link, "_blank");
    } else {
      this.router.navigate(['/estate/customer-order/edit', this.tableRowSelected.id]);
    }
  }
  onActionButtonDeleteRow(model: EstateCustomerOrderModel = this.tableRowSelected): void {
    if (!model || !model.id || model.id.length === 0) {
      this.translate.get('MESSAGE.no_row_selected_to_delete').subscribe((str: string) => { this.cmsToastrService.typeErrorSelected(str); });
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
    this.cmsConfirmationDialogService.confirm(title, message)
      .then((confirmed) => {
        if (confirmed) {
          const pName = this.constructor.name + 'main';
          this.publicHelper.processService.processStart(pName);
          this.contentService.ServiceDelete(model.id).subscribe({
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
            }
          }
          );
        }
      }
      )
      .catch(() => {
        // console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)')
      }
      );
  }
  onActionButtonHistoryRow(
    mode: EstateCustomerOrderModel = this.tableRowSelected, event?: MouseEvent
  ): void {
    if (!mode || !mode.id || mode.id.length === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    this.onActionTableRowSelect(mode);
    if (
      this.dataModelResult == null ||
      this.dataModelResult.access == null ||
      !this.dataModelResult.access.accessEditRow
    ) {
      this.cmsToastrService.typeErrorAccessEdit();
      return;
    }

    if (event?.ctrlKey) {
      this.link = "/#/estate/property-history/LinkCustomerOrderId/" + this.tableRowSelected.id;
      window.open(this.link, "_blank");
    } else {
      this.router.navigate(["/estate/property-history/LinkCustomerOrderId", this.tableRowSelected.id]);
    }
  }
  onActionButtonOpenCustomerOrder(model: EstateCustomerOrderModel = this.tableRowSelected): void {
    if (!model || !model.id || model.id.length === 0) {
      this.translate.get('MESSAGE.no_row_selected_to_display').subscribe((str: string) => { this.cmsToastrService.typeErrorSelected(str); });
      return;
    }
    this.onActionTableRowSelect(model);
    window.open(this.tableRowSelected.urlViewContent, '_blank');
  }
  onActionButtonContentList(model: EstateCustomerOrderModel = this.tableRowSelected, event?: MouseEvent): void {
    if (!model || !model.id || model.id.length === 0) {
      this.translate.get('MESSAGE.no_row_selected_to_display').subscribe((str: string) => { this.cmsToastrService.typeErrorSelected(str); });
      return;
    }
    this.onActionTableRowSelect(model);


    if (event?.ctrlKey) {
      this.link = "/#/estate/property/LinkCustomerOrderId/" + this.tableRowSelected.id;
      window.open(this.link, "_blank");
    } else {
      this.router.navigate(['/estate/property/LinkCustomerOrderId/', this.tableRowSelected.id]);
    }
  }
  onActionButtonStatist(view = !this.optionsStatist.data.show): void {
    this.optionsStatist.data.show = view;
    if (!this.optionsStatist.data.show) {
      return;
    }
    const statist = new Map<string, number>();



    this.publicHelper.processService.processStart(this.constructor.name + 'All', this.translate.instant('MESSAGE.property_list'));
    this.contentService.setAccessDataType(ManageUserAccessDataTypesEnum.Editor);
    //*filter */
    const filterStatist0 = JSON.parse(JSON.stringify(this.filteModelContent));
    const s0 = this.contentService.ServiceGetCount(filterStatist0);
    //*filter */
    const filterStatist1 = JSON.parse(JSON.stringify(this.filteModelContent));
    const fastfilter1 = new FilterDataModel();
    fastfilter1.propertyName = 'RecordStatus';
    fastfilter1.value = RecordStatusEnum.Available;
    filterStatist1.filters.push(fastfilter1);
    const s1 = this.contentService.ServiceGetCount(filterStatist1);
    //*filter */
    const filterStatist2 = JSON.parse(JSON.stringify(this.filteModelContent));
    const fastfilter2 = new FilterDataModel();
    fastfilter2.propertyName = 'RecordStatus';
    fastfilter2.value = RecordStatusEnum.Archive;
    filterStatist2.filters.push(fastfilter2);
    const s2 = this.contentService.ServiceGetCount(filterStatist2);
    //*filter */
    const filterStatist3 = JSON.parse(JSON.stringify(this.filteModelContent));
    const fastfilter3 = new FilterDataModel();
    fastfilter3.propertyName = 'RecordStatus';
    fastfilter3.value = RecordStatusEnum.Pending;
    filterStatist3.filters.push(fastfilter3);
    const s3 = this.contentService.ServiceGetCount(filterStatist3);

    //*filter */
    const filterStatist4 = JSON.parse(JSON.stringify(this.filteModelContent));
    const fastfilter4 = new FilterDataModel();
    fastfilter4.propertyName = 'RecordStatus';
    fastfilter4.value = RecordStatusEnum.Disable;
    filterStatist4.filters.push(fastfilter4);
    const s4 = this.contentService.ServiceGetCount(filterStatist4);

    forkJoin([s0, s1, s2, s3, s4]).subscribe(results => {

      //*results */
      var ret = results[0];
      if (ret.isSuccess) {
        statist.set(this.translate.instant('MESSAGE.customer_order_list'), ret.totalRowCount);
      }
      //*results */
      var ret = results[1];
      if (ret.isSuccess) {
        statist.set(this.translate.instant('MESSAGE.customer_order_list_active'), ret.totalRowCount);
      }

      //*results */
      ret = results[2];
      if (ret.isSuccess) {
        statist.set(this.translate.instant('MESSAGE.customer_order_list_close'), ret.totalRowCount);
      } else {
        this.cmsToastrService.typeErrorMessage(ret.errorMessage);
      }
      //*results */
      ret = results[3];

      if (ret.isSuccess) {
        statist.set(this.translate.instant('MESSAGE.customer_order_needs_approval'), ret.totalRowCount);

      } else {
        this.cmsToastrService.typeErrorMessage(ret.errorMessage);
      }
      //*results */
      ret = results[4];
      if (ret.isSuccess) {
        statist.set(this.translate.instant('MESSAGE.customer_order_list_disable'), ret.totalRowCount);
      } else {
        this.cmsToastrService.typeErrorMessage(ret.errorMessage);
      }
      this.publicHelper.processService.processStop(this.constructor.name + 'All');
      this.optionsStatist.childMethods.setStatistValue(statist);

    });



  }

  onActionButtonInResponsible(model: boolean): void {
    this.searchInResponsible = model;
    this.DataGetAll();
  }



  onActionSelectorSelect(model: EstateCustomerOrderModel | null): void {
    /*filter */
    var sortColumn = this.filteModelContent.sortColumn;
    var sortType = this.filteModelContent.sortType;
    /*filter */
    var sortColumn = this.filteModelContent.sortColumn;
    var sortType = this.filteModelContent.sortType;
    this.filteModelContent = new EstateCustomerOrderFilterModel();
    this.filteModelContent.sortColumn = sortColumn;
    this.filteModelContent.sortType = sortType;
    /*filter */
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

  onActionButtonLinkTo(
    model: EstateCustomerOrderModel = this.tableRowSelected
  ): void {
    if (!model || !model.id || model.id.length === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    if (model.recordStatus != RecordStatusEnum.Available) {
      this.cmsToastrService.typeWarningRecordStatusNoAvailable();
      return;
    }
    this.onActionTableRowSelect(model);

    const pName = this.constructor.name + "ServiceGetOneById";
    this.publicHelper.processService.processStart(pName, this.translate.instant('MESSAGE.get_customer_information'));
    this.contentService
      .ServiceGetOneById(this.tableRowSelected.id)
      .subscribe({
        next: (ret) => {
          if (ret.isSuccess) {
            //open poup
            var panelClass = '';
            if (this.tokenHelper.isMobile)
              panelClass = 'dialog-fullscreen';
            else
              panelClass = 'dialog-min';
            const dialogRef = this.dialog.open(CmsLinkToComponent, {
              height: "90%",
              panelClass: panelClass,
              enterAnimationDuration: environment.cmsViewConfig.enterAnimationDuration,
              exitAnimationDuration: environment.cmsViewConfig.exitAnimationDuration,
              data: {
                title: ret.item.title,
                urlViewContentQRCodeBase64: ret.item.urlViewContentQRCodeBase64,
                urlViewContent: ret.item.urlViewContent,
              },
            });
            dialogRef.afterClosed().subscribe((result) => {
              if (result && result.dialogChangedDate) {
                this.DataGetAll();
              }
            });
            //open poup
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

  onActionSelectorLocation(model: number[] | null): void {

    this.filteModelContent.linkLocationIds = model;
  }
  onActionSelectorSelectUsage(model: EstatePropertyTypeUsageModel | null): void {
    if (!model || !model.id || model.id.length <= 0) {
      this.translate.get('MESSAGE.category_of_information_is_not_clear').subscribe((str: string) => { this.cmsToastrService.typeWarningSelected(str); });
      return;
    }
    this.filteModelContent.linkPropertyTypeUsageId = model.id;
  }
  onSearchCaseCodeChange(caseCode: string) {
    if (caseCode && caseCode.length > 0) {
      this.filteModelContent = new EstateCustomerOrderFilterModel();
      this.filteModelContent.caseCode = caseCode;
      this.dataModelPropertyDetailGroups = [];
    }
  }
  PropertyTypeSelected = new EstatePropertyTypeLanduseModel();
  contractTypeSelected: EstateContractTypeModel;
  dataModelCorCurrencySelector = new CoreCurrencyModel();
  onActionSelectorSelectLanduse(model: EstatePropertyTypeLanduseModel | null): void {
    this.dataModelPropertyDetailGroups = [];
    this.PropertyTypeSelected = null;
    this.filteModelContent.linkPropertyTypeLanduseId = null;
    if (!model || !model.id || model.id.length <= 0) {
      this.translate.get('MESSAGE.category_of_information_is_not_clear').subscribe((str: string) => { this.cmsToastrService.typeWarningSelected(str); });
      return;
    }
    this.DataGetPropertyDetailGroup(model.id);
    this.PropertyTypeSelected = model;
    this.filteModelContent.linkPropertyTypeLanduseId = model.id;
  }
  DataGetPropertyDetailGroup(id: string): void {
    const filteModelProperty = new FilterModel();
    const filter = new FilterDataModel();
    filter.propertyName = 'LinkPropertyTypeLanduseId';
    filter.value = id;
    filteModelProperty.filters.push(filter);
    this.dataModelPropertyDetailGroups = [];
    const pName = this.constructor.name + 'DataGetPropertyDetailGroup';
    this.publicHelper.processService.processStart(pName, this.translate.instant('MESSAGE.Get_detailed_information'));
    this.estatePropertyDetailGroupService.ServiceGetAllFastSearch(filteModelProperty)
      .subscribe({
        next: (ret) => {
          if (ret.isSuccess) {
            this.dataModelPropertyDetailGroups = ret.listItems;
            /** load Value */
            if (this.dataModelPropertyDetailGroups)
              this.dataModelPropertyDetailGroups.forEach(itemGroup => {
                itemGroup.propertyDetails.forEach(element => {
                  this.propertyDetails[element.id] = 0;

                });
              });
            /** load Value */
          } else {
            this.cmsToastrService.typeErrorGetAccess(ret.errorMessage);
          }
          this.publicHelper.processService.processStop(pName);
        },
        error: (er) => {
          this.cmsToastrService.typeErrorGetAccess(er);
          this.publicHelper.processService.processStop(pName, false);
        }
      }
      );
  }
  onActionSelectorContarctType(model: EstateContractTypeModel | null): void {
    this.contractTypeSelected = null;
    this.filteModelContent.linkContractTypeId = null;
    if (!model || !model.id || model.id.length <= 0) {
      const message = this.translate.instant('MESSAGE.Type_of_property_transaction_is_not_known');
      this.cmsToastrService.typeWarningSelected(message);
      return;
    }
    this.contractTypeSelected = model;
    this.filteModelContent.linkContractTypeId = model.id;

  }
  onActionSelectCurrency(model: CoreCurrencyModel): void {
    if (!model || model.id <= 0) {
      // this.cmsToastrService.typeErrorSelected();
      this.dataModelCorCurrencySelector = null;
      this.filteModelContent.linkCoreCurrencyId = null;
      return;
    }
    this.dataModelCorCurrencySelector = model;
    this.filteModelContent.linkCoreCurrencyId = model.id;
  }


  onActionButtonQuickHistoryAddRow(model: EstateCustomerOrderModel = this.tableRowSelected): void {
    if (!model || !model.id || model.id.length === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    this.onActionTableRowSelect(model);
    var panelClass = '';
    if (this.tokenHelper.isMobile)
      panelClass = 'dialog-fullscreen';
    else
      panelClass = 'dialog-min';
    const dialogRef = this.dialog.open(EstatePropertyHistoryAddComponent, {
      height: '90%',
      panelClass: panelClass,
      enterAnimationDuration: environment.cmsViewConfig.enterAnimationDuration,
      exitAnimationDuration: environment.cmsViewConfig.exitAnimationDuration,
      data: {
        linkActivityTypeId: this.categoryModelSelected?.id,
        linkPropertyId: null,
        linkEstateUserId: null,
        linkCustomerOrderId: model.id,
        linkEstateAgencyId: null
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {

      }
    });
  }
  setStep(index: number): void {
    this.step = index;
  }

  nextStep(): void {
    this.step++;
  }

  prevStep(): void {
    this.step--;
  }
}
