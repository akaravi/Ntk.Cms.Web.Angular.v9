
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  CoreModuleModel, CoreModuleService, CoreModuleSiteModel, CoreModuleSiteService, DataFieldInfoModel, ErrorExceptionResult, FilterDataModel, FilterDataModelSearchTypesEnum, FilterModel, RecordStatusEnum, SortTypeEnum, TokenInfoModel
} from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { ComponentOptionSearchModel } from 'src/app/core/cmsComponent/base/componentOptionSearchModel';
import { ComponentOptionStatistModel } from 'src/app/core/cmsComponent/base/componentOptionStatistModel';
import { ListBaseComponent } from 'src/app/core/cmsComponent/listBaseComponent';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { PageInfoService } from 'src/app/core/services/page-info.service';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { CmsSiteCreditViewComponent } from 'src/app/shared/cms-site-credit-view/cms-site-credit-view.component';
import { CmsSiteUserCreditViewComponent } from 'src/app/shared/cms-site-user-credit-view/cms-site-user-credit-view.component';
import { environment } from 'src/environments/environment';
import { CoreSiteModuleAddComponent } from '../moduleAdd/moduleAdd.component';
import { CoreSiteModuleEditComponent } from '../moduleEdit/moduleEdit.component';
@Component({
  selector: 'app-core-site-module-list',
  templateUrl: './moduleList.component.html',
})
export class CoreSiteModuleListComponent extends ListBaseComponent<CoreModuleSiteService, CoreModuleSiteModel, number>
  implements OnInit, OnDestroy {
  requestLinkSiteId = 0;
  requestLinkModuleId = 0;
  constructorInfoAreaId = this.constructor.name;
  constructor(
    public contentService: CoreModuleSiteService,
    private cmsToastrService: CmsToastrService,
    private activatedRoute: ActivatedRoute,
    private coreModuleService: CoreModuleService,
    private cmsConfirmationDialogService: CmsConfirmationDialogService,
    public tokenHelper: TokenHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
    private router: Router,
    public pageInfo: PageInfoService,
    public publicHelper: PublicHelper,
    public dialog: MatDialog,
  ) {
    super(contentService, new CoreModuleSiteModel(), publicHelper, tokenHelper, translate);
    this.publicHelper.processService.cdr = this.cdr;

    this.requestLinkSiteId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkSiteId'));
    this.requestLinkModuleId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkModuleId'));
    if (this.requestLinkSiteId > 0) {
      const filter = new FilterDataModel();
      filter.propertyName = 'LinkSiteId';
      filter.value = this.requestLinkSiteId;
      this.filteModelContent.filters.push(filter);
    }
    if (this.requestLinkModuleId > 0) {
      const filter = new FilterDataModel();
      filter.propertyName = 'LinkModuleId';
      filter.value = this.requestLinkModuleId;
      this.filteModelContent.filters.push(filter);
    }
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
  optionsSearch: ComponentOptionSearchModel = new ComponentOptionSearchModel();
  optionsStatist: ComponentOptionStatistModel = new ComponentOptionStatistModel();

  tokenInfo = new TokenInfoModel();




  dataModelCoreModuleResult: ErrorExceptionResult<CoreModuleModel> = new ErrorExceptionResult<CoreModuleModel>();

  tabledisplayedColumns: string[] = [];
  tabledisplayedColumnsSource: string[] = [
    'LinkSiteId',
    'LinkModuleId',
    'RecordStatus',
    //'virtual_CmsSite.title',
    //'virtual_CmsModule.title',
    'CreatedDate',
    // 'UpdatedDate',
    'RenewDate',
    'HasBuyed',
    'expireDate',
    // 'Action'
  ];
  tabledisplayedColumnsMobileSource: string[] = [
    // 'LinkSiteId',
    // 'LinkModuleId',
    'RecordStatus',
    //'virtual_CmsSite.title',
    //'virtual_CmsModule.title',
    'CreatedDate',
    // 'UpdatedDate',
    'RenewDate',
    'HasBuyed',
    'expireDate',
    // 'Action'
  ];

  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();



  expandedElement: CoreModuleSiteModel | null;
  cmsApiStoreSubscribe: Subscription;

  ngOnInit(): void {
    this.filteModelContent.sortColumn = 'CreatedDate';
    this.tokenHelper.getTokenInfoState().then((value) => {
      this.tokenInfo = value;
      setTimeout(() => {
        if (!this.firstLoadDataRunned)
          this.DataGetAll();
      }, 500);
    });

    this.cmsApiStoreSubscribe = this.tokenHelper.getTokenInfoStateOnChange().subscribe({
      next: (ret) => {
        this.tokenInfo = ret;
        this.firstLoadDataRunned = true;
        this.DataGetAll();
      }
    });

    this.getModuleList();
  }
  getModuleList(): void {
    const filter = new FilterModel();
    filter.rowPerPage = 100;
    this.coreModuleService.ServiceGetAllModuleName(filter).subscribe({
      next: (ret) => {
        this.dataModelCoreModuleResult = ret;
      }
    });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  DataGetAll(): void {
    this.tabledisplayedColumns = this.publicHelper.TableDisplayedColumns(this.tabledisplayedColumnsSource, this.tabledisplayedColumnsMobileSource, [], this.tokenInfo);
    this.tableRowsSelected = [];
    this.onActionTableRowSelect(new CoreModuleSiteModel());

    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });


    this.filteModelContent.accessLoad = true;
    /*filter CLone*/
    const filterModel = JSON.parse(JSON.stringify(this.filteModelContent));
    /*filter CLone*/
    this.contentService.ServiceGetAll(filterModel).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
          this.dataModelResult = ret;
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

  onActionButtonReNewModule(): void {
    this.router.navigate(['core/modulesale/serial/checklist/']);
  }
  onActionButtonNewRow(): void {
    if (
      this.dataModelResult == null ||
      this.dataModelResult.access == null ||
      !this.dataModelResult.access.accessAddRow
    ) {
      this.cmsToastrService.typeErrorAccessAdd();
      return;
    }
    var LinkSiteId = this.requestLinkSiteId;
    var LinkModuleId = this.requestLinkModuleId;
    if (LinkSiteId <= 0) {
      LinkSiteId = this.tokenInfo.siteId;
    }
    var panelClass = '';
    if (this.tokenHelper.isMobile)
      panelClass = 'dialog-fullscreen';
    else
      panelClass = 'dialog-min';
    const dialogRef = this.dialog.open(CoreSiteModuleAddComponent, {
      height: '90%',
      panelClass: panelClass,
      enterAnimationDuration: environment.cmsViewConfig.enterAnimationDuration,
      exitAnimationDuration: environment.cmsViewConfig.exitAnimationDuration,
      data: {
        linkSiteId: LinkSiteId,
        linkModuleId: LinkModuleId,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }

  onActionButtonEditRow(model: CoreModuleSiteModel = this.tableRowSelected): void {

    if (!model || !model.linkModuleId || model.linkModuleId === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    if (!model || !model.linkSiteId || model.linkSiteId === 0) {
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
    const dialogRef = this.dialog.open(CoreSiteModuleEditComponent, {
      height: '90%',
      panelClass: panelClass,
      enterAnimationDuration: environment.cmsViewConfig.enterAnimationDuration,
      exitAnimationDuration: environment.cmsViewConfig.exitAnimationDuration,
      data: {
        linkSiteId: model.linkSiteId,
        linkModuleId: model.linkModuleId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }

  onActionButtonDeleteRow(model: CoreModuleSiteModel = this.tableRowSelected): void {
    if (!model || !model.linkModuleId || model.linkModuleId === 0 || !model.linkSiteId || model.linkSiteId === 0) {
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
          this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
            this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
          });

          this.contentService.ServiceDeleteEntity(this.tableRowSelected).subscribe({
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
              this.publicHelper.processService.processStop(pName, false);
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



  onActionButtonStatist(view = !this.optionsStatist.data.show): void {
    this.optionsStatist.data.show = view;
    if (!this.optionsStatist.data.show) {
      return;
    }
    const statist = new Map<string, number>();
    this.translate.get('MESSAGE.Active').subscribe((str: string) => { statist.set(str, 0); });
    statist.set('Expired Date', 0);
    this.translate.get('MESSAGE.All').subscribe((str: string) => { statist.set(str, 0); });
    const pName = this.constructor.name + '.ServiceStatist';
    this.translate.get('MESSAGE.Get_the_statist').subscribe((str: string) => { this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId); });
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
          this.translate.get('MESSAGE.Active').subscribe((str: string) => { statist.set(str, ret.totalRowCount) });
          this.optionsStatist.childMethods.setStatistValue(statist);
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
    const filterStatist2 = JSON.parse(JSON.stringify(this.filteModelContent));
    const fastFilter2 = new FilterDataModel();
    fastFilter2.propertyName = 'expireDate';
    fastFilter2.value = new Date();
    fastFilter2.searchType = FilterDataModelSearchTypesEnum.GreaterThan;
    filterStatist2.filters.push(fastFilter2);
    this.contentService.ServiceGetCount(filterStatist2).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          statist.set('Expired Date', ret.totalRowCount);
          this.optionsStatist.childMethods.setStatistValue(statist);
        } else {
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
      },
      error: (er) => {
      }
    }
    );
  }
  onActionButtonConfigSiteRow(model: CoreModuleSiteModel = this.tableRowSelected): void {
    if (!model || !model.linkModuleId || model.linkModuleId === 0 || !model.linkSiteId || model.linkSiteId === 0) {
      this.translate.get('ERRORMESSAGE.MESSAGE.typeErrorSelectedRow').subscribe((str: string) => { this.cmsToastrService.typeErrorSelected(str); });
      return;
    }
    this.onActionTableRowSelect(model);
    this.router.navigate([model.virtual_CmsModule.className.toLowerCase() + '/config/site/', model.linkSiteId]);
  }
  onActionButtonConfigMainAdminRow(model: CoreModuleSiteModel = this.tableRowSelected): void {
    if (!model || !model.linkModuleId || model.linkModuleId === 0 || !model.linkSiteId || model.linkSiteId === 0) {
      this.translate.get('ERRORMESSAGE.MESSAGE.typeErrorSelectedRow').subscribe((str: string) => { this.cmsToastrService.typeErrorSelected(str); });
      return;
    }
    this.onActionTableRowSelect(model);
    this.router.navigate([model.virtual_CmsModule.className.toLowerCase() + '/config/mainadmin/']);
  }
  onActionButtonSiteCreditAccountRow(model: CoreModuleSiteModel = this.tableRowSelected): void {
    if (!model || !model.linkModuleId || model.linkModuleId === 0 || !model.linkSiteId || model.linkSiteId === 0) {
      this.translate.get('ERRORMESSAGE.MESSAGE.typeErrorSelectedRow').subscribe((str: string) => { this.cmsToastrService.typeErrorSelected(str); });
      return;
    }
    this.onActionTableRowSelect(model);

    const dialogRef = this.dialog.open(CmsSiteCreditViewComponent, {
      // height: '90%',
      data: {
        LinkModuleId: model.linkModuleId,
      }
    });
  }
  onActionButtonSiteUserCreditAccountRow(model: CoreModuleSiteModel = this.tableRowSelected): void {
    if (!model || !model.linkModuleId || model.linkModuleId === 0 || !model.linkSiteId || model.linkSiteId === 0) {
      this.translate.get('ERRORMESSAGE.MESSAGE.typeErrorSelectedRow').subscribe((str: string) => { this.cmsToastrService.typeErrorSelected(str); });
      return;
    }
    this.onActionTableRowSelect(model);

    const dialogRef = this.dialog.open(CmsSiteUserCreditViewComponent, {
      // height: '90%',
      data: {
        LinkModuleId: model.linkModuleId,
      }
    });
  }




  onActionButtonReload(): void {
    this.DataGetAll();
  }
  onSubmitOptionsSearch(model: any): void {
    this.filteModelContent.filters = model;
    this.DataGetAll();
  }

  onActionBackToParent(): void {
    this.router.navigate(['/core/site/']);
  }
  onActionBackToParentModuleList(): void {
    this.router.navigate(['/core/module/']);
  }

}


