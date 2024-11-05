
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  CoreSiteCategoryModel,
  CoreSiteCategoryService,
  ErrorExceptionResult, FilterDataModel, FilterModel, RecordStatusEnum, SortTypeEnum,
  WebDesignerMainPageModel,
  WebDesignerMainPageService, WebDesignerMainPageTemplateModel,
  WebDesignerMainPageTemplateService
} from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { ListBaseComponent } from 'src/app/core/cmsComponent/listBaseComponent';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { PageInfoService } from 'src/app/core/services/page-info.service';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { environment } from 'src/environments/environment';
import { WebDesignerMainPageAddComponent } from '../add/add.component';
import { WebDesignerMainPageEditComponent } from '../edit/edit.component';
@Component({
  selector: 'app-webdesigner-page-list-grid',
  templateUrl: './list-grid.component.html',
})
export class WebDesignerMainPageListGridComponent extends ListBaseComponent<WebDesignerMainPageService, WebDesignerMainPageModel, string> implements OnInit, OnDestroy {
  requestLinkPageParentGuId = '';
  requestLinkPageTemplateGuId = '';
  requestLinkPageDependencyGuId = '';
  constructorInfoAreaId = this.constructor.name;
  constructor(
    public contentService: WebDesignerMainPageService,
    private cmsToastrService: CmsToastrService,
    private cmsConfirmationDialogService: CmsConfirmationDialogService,
    private webDesignerMainPageTemplateService: WebDesignerMainPageTemplateService,
    private coreSiteCategoryService: CoreSiteCategoryService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
    public tokenHelper: TokenHelper,
    public pageInfo: PageInfoService,
    public publicHelper: PublicHelper,
    public dialog: MatDialog) {
    super(contentService, new WebDesignerMainPageModel(), publicHelper, tokenHelper, translate);
    this.publicHelper.processService.cdr = this.cdr;
    if (this.activatedRoute.snapshot.paramMap.get('LinkPageTemplateGuId')) {
      this.requestLinkPageTemplateGuId = this.activatedRoute.snapshot.paramMap.get('LinkPageTemplateGuId');
    }
    if (this.activatedRoute.snapshot.paramMap.get('LinkPageDependencyGuId')) {
      this.requestLinkPageDependencyGuId = this.activatedRoute.snapshot.paramMap.get('LinkPageDependencyGuId');
    }
    if (this.activatedRoute.snapshot.paramMap.get('LinkPageParentGuId')) {
      this.requestLinkPageParentGuId = this.activatedRoute.snapshot.paramMap.get('LinkPageParentGuId');
    }
    this.optionsSearch.parentMethods = {
      onSubmit: (model) => this.onSubmitOptionsSearch(model),
    };

    /*filter Sort*/
    this.filteModelContent.sortColumn = 'CreatedDate';
    this.filteModelContent.sortType = SortTypeEnum.Descending;
    if (this.requestLinkPageTemplateGuId.length > 0) {
      const filter = new FilterDataModel();
      filter.propertyName = 'LinkPageTemplateGuId';
      filter.value = this.requestLinkPageTemplateGuId;
      this.filteModelContent.filters.push(filter);
    }
    if (this.requestLinkPageDependencyGuId.length > 0) {
      const filter = new FilterDataModel();
      filter.propertyName = 'LinkPageDependencyGuId';
      filter.value = this.requestLinkPageDependencyGuId;
      this.filteModelContent.filters.push(filter);
    }
    if (this.requestLinkPageParentGuId.length > 0) {
      const filter = new FilterDataModel();
      filter.propertyName = 'LinkPageParentGuId';
      filter.value = this.requestLinkPageParentGuId;
      this.filteModelContent.filters.push(filter);
    }
  }

