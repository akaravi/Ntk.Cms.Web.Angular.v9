
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  CatalogCategoryModel,
  CatalogContentModel,
  CatalogContentService, ClauseTypeEnum, DataFieldInfoModel, RecordStatusEnum,
  SortTypeEnum,
  ErrorExceptionResult,
  FilterDataModel,
  FilterModel, TokenInfoModel
} from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { ComponentOptionSearchModel } from 'src/app/core/cmsComponent/base/componentOptionSearchModel';
import { ComponentOptionStatistModel } from 'src/app/core/cmsComponent/base/componentOptionStatistModel';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsExportEntityComponent } from 'src/app/shared/cms-export-entity/cms-export-entity.component';
import { CmsExportListComponent } from 'src/app/shared/cms-export-list/cmsExportList.component';
import { CmsLinkToComponent } from 'src/app/shared/cms-link-to/cms-link-to.component';
import { PublicHelper } from '../../../../core/helpers/publicHelper';
import { ProgressSpinnerModel } from '../../../../core/models/progressSpinnerModel';
import { CmsToastrService } from '../../../../core/services/cmsToastr.service';
import { CatalogContentDeleteComponent } from '../delete/delete.component';
import { environment } from 'src/environments/environment';
import { PageInfoService } from 'src/app/core/services/page-info.service';
import { ListBaseComponent } from 'src/app/core/cmsComponent/listBaseComponent';

