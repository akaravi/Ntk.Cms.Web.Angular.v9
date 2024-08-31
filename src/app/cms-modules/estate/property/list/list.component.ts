
import {
  AfterViewInit, ChangeDetectorRef, Component,
  Input, OnDestroy, OnInit
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { PageEvent } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from '@ngx-translate/core';
import {
  ClauseTypeEnum, CoreCurrencyModel,
  EstateConfigurationService,
  EstateContractTypeModel, EstateModuleConfigSiteValuesModel,
  EstatePropertyDetailGroupModel, EstatePropertyDetailGroupService, EstatePropertyDetailValueModel, EstatePropertyFilterModel, EstatePropertyModel, EstatePropertyService, EstatePropertyTypeLanduseModel, EstatePropertyTypeUsageModel, FilterDataModel, FilterModel, InputDataTypeEnum, ManageUserAccessDataTypesEnum, RecordStatusEnum, SortTypeEnum
} from "ntk-cms-api";
import { Subscription, forkJoin } from "rxjs";
import { ListBaseComponent } from "src/app/core/cmsComponent/listBaseComponent";
import { PublicHelper } from "src/app/core/helpers/publicHelper";
import { TokenHelper } from "src/app/core/helpers/tokenHelper";
import { CmsToastrService } from "src/app/core/services/cmsToastr.service";
import { PageInfoService } from "src/app/core/services/page-info.service";
import { CmsConfirmationDialogService } from "src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service";
import { CmsLinkToComponent } from "src/app/shared/cms-link-to/cms-link-to.component";
import { environment } from "src/environments/environment";
import { EstatePropertyHistoryAddComponent } from "../../property-history/add/add.component";
import { EstatePropertyQuickAddComponent } from "../quick-add/quick-add.component";
import { EstatePropertyQuickViewComponent } from "../quick-view/quick-view.component";


@Component({
  selector: "app-estate-property-list",
  templateUrl: "./list.component.html",
})
export class EstatePropertyListComponent extends ListBaseComponent<EstatePropertyService, EstatePropertyModel, string>
  implements OnInit, OnDestroy, AfterViewInit {
  requestLinkPropertyTypeLanduseId = "";
  requestLinkPropertyTypeUsageId = "";
  requestLinkContractTypeId = "";
  requestLinkBillboardId = "";
  requestLinkCustomerOrderId = "";
  requestLinkCustomerOrderIdHaveHistory = "";
  requestLinkProjectId = "";
  requestLinkCompanyId = "";
  requestLinkEstateUserId = "";
  requestLinkEstateAgencyId = "";
  requestLinkUserId = 0;
  requestInChecking = false;
  requestAction = '';
  constructorInfoAreaId = this.constructor.name;
  constructor(
    public contentService: EstatePropertyService,
    private configService: EstateConfigurationService,

    private activatedRoute: ActivatedRoute,
    public publicHelper: PublicHelper,
    private cmsToastrService: CmsToastrService,
    private cmsConfirmationDialogService: CmsConfirmationDialogService,
    public estatePropertyDetailGroupService: EstatePropertyDetailGroupService,
    public tokenHelper: TokenHelper,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    public translate: TranslateService,
    public pageInfo: PageInfoService,
  ) {
    super(contentService, new EstatePropertyModel(), publicHelper, tokenHelper, translate);
    this.publicHelper.processService.cdr = this.cdr;

    this.requestLinkPropertyTypeLanduseId =
      this.activatedRoute.snapshot.paramMap.get("LinkPropertyTypeLanduseId");
    this.requestLinkPropertyTypeUsageId =
      this.activatedRoute.snapshot.paramMap.get("LinkPropertyTypeUsageId");
    this.requestLinkContractTypeId =
      this.activatedRoute.snapshot.paramMap.get("LinkContractTypeId");
    this.requestLinkBillboardId =
      this.activatedRoute.snapshot.paramMap.get("LinkBillboardId");
    this.requestLinkCustomerOrderId = this.activatedRoute.snapshot.paramMap.get(
      "LinkCustomerOrderId"
    );
    this.requestLinkProjectId = this.activatedRoute.snapshot.paramMap.get(
      "LinkProjectId"
    );
    this.requestLinkCompanyId = this.activatedRoute.snapshot.paramMap.get(
      "LinkCompanyId"
    );
    this.requestLinkEstateUserId = this.activatedRoute.snapshot.paramMap.get(
      "LinkEstateUserId"
    );
    this.requestLinkEstateAgencyId = this.activatedRoute.snapshot.paramMap.get(
      "LinkEstateAgencyId"
    );
    this.requestLinkUserId = +this.activatedRoute.snapshot.paramMap.get(
      "LinkUserId"
    ) | 0;
    this.requestAction = this.activatedRoute.snapshot.paramMap.get("Action");
    if (this.activatedRoute.snapshot.paramMap.get("InChecking")) {
      this.searchInChecking =
        this.activatedRoute.snapshot.paramMap.get("InChecking") === "true";
    }
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
    this.filteModelContent.sortColumn = "CreatedDate";
    this.filteModelContent.sortType = SortTypeEnum.Descending;
    if (
      this.requestLinkPropertyTypeLanduseId &&
      this.requestLinkPropertyTypeLanduseId.length > 0
    ) {
      const filter = new FilterDataModel();
      filter.propertyName = "LinkPropertyTypeLanduseId";
      filter.value = this.requestLinkPropertyTypeLanduseId;
      this.filteModelContent.filters.push(filter);
    }
    if (
      this.requestLinkPropertyTypeUsageId &&
      this.requestLinkPropertyTypeUsageId.length > 0
    ) {
      const filter = new FilterDataModel();
      filter.propertyName = "LinkPropertyTypeUsageId";
      filter.value = this.requestLinkPropertyTypeUsageId;
      this.filteModelContent.filters.push(filter);
    }
    if (
      this.requestLinkContractTypeId &&
      this.requestLinkContractTypeId.length > 0
    ) {
      const filter = new FilterDataModel();
      filter.propertyName = "Contracts";
      filter.propertyAnyName = "LinkEstateContractTypeId";
      filter.value = this.requestLinkContractTypeId;
      this.filteModelContent.filters.push(filter);
    }
    if (this.requestLinkUserId && this.requestLinkUserId > 0) {
      const filter = new FilterDataModel();
      filter.propertyName = "linkCmsUserId";
      filter.value = this.requestLinkUserId;
      this.filteModelContent.filters.push(filter);
    }
    if (this.requestLinkProjectId && this.requestLinkProjectId.length > 0) {
      const filter = new FilterDataModel();
      filter.propertyName = "linkPropertyProjectId";
      filter.value = this.requestLinkProjectId;
      this.filteModelContent.filters.push(filter);
    }
    if (this.requestLinkCompanyId && this.requestLinkCompanyId.length > 0) {
      const filter = new FilterDataModel();
      filter.propertyName = "linkPropertyCompanyId";
      filter.value = this.requestLinkCompanyId;
      this.filteModelContent.filters.push(filter);
    }
    if (this.requestLinkEstateUserId && this.requestLinkEstateUserId.length > 0) {
      const filter = new FilterDataModel();
      filter.propertyName = "linkEstateUserId";
      filter.value = this.requestLinkEstateUserId;
      this.filteModelContent.filters.push(filter);
    }
    if (this.requestLinkEstateAgencyId && this.requestLinkEstateAgencyId.length > 0) {
      const filter = new FilterDataModel();
      filter.propertyName = "linkEstateAgencyId";
      filter.value = this.requestLinkEstateAgencyId;
      this.filteModelContent.filters.push(filter);
    }
  }
  @Input() optionloadComponent = true;
  @Input() optionloadByRoute = true;
  @Input() optionsortType = SortTypeEnum.Descending;


  @Input() set optionLinkCustomerOrderId(id: string) {
    if (id && id.length > 0) {
      this.requestLinkCustomerOrderId = id;
    }
  }
  @Input() set optionLinkCustomerOrderIdHaveHistory(id: string) {
    if (id && id.length > 0) {
      this.requestLinkCustomerOrderIdHaveHistory = id;
    }
  }
  @Input() set optionLinkBillboardId(id: string) {
    if (id && id.length > 0) {
      this.requestLinkBillboardId = id;
    }
  }
  // SubjectTitle : string

  responsibleUserId = 0;
  link: string;
  comment: string;
  author: string;
  dataSource: any;
  flag = false;
  tablePropertySelected = [];
  searchInChecking = false;
  searchInCheckingChecked = false;
  searchInResponsible = false;
  searchInResponsibleChecked = false;
  filteModelContent = new EstatePropertyFilterModel();
  dataModelPropertyDetailGroups: EstatePropertyDetailGroupModel[] = [];
  dataConfigSiteValuesModel = new EstateModuleConfigSiteValuesModel();

  categoryModelSelected: EstatePropertyTypeLanduseModel;
  tabledisplayedColumns: string[] = [];
  tabledisplayedColumnsSource: string[] = [
    "LinkMainImageIdSrc",
    "Id",
    "RecordStatus",
    "MainAdminRecordStatus",
    "IsSoldIt",
    "ViewConfigHiddenInList",
    "LinkSiteId",
    "AdsActive",
    "ViewCount",
    "caseCode",
    "scoreEstateLocation",
    "scoreEstateBuild",
    "scoreEstatePrice",
    "CreatedDate",
    "UpdatedDate",
    "LinkTo",
    "QuickView",
    'action_menu',
  ];
  tabledisplayedColumnsMobileSource: string[] = [
    "LinkMainImageIdSrc",
    // "Id",
    // "RecordStatus",
    // "MainAdminRecordStatus",
    "IsSoldIt",
    // "ViewConfigHiddenInList",
    // "LinkSiteId",
    // "AdsActive",
    // "ViewCount",
    "caseCode",
    // "scoreEstateLocation",
    // "scoreEstateBuild",
    // "scoreEstatePrice",
    // "CreatedDate",
    // "UpdatedDate",
    "LinkTo",
    "QuickView",
    'action_menu',
  ];

  propertyDetails: Map<string, string> = new Map<string, string>();
  enumInputDataType = InputDataTypeEnum;
  // ** Accardon */
  step = 0;
  cmsApiStoreSubscribe: Subscription;
  ngOnInit(): void {
    this.tokenHelper.getTokenInfoState().then((value) => {
      this.tokenInfo = value;
      this.GetServiceSiteConfig(this.tokenHelper.tokenInfo.siteId);

      this.DataGetAll();
      this.tokenHelper.CheckIsAdmin();
      if (!this.tokenHelper.isAdminSite && !this.tokenHelper.isSupportSite) {
        this.tabledisplayedColumnsSource = this.publicHelper.listRemoveIfExist(this.tabledisplayedColumnsSource, 'scoreEstateLocation');
        this.tabledisplayedColumnsSource = this.publicHelper.listRemoveIfExist(this.tabledisplayedColumnsSource, 'scoreEstateBuild');
        this.tabledisplayedColumnsSource = this.publicHelper.listRemoveIfExist(this.tabledisplayedColumnsSource, 'scoreEstatePrice');
      }
    });
    this.tokenInfo.direction
    this.cmsApiStoreSubscribe = this.tokenHelper
      .getTokenInfoStateOnChange()
      .subscribe({
        next: (ret) => {
          this.tokenInfo = ret;
          this.GetServiceSiteConfig(this.tokenHelper.tokenInfo.siteId);
          this.DataGetAll();
          this.tokenHelper.CheckIsAdmin();
          if (!this.tokenHelper.isAdminSite && !this.tokenHelper.isSupportSite) {
            this.tabledisplayedColumnsSource = this.publicHelper.listRemoveIfExist(this.tabledisplayedColumnsSource, 'scoreEstateLocation');
            this.tabledisplayedColumnsSource = this.publicHelper.listRemoveIfExist(this.tabledisplayedColumnsSource, 'scoreEstateBuild');
            this.tabledisplayedColumnsSource = this.publicHelper.listRemoveIfExist(this.tabledisplayedColumnsSource, 'scoreEstatePrice');
          }
        }
      });

  }

  ngAfterViewInit(): void {
    if (this.searchInChecking) {
      this.searchInCheckingChecked = true;
    }
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  GetServiceSiteConfig(SiteId: number): void {
    const pName = this.constructor.name + 'ServiceSiteConfig';
    this.translate.get('MESSAGE.get_module_setting').subscribe((str: string) => { this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId); });
    this.configService
      .ServiceSiteConfig(SiteId)
      .subscribe({
        next: (ret) => {
          if (ret.isSuccess) {
            this.dataConfigSiteValuesModel = ret.item;
            this.RowStyleActiveData();
          } else {
            this.cmsToastrService.typeErrorGetOne(ret.errorMessage);
          }
          this.publicHelper.processService.processStop(pName);
        },
        error: (er) => {
          this.cmsToastrService.typeErrorGetOne(er);
          this.publicHelper.processService.processStop(pName, false);
        }
      }
      );
  }

  DataGetAll(): void {

    this.publicHelper.themeService.onActionScrollTopList(true, 10000);
    this.tabledisplayedColumns = this.publicHelper.TableDisplayedColumns(this.tabledisplayedColumnsSource, this.tabledisplayedColumnsMobileSource, [], this.tokenInfo);
    if (!this.optionloadComponent) {
      return;
    }
    var setResponsibleUserId = 0;
    if (this.searchInResponsible) {
      setResponsibleUserId = this.tokenInfo.userId;
    } else if (this.responsibleUserId > 0) {
      setResponsibleUserId = this.responsibleUserId;
    }
    if (this.optionsortType) {
      this.filteModelContent.sortType = this.optionsortType;
    }

    this.tableRowsSelected = [];

    this.onActionTableRowSelect(new EstatePropertyModel());
    const pName = this.constructor.name + "main";
    this.translate.get('MESSAGE.get_information_list').subscribe((str: string) => { this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId); });
    this.filteModelContent.accessLoad = true;
    /*filter CLone*/
    const filterModel = JSON.parse(JSON.stringify(this.filteModelContent));
    /*filter CLone*/
    if (
      this.categoryModelSelected &&
      this.categoryModelSelected.id &&
      this.categoryModelSelected.id.length > 0
    ) {
      const filter = new FilterDataModel();
      filter.propertyName = "LinkPropertyTypeLanduseId";
      filter.value = this.categoryModelSelected.id;
      filterModel.filters.push(filter);
    }
    if (this.searchInChecking) {
      const filter1 = new FilterDataModel();
      filter1.propertyName = "RecordStatus";
      filter1.value = RecordStatusEnum.Pending;
      //filter1.searchType = FilterDataModelSearchTypesEnum.NotEqual;
      filterModel.filters.push(filter1);
      // const filter2 = new FilterDataModel();
      // filter2.propertyName = "RecordStatus";
      // filter2.value = RecordStatusEnum.DeniedConfirmed;
      // filter2.searchType = FilterDataModelSearchTypesEnum.NotEqual;
      // filterModel.filters.push(filter2);
    }

    if (setResponsibleUserId > 0) {
      /** ResponsibleUserId  */
      this.contentService.ServiceGetAllWithResponsibleUserId(setResponsibleUserId, filterModel).subscribe({
        next: (ret) => {
          this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
          if (ret.isSuccess) {
            this.dataModelResult = ret;
            this.RowStyleActiveData();
            this.tableSource.data = ret.listItems;

            if (this.optionsStatist?.data?.show)
              this.onActionButtonStatist(true);
            setTimeout(() => {
              if (this.optionsSearch.childMethods)
                this.optionsSearch.childMethods.setAccess(ret.access);
            }, 1000);
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
    } else if (this.requestLinkBillboardId && this.requestLinkBillboardId.length > 0) {
      // ** */
      this.actionbuttonExportOn = false;
      this.contentService.setAccessDataType(ManageUserAccessDataTypesEnum.Editor);
      this.contentService
        .ServiceGetAllWithCoverBillboardId(this.requestLinkBillboardId, filterModel)
        .subscribe({
          next: (ret) => {
            this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
            if (ret.isSuccess) {
              this.dataModelResult = ret;
              this.RowStyleActiveData();
              this.tableSource.data = ret.listItems;
              if (this.optionsStatist?.data?.show)
                this.onActionButtonStatist(true);
              setTimeout(() => {
                if (this.optionsSearch.childMethods)
                  this.optionsSearch.childMethods.setAccess(ret.access);
              }, 1000);
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
    } else if (
      this.requestLinkCustomerOrderId && this.requestLinkCustomerOrderId.length > 0
    ) {
      // **requestLinkCustomerOrderId*/
      this.actionbuttonExportOn = false;
      this.contentService.setAccessDataType(ManageUserAccessDataTypesEnum.Editor);
      this.contentService
        .ServiceGetAllWithCoverCustomerOrderId(
          this.requestLinkCustomerOrderId,
          filterModel
        )
        .subscribe({
          next: (ret) => {
            this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
            if (ret.isSuccess) {
              this.dataModelResult = ret;
              this.RowStyleActiveData();
              this.tableSource.data = ret.listItems;
              if (this.optionsStatist?.data?.show)
                this.onActionButtonStatist(true);
              setTimeout(() => {
                if (this.optionsSearch.childMethods)
                  this.optionsSearch.childMethods.setAccess(ret.access);
              }, 1000);
            } else {
              this.cmsToastrService.typeErrorGetAll(ret.errorMessage);
            }
            this.publicHelper.processService.processStop(pName);
          },
          error: (er) => {
            this.cmsToastrService.typeError(er)
            this.publicHelper.processService.processStop(pName);
          }
        }
        );
      // **requestLinkCustomerOrderId*/
    } else if (
      this.requestLinkCustomerOrderIdHaveHistory && this.requestLinkCustomerOrderIdHaveHistory.length > 0
    ) {
      // **requestLinkCustomerOrderIdHaveHistory*/
      this.actionbuttonExportOn = false;
      this.contentService.setAccessDataType(ManageUserAccessDataTypesEnum.Editor);
      this.contentService
        .ServiceGetAllWithCoverCustomerOrderIdHaveHistory(
          this.requestLinkCustomerOrderIdHaveHistory,
          filterModel
        )
        .subscribe({
          next: (ret) => {
            this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
            if (ret.isSuccess) {
              this.dataModelResult = ret;
              this.RowStyleActiveData();
              this.tableSource.data = ret.listItems;
              if (this.optionsStatist?.data?.show)
                this.onActionButtonStatist(true);
              setTimeout(() => {
                if (this.optionsSearch.childMethods)
                  this.optionsSearch.childMethods.setAccess(ret.access);
              }, 1000);
            } else {
              this.cmsToastrService.typeErrorGetAll(ret.errorMessage);
            }
            this.publicHelper.processService.processStop(pName);
          },
          error: (er) => {
            this.cmsToastrService.typeError(er)
            this.publicHelper.processService.processStop(pName);
          }
        }
        );
      // **requestLinkCustomerOrderIdHaveHistory*/
    } else {
      // ** */
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
          this.actionbuttonExportOn = true;
          this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);

          if (ret.isSuccess) {
            this.dataModelResult = ret;
            this.RowStyleActiveData();
            this.tableSource.data = ret.listItems;
            if (this.requestAction?.length > 0 && this.requestAction === "quick-add") {
              this.requestAction = '';
              this.onActionButtonQuickAddRow();
            }
            if (this.optionsSearch.data.show && this.optionsStatist.data.show) {
              this.optionsStatist.data.show = !this.optionsStatist.data.show
              this.onActionButtonStatist();
            }

            if (this.optionsStatist?.data?.show)
              this.onActionButtonStatist(true);
            setTimeout(() => {
              if (this.optionsSearch.childMethods)
                this.optionsSearch.childMethods.setAccess(ret.access);
            }, 1000);
          } else {
            this.cmsToastrService.typeErrorGetAll(ret.errorMessage);
          }
          this.publicHelper.processService.processStop(pName);
        },
        error: (er) => {
          this.cmsToastrService.typeError(er);
          this.publicHelper.processService.processStop(pName, false);
        }
      }
      );
      //** */
    }
  }
  DataGetPropertyDetailGroup(id: string): void {
    const filteModelProperty = new FilterModel();
    const filter = new FilterDataModel();
    filter.propertyName = 'LinkPropertyTypeLanduseId';
    filter.value = id;
    filteModelProperty.filters.push(filter);
    this.dataModelPropertyDetailGroups = [];
    const pName = this.constructor.name + 'DataGetPropertyDetailGroup';
    this.translate.get('MESSAGE.Get_detailed_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });
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
        sort.start = "asc";
        this.filteModelContent.sortColumn = "";
        this.filteModelContent.sortType = SortTypeEnum.Ascending;
      } else {
        sort.start = "desc";
      }
    } else {
      this.filteModelContent.sortColumn = sort.active;
      this.filteModelContent.sortType = SortTypeEnum.Descending;
    }
    if (this.filteModelContent.sortColumn == "AdsActive")
      this.filteModelContent.sortColumn = "AdsExpireDate";
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
      this.categoryModelSelected == null &&
      this.categoryModelSelected &&
      this.categoryModelSelected.id &&
      this.categoryModelSelected.id.length === 0 &&
      (this.requestLinkPropertyTypeLanduseId == null ||
        this.requestLinkPropertyTypeLanduseId.length === 0)
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
    let parentId: string = this.requestLinkPropertyTypeLanduseId;
    if (
      this.categoryModelSelected &&
      this.categoryModelSelected.id.length > 0
    ) {
      parentId = this.categoryModelSelected.id;
    }
    if (parentId && parentId.length > 0) {
      if (event?.ctrlKey) {
        this.link = "/#/estate/property/add/LinkPropertyTypeLanduseId/" + parentId;
        window.open(this.link, "_blank");
      } else {
        this.router.navigate(["/estate/property/add/LinkPropertyTypeLanduseId",
          parentId,]);
      }
    } else {
      if (event?.ctrlKey) {
        this.link = "/#/estate/property/add/";
        window.open(this.link, "_blank");
      } else {
        this.router.navigate(["/estate/property/add"]);
      }
    }
  }

  onActionSelectorSelect(model: EstatePropertyTypeLanduseModel | null): void {
    /*filter */
    var sortColumn = this.filteModelContent.sortColumn;
    var sortType = this.filteModelContent.sortType;
    this.filteModelContent = new EstatePropertyFilterModel();
    this.filteModelContent.sortColumn = sortColumn;
    this.filteModelContent.sortType = sortType;
    /*filter */
    this.categoryModelSelected = model;
    this.DataGetAll();
  }

  onActionButtonEditRow(
    mode: EstatePropertyModel = this.tableRowSelected, event?: MouseEvent
  ): void {
    if (!mode || !mode.id || mode.id.length === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    this.tableRowSelected = mode;

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
      this.link = "/#/estate/property/edit/" + this.tableRowSelected.id;
      window.open(this.link, "_blank");
    } else {
      this.router.navigate(["/estate/property/edit", this.tableRowSelected.id]);
    }
  }

  onActionButtonQuickViewRow(model: EstatePropertyModel = this.tableRowSelected): void {
    if (!model || !model.id || model.id.length === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    this.tableRowSelected = model;

    //this.onActionTableRowSelect(model);
    if (
      this.dataModelResult == null ||
      this.dataModelResult.access == null ||
      !this.dataModelResult.access.accessWatchRow
    ) {
      this.cmsToastrService.typeErrorAccessWatch();
      return;
    }
    var nextItem = this.publicHelper.InfoNextRowInList(this.dataModelResult.listItems, this.tableRowSelected);
    var perviousItem = this.publicHelper.InfoPerviousRowInList(this.dataModelResult.listItems, this.tableRowSelected);
    var panelClass = '';
    if (this.tokenHelper.isMobile)
      panelClass = 'dialog-fullscreen';
    else
      panelClass = 'dialog-min';
    const dialogRef = this.dialog.open(EstatePropertyQuickViewComponent, {
      height: '90%',
      panelClass: panelClass,
      //enterAnimationDuration: environment.cmsViewConfig.enterAnimationDuration,
      //exitAnimationDuration: environment.cmsViewConfig.exitAnimationDuration,
      data: {
        id: this.tableRowSelected.id,
        perviousItem: perviousItem,
        nextItem: nextItem
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate && result.onActionOpenItem && result.onActionOpenItem.id.length > 0) {
        this.onActionButtonQuickViewRow(result.onActionOpenItem)
      }
    });
  }


  onActionButtonQuickAddRow(event?: MouseEvent): void {
    if (
      this.dataModelResult == null ||
      this.dataModelResult.access == null ||
      !this.dataModelResult.access.accessAddRow
    ) {
      this.cmsToastrService.typeErrorAccessAdd();
      return;
    }
    if (event?.ctrlKey) {
      this.link = "/#/estate/property/add/";
      window.open(this.link, "_blank");
    }


    var panelClass = '';
    if (this.tokenHelper.isMobile)
      panelClass = 'dialog-fullscreen';
    else
      panelClass = 'dialog-min';
    const dialogRef = this.dialog.open(EstatePropertyQuickAddComponent, {
      height: '90%',
      enterAnimationDuration: environment.cmsViewConfig.enterAnimationDuration,
      exitAnimationDuration: environment.cmsViewConfig.exitAnimationDuration,
      panelClass: panelClass,

      data: {

      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }


  onActionButtonQuickHistoryAddRow(model: EstatePropertyModel = this.tableRowSelected): void {
    if (!model || !model.id || model.id.length === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    this.tableRowSelected = model;

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
        linkActivityTypeId: null,
        linkPropertyId: model.id,
        linkEstateUserId: null,
        linkCustomerOrderId: null,
        linkEstateAgencyId: null,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {

      }
    });
  }

  onActionButtonAdsRow(
    mode: EstatePropertyModel = this.tableRowSelected, event?: MouseEvent
  ): void {
    if (!mode || !mode.id || mode.id.length === 0) {
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

    if (event?.ctrlKey) {
      this.link = "/#/estate/property-ads/LinkPropertyId/" + this.tableRowSelected.id;
      window.open(this.link, "_blank");
    } else {
      this.router.navigate(["/estate/property-ads/LinkPropertyId", this.tableRowSelected.id]);
    }
  }
  onActionButtonHistoryRow(
    mode: EstatePropertyModel = this.tableRowSelected, event?: MouseEvent
  ): void {
    if (!mode || !mode.id || mode.id.length === 0) {
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

    if (event?.ctrlKey) {
      this.link = "/#/estate/property-history/LinkPropertyId/" + this.tableRowSelected.id;
      window.open(this.link, "_blank");
    } else {
      this.router.navigate(["/estate/property-history/LinkPropertyId", this.tableRowSelected.id]);
    }
  }



  onActionButtonDeleteRow(
    mode: EstatePropertyModel = this.tableRowSelected
  ): void {

    if (mode == null || !mode.id || mode.id.length === 0) {
      this.cmsToastrService.typeErrorDeleteRowIsNull();
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
          const pName = this.constructor.name + "main";
          this.translate.get('MESSAGE.Deleting_information').subscribe((str: string) => {
            this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
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
              }
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
    this.publicHelper.processService.processStart(this.constructor.name + 'All', this.translate.instant('MESSAGE.property_list'), this.constructorInfoAreaId);
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
    fastfilter2.value = RecordStatusEnum.Disable;
    filterStatist2.filters.push(fastfilter2);
    const s2 = this.contentService.ServiceGetCount(filterStatist2);
    //*filter */
    const filterStatist3 = JSON.parse(JSON.stringify(this.filteModelContent));
    const fastfilter3 = new FilterDataModel();
    fastfilter3.propertyName = 'RecordStatus';
    fastfilter3.value = RecordStatusEnum.Pending;
    filterStatist3.filters.push(fastfilter3);
    const s3 = this.contentService.ServiceGetCount(filterStatist3);


    forkJoin([s0, s1, s2, s3]).subscribe(results => {
      //*results */
      var ret = results[0];
      if (ret.isSuccess) {
        statist.set(this.translate.instant('TITLE.All'), ret.totalRowCount);
      } else {
        this.cmsToastrService.typeErrorMessage(ret.errorMessage);
      }

      //*results */
      var ret = results[1];
      if (ret.isSuccess) {
        statist.set(this.translate.instant('TITLE.Number_of_rows_in_the_recordstatus_available'), ret.totalRowCount);
      } else {
        this.cmsToastrService.typeErrorMessage(ret.errorMessage);
      }
      //*results */
      ret = results[2];

      if (ret.isSuccess) {
        statist.set(this.translate.instant('TITLE.Number_of_rows_in_the_recordstatus_disable'), ret.totalRowCount);
      } else {
        this.cmsToastrService.typeErrorMessage(ret.errorMessage);
      }
      //*results */
      ret = results[3];

      if (ret.isSuccess) {
        statist.set(this.translate.instant('TITLE.Number_of_rows_in_the_recordstatus_pending'), ret.totalRowCount);
      } else {
        this.cmsToastrService.typeErrorMessage(ret.errorMessage);
      }
      this.optionsStatist.childMethods.setStatistValue(statist);
      this.publicHelper.processService.processStop(this.constructor.name + 'All');
    });

  }
  onActionButtonActionSendSmsToCustomerOrder(model: EstatePropertyModel = this.tableRowSelected): void {
    if (!model || !model.id || model.id.length === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    this.tableRowSelected = model;

    const pName = this.constructor.name + "main";
    this.translate.get('ACTION.ActionSendSmsToCustomerOrder').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });
    // ** */
    this.contentService.setAccessDataType(ManageUserAccessDataTypesEnum.Editor);
    this.contentService
      .ServiceActionSendSmsToCustomerOrder(model.id)
      .subscribe({
        next: (ret) => {
          if (ret.isSuccess) {
            this.cmsToastrService.typeSuccessMessage(ret.errorMessage);
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
    // ** */
  }
  onActionButtonViewOtherUserAdvertise(model: EstatePropertyModel = this.tableRowSelected): void {
    if (!model || !model.id || model.id.length === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    this.tableRowSelected = model;

    if (model.linkCmsUserId && model.linkCmsUserId > 0)
      this.requestLinkUserId = model.linkCmsUserId;
    else
      this.requestLinkUserId = model.createdBy;

    if (model.linkCmsUserId && model.linkCmsUserId > 0) {
      const filter = new FilterDataModel();
      filter.propertyName = "linkCmsUserId";
      filter.value = model.linkCmsUserId;
      filter.clauseType = ClauseTypeEnum.Or
      this.filteModelContent.filters.push(filter);

      const filter2 = new FilterDataModel();
      filter2.propertyName = "createdBy";
      filter2.value = model.linkCmsUserId;
      filter2.clauseType = ClauseTypeEnum.Or
      this.filteModelContent.filters.push(filter);
    }
    if (model.createdBy && model.createdBy > 0) {
      const filter = new FilterDataModel();
      filter.propertyName = "linkCmsUserId";
      filter.value = model.createdBy;
      filter.clauseType = ClauseTypeEnum.Or
      this.filteModelContent.filters.push(filter);

      const filter2 = new FilterDataModel();
      filter2.propertyName = "createdBy";
      filter2.value = model.createdBy;
      filter2.clauseType = ClauseTypeEnum.Or
      this.filteModelContent.filters.push(filter);
    }
    this.DataGetAll();
  }



  actionbuttonExportOn = false;


  onActionButtonInChecking(model: boolean): void {
    this.searchInChecking = model;
    this.DataGetAll();
  }

  onActionButtonInResponsible(model: boolean): void {
    this.searchInResponsible = model;
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

  onActionBackToParent(): void {
    this.router.navigate(["/ticketing/departemen/"]);
  }
  onActionButtonLinkTo(
    model: EstatePropertyModel = this.tableRowSelected
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
    this.translate.get('MESSAGE.get_state_information').subscribe((str: string) => { this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId); });
    this.contentService.setAccessDataType(ManageUserAccessDataTypesEnum.Editor);
    this.contentService
      .ServiceGetOneById(model.id)
      .subscribe({
        next: (ret) => {
          if (ret.isSuccess) {
            //open popup
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
            //open popup
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
  expandedElement: any;




  setStep(index: number): void {
    this.step = index;
  }

  nextStep(): void {
    this.step++;
  }

  prevStep(): void {
    this.step--;
  }
  onSearchCaseCodeChange(caseCode: string) {
    if (caseCode && caseCode.length > 0) {
      this.filteModelContent = new EstatePropertyFilterModel();
      this.filteModelContent.caseCode = caseCode;
      this.dataModelPropertyDetailGroups = [];
    }
  }
  RowStyleActiveData(): void {
    if (!this.dataModelResult.listItems || this.dataModelResult.listItems.length === 0 || !this.dataConfigSiteValuesModel || this.dataConfigSiteValuesModel.autoArchiveDataDay <= 0) {
      return;
    }
    var dateTime = new Date();
    dateTime.setDate(dateTime.getDate() - this.dataConfigSiteValuesModel.autoArchiveDataDay);

    for (let index = 0; index < this.dataModelResult.listItems.length; index++) {
      const element = this.dataModelResult.listItems[index];
      this.dataModelResult.listItems[index]['ActiveDataStyle'] = '';
      this.dataModelResult.listItems[index]['ActiveDataText'] = '';

      if (element.updatedDate) {
        if (new Date(element.updatedDate) < dateTime) {
          this.dataModelResult.listItems[index]['ActiveDataStyle'] = '#ff9c91';
          this.dataModelResult.listItems[index]['ActiveDataText'] = 'آرشیو خودکار  سیستمی';
        }
      }
      else if (new Date(element.createdDate) < dateTime) {
        this.dataModelResult.listItems[index]['ActiveDataStyle'] = '#ff9c01';
        this.dataModelResult.listItems[index]['ActiveDataText'] = 'آرشیو خودکار  سیستمی';
      }
    }

  }
}