  comment: string;
  author: string;
  dataSource: any;
  flag = false;
  tableContentSelected = [];
  filteModelContent = new FilterModel();
  dataModelWebDesignerMainPageTemplateResult: ErrorExceptionResult<WebDesignerMainPageTemplateModel> = new ErrorExceptionResult<WebDesignerMainPageTemplateModel>();
  dataModelCoreSiteCategoryResult: ErrorExceptionResult<CoreSiteCategoryModel> = new ErrorExceptionResult<CoreSiteCategoryModel>();
  tabledisplayedColumns: string[] = [
    'ThumbnailImageSrc',
    'Id',
    'RecordStatus',
    'Title',
    // 'LinkPageParentGuId',
    // 'LinkPageDependencyGuId',
    'LinkPageTemplateGuId',
    'PageDependencyIsDefaultPage',
    'PageDependencyIsDefaultPageLinkSiteCategoryId',
    //'Action'
  ];
  expandedElement: WebDesignerMainPageModel | null;
  cmsApiStoreSubscribe: Subscription;

  ngOnInit(): void {
    this.filteModelContent.sortColumn = 'Title';
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
    this.getSiteCategory();
  }
  getModuleList(): void {
    const filter = new FilterModel();
    filter.rowPerPage = 100;
    this.webDesignerMainPageTemplateService.ServiceGetAll(filter).subscribe({
      next: (ret) => {
        this.dataModelWebDesignerMainPageTemplateResult = ret;
      }
    });
  }
  getSiteCategory(): void {
    const filter = new FilterModel();
    filter.rowPerPage = 100;
    this.coreSiteCategoryService.ServiceGetAll(filter).subscribe({
      next: (ret) => {
        this.dataModelCoreSiteCategoryResult = ret;
      }
    });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  DataGetAll(): void {
    this.tableRowsSelected = [];
    this.onActionTableRowSelect(new WebDesignerMainPageModel());
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });
    this.filteModelContent.accessLoad = true;
    /*filter CLone*/
    const filterModel = JSON.parse(JSON.stringify(this.filteModelContent));
    /*filter CLone*/
    this.contentService.ServiceGetAllEditor(filterModel).subscribe({
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
        SortTypeEnum
        sort.start = 'desc';
      }
    } else {
      this.filteModelContent.sortColumn = sort.active;
      this.filteModelContent.sortType = SortTypeEnum.Descending;
    } SortTypeEnum
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
    const dialogRef = this.dialog.open(WebDesignerMainPageAddComponent, {
      height: '90%',
      panelClass: panelClass,
      enterAnimationDuration: environment.cmsViewConfig.enterAnimationDuration,
      exitAnimationDuration: environment.cmsViewConfig.exitAnimationDuration,
      data: { linkPageDependencyGuId: this.requestLinkPageDependencyGuId }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }
  onActionButtonEditRow(model: WebDesignerMainPageModel = this.tableRowSelected): void {
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
    const dialogRef = this.dialog.open(WebDesignerMainPageEditComponent, {
      height: '90%',
      panelClass: panelClass,
      enterAnimationDuration: environment.cmsViewConfig.enterAnimationDuration,
      exitAnimationDuration: environment.cmsViewConfig.exitAnimationDuration,
      data: { id: this.tableRowSelected.id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }
  onActionButtonDeleteRow(model: WebDesignerMainPageModel = this.tableRowSelected): void {
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
          this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
            this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
          });
          this.contentService.ServiceDelete(this.tableRowSelected.id).subscribe({
            next: (ret) => {
              if (ret.isSuccess) {
                this.cmsToastrService.typeSuccessRemove();
                this.DataGetAll();
              } else {
                this.cmsToastrService.typeErrorRemove();
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
      }
      )
      .catch(() => {
        // console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)')
      }
      );
  }
  onActionButtonGoToSiteCategoryList(model: WebDesignerMainPageModel = this.tableRowSelected): void {
    if (!model || !model.id || model.id.length === 0) {
      this.translate.get('MESSAGE.no_row_selected_to_display').subscribe((str: string) => { this.cmsToastrService.typeErrorSelected(str); });
      return;
    }
    this.onActionTableRowSelect(model);
    this.router.navigate(['/core/siteSiteCategory/', this.tableRowSelected.id]);
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
  onActionButtonHtmlEditor(model: WebDesignerMainPageModel = this.tableRowSelected): void {
    if (!model || !model.id || model.id.length === 0) {
      this.translate.get('ERRORMESSAGE.MESSAGE.typeErrorSelectedRow').subscribe((str: string) => { this.cmsToastrService.typeErrorSelected(str); });
      return;
    }
    this.onActionTableRowSelect(model);
    if (
      this.dataModelResult == null ||
      this.dataModelResult.access == null ||
      !this.dataModelResult.access.accessWatchRow
    ) {
      this.cmsToastrService.typeErrorSelected();
      return;
    }
    // const urlTemplate = environment.cmsServerConfig.configHtmlBuilderServerPath + 'htmlbuilder/?id=' + model.id + '&token=' + encodeURIComponent(this.tokenInfo.token);
    window.open(model.htmlBuilderUrl, '_blank');
  }
  onActionButtonHtmlView(model: WebDesignerMainPageModel = this.tableRowSelected): void {
    if (!model || !model.id || model.id.length === 0) {
      this.translate.get('ERRORMESSAGE.MESSAGE.typeErrorSelectedRow').subscribe((str: string) => { this.cmsToastrService.typeErrorSelected(str); });
      return;
    }
    this.onActionTableRowSelect(model);
    if (
      this.dataModelResult == null ||
      this.dataModelResult.access == null ||
      !this.dataModelResult.access.accessWatchRow
    ) {
      this.cmsToastrService.typeErrorSelected();
      return;
    }
    window.open(this.dataModelResult.item.htmlPreviewByMasterUrl, '_blank');
  }
  onActionButtonSiteRouteView(model: WebDesignerMainPageModel = this.tableRowSelected): void {
    if (!model || !model.id || model.id.length === 0) {
      this.translate.get('ERRORMESSAGE.MESSAGE.typeErrorSelectedRow').subscribe((str: string) => { this.cmsToastrService.typeErrorSelected(str); });
      return;
    }
    this.onActionTableRowSelect(model);
    if (
      this.dataModelResult == null ||
      this.dataModelResult.access == null ||
      !this.dataModelResult.access.accessWatchRow
    ) {
      this.cmsToastrService.typeErrorSelected();
      return;
    }
    this.contentService.ServiceWebRoute(model.id).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          window.open(ret.item, '_blank');
        }
        else {
          this.cmsToastrService.typeError(ret.errorMessage);
        }
      },
      error: (err) => {
        this.cmsToastrService.typeError(err);
      }
    }
    );

  }
  onActionButtonHtmlViewWithOutParent(model: WebDesignerMainPageModel = this.tableRowSelected): void {
    if (!model || !model.id || model.id.length === 0) {
      this.translate.get('ERRORMESSAGE.MESSAGE.typeErrorSelectedRow').subscribe((str: string) => { this.cmsToastrService.typeErrorSelected(str); });
      return;
    }
    this.onActionTableRowSelect(model);
    if (
      this.dataModelResult == null ||
      this.dataModelResult.access == null ||
      !this.dataModelResult.access.accessWatchRow
    ) {
      this.cmsToastrService.typeErrorSelected();
      return;
    }
    window.open(this.dataModelResult.item.htmlPreviewUrl, '_blank');
  }



  onActionButtonReload(): void {
    this.DataGetAll();
  }
  onSubmitOptionsSearch(model: any): void {
    this.filteModelContent.filters = model;
    this.DataGetAll();
  }

  onActionBackToParentTemplate(): void {
    this.router.navigate(['/webdesigner/pagetemplate']);
  }
  onActionBackToParentDependency(): void {
    this.router.navigate(['/webdesigner/pagedependency']);
  }
}