@Component({
  selector: 'app-catalog-content-list',
  templateUrl: './list.component.html',
  styleUrls: ["./list.component.scss"],
})
export class CatalogContentListComponent extends ListBaseComponent<CatalogContentService, CatalogContentModel, string>
  implements OnInit, OnDestroy {

  constructor(
    public contentService: CatalogContentService,
    private cmsToastrService: CmsToastrService,
    private tokenHelper: TokenHelper,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
    public pageInfo: PageInfoService,
    public publicHelper: PublicHelper,
    public dialog: MatDialog,
  ) {
    super(contentService, new CatalogContentModel(), pageInfo, publicHelper, dialog);
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    // this.optionsCategoryTree.parentMethods = {
    //   onActionSelect: (x) => this.onActionSelectorSelect(x),
    // };

    this.optionsSearch.parentMethods = {
      onSubmit: (model) => this.onSubmitOptionsSearch(model),
    };

    /*filter Sort*/
    this.filteModelContent.sortColumn = 'Id';
    this.filteModelContent.sortType = SortTypeEnum.Descending;

  }
  filteModelContent = new FilterModel();
  categoryModelSelected: CatalogCategoryModel;
  dataModelResult: ErrorExceptionResult<CatalogContentModel> = new ErrorExceptionResult<CatalogContentModel>();

  optionsSearch: ComponentOptionSearchModel = new ComponentOptionSearchModel();
  optionsStatist: ComponentOptionStatistModel = new ComponentOptionStatistModel();

  tokenInfo = new TokenInfoModel();
  loading = new ProgressSpinnerModel();
  tableRowsSelected: Array<CatalogContentModel> = [];
  tableRowSelected: CatalogContentModel = new CatalogContentModel();
  tableSource: MatTableDataSource<CatalogContentModel> = new MatTableDataSource<CatalogContentModel>();
  tabledisplayedColumns: string[] = [];
  tabledisplayedColumnsSource: string[] = [
    'LinkMainImageIdSrc',
    'Id',
    'RecordStatus',
    'Title',
    'CreatedDate',
    'UpdatedDate',
    // 'Action',
    "LinkTo",
  ];
  


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
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  DataGetAll(): void {
    this.tabledisplayedColumns = this.publicHelper.TabledisplayedColumnsCheckByAllDataAccess(this.tabledisplayedColumnsSource, [], this.tokenInfo);
    this.tableRowsSelected = [];
    this.onActionTableRowSelect(new CatalogContentModel());
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName, this.translate.instant('MESSAGE.get_information_list'));
    this.filteModelContent.accessLoad = true;
    /*filter CLone*/
    const filterModel = JSON.parse(JSON.stringify(this.filteModelContent));
    /*filter CLone*/

    {
      /** Normal */
      /** filter Category */
      if (this.categoryModelSelected && this.categoryModelSelected.id?.length > 0) {
        const filterChild = new FilterDataModel();
        let fastfilter = new FilterDataModel();
        fastfilter.propertyName = 'LinkCategoryId';
        fastfilter.value = this.categoryModelSelected.id;
        fastfilter.clauseType = ClauseTypeEnum.Or;
        filterChild.filters.push(fastfilter);
        /** N to N */
        fastfilter = new FilterDataModel();
        fastfilter.propertyName = 'ContentCategores';
        fastfilter.propertyAnyName = 'LinkCategoryId';
        fastfilter.value = this.categoryModelSelected.id;
        fastfilter.clauseType = ClauseTypeEnum.Or;
        filterChild.filters.push(fastfilter);
        filterModel.filters.push(filterChild);
      }
      /** filter Category */
      this.contentService.ServiceGetAllEditor(filterModel).subscribe({
        next: (ret) => {
          this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
          if (ret.isSuccess) {
            this.dataModelResult = ret;
            this.tableSource.data = ret.listItems;

            if (this.optionsSearch.childMethods) {
              this.optionsSearch.childMethods.setAccess(ret.access);
            }
          } else {
            this.cmsToastrService.typeErrorMessage(ret.errorMessage);
          }
          this.loading.Stop(pName);
        },
        error: (er) => {
          this.cmsToastrService.typeError(er);
          this.loading.Stop(pName);
        }
      }
      );
      /** Normal */
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

  onActionSelectorSelect(model: CatalogCategoryModel | null): void {
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

  onActionbuttonNewRow(): void {
    // if (
    //   this.categoryModelSelected == null ||
    //   this.categoryModelSelected.id?.length === 0
    // ) {
    //   const message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorCategoryNotSelected');
    //   this.cmsToastrService.typeErrorSelected(message);
    //   return;
    // }
    if (
      this.dataModelResult == null ||
      this.dataModelResult.access == null ||
      !this.dataModelResult.access.accessAddRow
    ) {
      this.cmsToastrService.typeErrorAccessAdd();
      return;
    }
    let id = '';
    if (this.categoryModelSelected && this.categoryModelSelected?.id)
      id = this.categoryModelSelected.id;
    this.router.navigate(['/catalog/content/add', id]);
  }

  onActionbuttonEditRow(model: CatalogContentModel = this.tableRowSelected): void {
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
    this.router.navigate(['/catalog/content/edit', this.tableRowSelected.id]);
  }
  onActionbuttonDeleteRow(model: CatalogContentModel = this.tableRowSelected): void {
    if (!model || !model.id || model.id.length === 0) {
      const emessage = this.translate.instant('MESSAGE.no_row_selected_to_delete');
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
    var panelClass = '';
    if (this.tokenHelper.isMobile)
      panelClass = 'dialog-fullscreen';
    else
      panelClass = 'dialog-min';
    const dialogRef = this.dialog.open(CatalogContentDeleteComponent, {
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
    this.contentService.ServiceGetCount(this.filteModelContent).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          statist.set(this.translate.instant('MESSAGE.All'), ret.totalRowCount);
          this.optionsStatist.childMethods.setStatistValue(statist);
        } else {
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.loading.Stop(pName);
      },
      error: (er) => {
        this.cmsToastrService.typeError(er);
        this.loading.Stop(pName);
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
          statist.set(this.translate.instant('MESSAGE.Active'), ret.totalRowCount);
          this.optionsStatist.childMethods.setStatistValue(statist);
        } else {
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.loading.Stop(pName);
      },
      error: (er) => {
        this.cmsToastrService.typeError(er);
        this.loading.Stop(pName);
      }
    }
    );

  }
  onActionbuttonExport(): void {
    var panelClass = '';
    if (this.tokenHelper.isMobile)
      panelClass = 'dialog-fullscreen';
    else
      panelClass = 'dialog-min';
    //open popup
    const dialogRef = this.dialog.open(CmsExportListComponent, {
      height: "50%",
      width: "50%",
      panelClass: panelClass,
      enterAnimationDuration: environment.cmsViewConfig.enterAnimationDuration,
      exitAnimationDuration: environment.cmsViewConfig.exitAnimationDuration,
      data: {
        service: this.contentService,
        filterModel: this.filteModelContent,
        title: ''
      },
    }
    );
    dialogRef.afterClosed().subscribe((result) => {
    });
    //open popup

  }
  onActionButtonPrintEntity(model: any = this.tableRowSelected): void {
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
      this.cmsToastrService.typeErrorAccessWatch();
      return;
    }
    var panelClass = '';
    if (this.tokenHelper.isMobile)
      panelClass = 'dialog-fullscreen';
    else
      panelClass = 'dialog-min';
    //open popup
    const dialogRef = this.dialog.open(CmsExportEntityComponent, {
      height: "50%",
      width: "50%",
      panelClass: panelClass,
      enterAnimationDuration: environment.cmsViewConfig.enterAnimationDuration,
      exitAnimationDuration: environment.cmsViewConfig.exitAnimationDuration,
      data: {
        service: this.contentService,
        id: this.tableRowSelected.id,
        title: this.tableRowSelected.title
      },
    }
    );
    dialogRef.afterClosed().subscribe((result) => {
    });
    //open popup
  }



  onActionbuttonReload(): void {
    this.DataGetAll();
  }
  onActionCopied(): void {
    this.cmsToastrService.typeSuccessCopedToClipboard();
  }
  onSubmitOptionsSearch(model: any): void {
    this.filteModelContent.filters = model;
    this.DataGetAll();
  }
  // onActionTableRowSelect(row: CatalogContentModel): void {
  //   this.tableRowSelected = row;

  //   if (!row["expanded"])
  //     row["expanded"] = false;
  //   row["expanded"] = !row["expanded"]
  // }
  // onActionTableRowMouseEnter(row: CatalogContentModel): void {
  //   this.onActionTableRowSelect(row);
  //   row["expanded"] = true;
  // }
  // onActionTableRowMouseLeave(row: CatalogContentModel): void {
  //   row["expanded"] = false;
  // }
  // onActionbuttonComment(model: CatalogContentModel = this.tableRowSelected): void {
  //   if (!model || !model.id || model.id.length === 0) {
  //     this.cmsToastrService.typeErrorSelectedRow();
  //     return;
  //   }
  //   this.router.navigate(['/catalog/comment/', model.id]);
  // }
  onActionbuttonLinkTo(
    model: CatalogContentModel = this.tableRowSelected
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
    this.loading.Start(pName, this.translate.instant('MESSAGE.Get_catalog_information'));
    this.contentService
      .ServiceGetOneById(this.tableRowSelected.id)
      .subscribe({
        next: (ret) => {
          if (ret.isSuccess) {
            var panelClass = '';
            if (this.tokenHelper.isMobile)
              panelClass = 'dialog-fullscreen';
            else
              panelClass = 'dialog-min';
            //open popup
            const dialogRef = this.dialog.open(CmsLinkToComponent, {
              height: "90%",
              width: "90%",
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
          this.loading.Stop(pName);
        },
        error: (er) => {
          this.cmsToastrService.typeError(er);
          this.loading.Stop(pName);
        }
      }
      );
  }
  expandedElement: any;



  onActionGridExpandRows(flag: boolean) {
    this.tableSource.data.forEach(row => {
      row['expanded'] = flag;
    })
  }
}
