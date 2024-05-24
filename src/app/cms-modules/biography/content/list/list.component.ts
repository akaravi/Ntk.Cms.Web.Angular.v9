
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  BiographyCategoryModel,
  BiographyContentModel,
  BiographyContentService, ClauseTypeEnum,
  FilterDataModel,
  FilterModel,
  RecordStatusEnum,
  SortTypeEnum
} from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { ListBaseComponent } from 'src/app/core/cmsComponent/listBaseComponent';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { PageInfoService } from 'src/app/core/services/page-info.service';
import { CmsLinkToComponent } from 'src/app/shared/cms-link-to/cms-link-to.component';
import { environment } from 'src/environments/environment';
import { PublicHelper } from '../../../../core/helpers/publicHelper';
import { CmsToastrService } from '../../../../core/services/cmsToastr.service';
import { BiographyContentDeleteComponent } from '../delete/delete.component';
@Component({
  selector: 'app-biography-content-list',
  templateUrl: './list.component.html',
  styleUrls: ["./list.component.scss"],
})
export class BiographyContentListComponent extends ListBaseComponent<BiographyContentService, BiographyContentModel, number> implements OnInit, OnDestroy {
  constructor(
    public contentService: BiographyContentService,
    private cmsToastrService: CmsToastrService,
    private router: Router,
    public tokenHelper: TokenHelper,
    public translate: TranslateService,
    private cdr: ChangeDetectorRef,
    public pageInfo: PageInfoService,
    public publicHelper: PublicHelper,
    public dialog: MatDialog,
  ) {
    super(contentService, new BiographyContentModel(), publicHelper, tokenHelper);
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    this.optionsSearch.parentMethods = {
      onSubmit: (model) => this.onSubmitOptionsSearch(model),
    };

    /*filter Sort*/
    this.filteModelContent.sortColumn = 'Id';
    this.filteModelContent.sortType = SortTypeEnum.Descending;
  }
  filteModelContent = new FilterModel();
  categoryModelSelected: BiographyCategoryModel;

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
  GetAllWithHierarchyCategoryId = false;
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
    this.onActionTableRowSelect(new BiographyContentModel());
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName, this.translate.instant('MESSAGE.get_information_list'));
    this.filteModelContent.accessLoad = true;
    /*filter CLone*/
    const filterModel = JSON.parse(JSON.stringify(this.filteModelContent));
    /*filter CLone*/
    if (this.GetAllWithHierarchyCategoryId) {
      /** GetAllWithHierarchyCategoryId */
      let selectId = 0;
      if (this.categoryModelSelected?.id > 0) {
        selectId = this.categoryModelSelected.id;
      }
      this.contentService.ServiceGetAllWithHierarchyCategoryId(selectId, filterModel).subscribe({
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
          this.loading.Stop(pName);
        },
        error: (er) => {
          this.cmsToastrService.typeError(er);
          this.loading.Stop(pName);
        }
      }
      );
      /** GetAllWithHierarchyCategoryId */
    } else {
      /** Normal */
      /** filter Category */
      if (this.categoryModelSelected && this.categoryModelSelected.id > 0) {
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

            if (this.optionsStatist?.data?.show)
              this.onActionButtonStatist(true);
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
  onActionSelectorSelect(model: BiographyCategoryModel | null): void {
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
  onActionButtonNewRow(): void {
    if (
      this.categoryModelSelected == null ||
      this.categoryModelSelected.id === 0
    ) {
      const message = this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorCategoryNotSelected');
      this.cmsToastrService.typeErrorSelected(message);
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
    this.router.navigate(['/biography/content/add', this.categoryModelSelected.id]);
  }
  onActionButtonEditRow(model: BiographyContentModel = this.tableRowSelected): void {
    if (!model || !model.id || model.id === 0) {
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
    this.router.navigate(['/biography/content/edit', this.tableRowSelected.id]);
  }
  onActionButtonDeleteRow(model: BiographyContentModel = this.tableRowSelected): void {
    if (!model || !model.id || model.id === 0) {
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
    const dialogRef = this.dialog.open(BiographyContentDeleteComponent, { height: '90%', data: { id: this.tableRowSelected.id } });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }
  onActionButtonStatist(view = !this.optionsStatist.data.show): void {
    this.optionsStatist.data.show = view;
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


  onActionButtonWithHierarchy(): void {
    this.GetAllWithHierarchyCategoryId = !this.GetAllWithHierarchyCategoryId;
    this.DataGetAll();
  }

  onActionButtonReload(): void {
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
    model: BiographyContentModel = this.tableRowSelected
  ): void {
    if (!model || !model.id || model.id === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    if (model.recordStatus != RecordStatusEnum.Available) {
      this.cmsToastrService.typeWarningRecordStatusNoAvailable();
      return;
    }
    this.onActionTableRowSelect(model);


    const pName = this.constructor.name + "ServiceGetOneById";
    this.loading.Start(pName, this.translate.instant('MESSAGE.Get_biographical_information'));
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




}
