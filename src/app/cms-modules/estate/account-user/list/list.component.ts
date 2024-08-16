
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  EstateAccountUserFilterModel, EstateAccountUserModel, EstateAccountUserService, FilterDataModel, ManageUserAccessDataTypesEnum, RecordStatusEnum, SortTypeEnum
} from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { ListBaseComponent } from 'src/app/core/cmsComponent/listBaseComponent';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { PageInfoService } from 'src/app/core/services/page-info.service';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { environment } from 'src/environments/environment';
import { EstateAccountUserAddComponent } from '../add/add.component';
import { EstateAccountUserEditComponent } from '../edit/edit.component';
@Component({
  selector: 'app-estate-account-user-list',
  templateUrl: './list.component.html',
})
export class EstateAccountUserListComponent extends ListBaseComponent<EstateAccountUserService, EstateAccountUserModel, string> implements OnInit, OnDestroy {
  requestLinkAccountAgencyId = '';
  requestLinkLocationWorkAreaIds: number[];
  constructorInfoAreaId = this.constructor.name;
  constructor(
    private contentService: EstateAccountUserService,
    private cmsConfirmationDialogService: CmsConfirmationDialogService,
    private cmsToastrService: CmsToastrService,
    private router: Router,
    public tokenHelper: TokenHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    public pageInfo: PageInfoService,
    public publicHelper: PublicHelper,
    public dialog: MatDialog) {
    super(contentService, new EstateAccountUserModel(), publicHelper, tokenHelper, translate);
    this.publicHelper.processService.cdr = this.cdr;
    this.optionsSearch.parentMethods = {
      onSubmit: (model) => this.onSubmitOptionsSearch(model),
    };
    this.requestLinkAccountAgencyId = this.activatedRoute.snapshot.paramMap.get('LinkAccountAgencyId');

    /*filter Sort*/
    this.filteModelContent.sortColumn = 'Id';
    this.filteModelContent.sortType = SortTypeEnum.Descending;
  }
  @Input() optionloadComponent = true;
  @Input() optionloadByRoute = true;
  @Input() set optionLinkLocationWorkAreaIds(ids: number[]) {
    this.requestLinkLocationWorkAreaIds = [];
    if (ids && ids.length > 0) {
      this.requestLinkLocationWorkAreaIds = ids;
    }
    if (this.requestLinkLocationWorkAreaIds && this.requestLinkLocationWorkAreaIds.length > 0)
      this.filteModelContent.linkLocationWorkAreaIds = this.requestLinkLocationWorkAreaIds;
  }
  @Input() set optionLinkLocationWorkAreaId(id: number) {
    this.requestLinkLocationWorkAreaIds = [];
    if (id && id > 0) {
      this.requestLinkLocationWorkAreaIds.push(id);
    }
    if (this.requestLinkLocationWorkAreaIds && this.requestLinkLocationWorkAreaIds.length > 0)
      this.filteModelContent.linkLocationWorkAreaIds = this.requestLinkLocationWorkAreaIds;
  }
  link: string;
  comment: string;
  author: string;
  dataSource: any;
  flag = false;
  tableContentSelected = [];

  filteModelContent = new EstateAccountUserFilterModel();



  tabledisplayedColumns: string[] = [];
  tabledisplayedColumnsSource: string[] = [
    'LinkMainImageIdSrc',
    'Title',
    // 'LinkCmsUserId',
    'Description',
    'action_menu',
  ];


  tabledisplayedColumnsMobileSource: string[] = [
    'LinkMainImageIdSrc',
    'Title',
    // 'LinkCmsUserId',
    'Description',
    'action_menu',
  ];


  expandedElement: EstateAccountUserModel | null;
  cmsApiStoreSubscribe: Subscription;

  ngOnInit(): void {

    this.tokenHelper.getTokenInfoState().then((value) => {
      this.tokenInfo = value;
      this.DataGetAll();
    });

    this.cmsApiStoreSubscribe = this.tokenHelper.getTokenInfoStateOnChange().subscribe({
      next: (ret) => {
        this.tokenInfo = ret;
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
    this.onActionTableRowSelect(new EstateAccountUserModel());
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.get_information_list').subscribe((str: string) => { this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId); });
    this.filteModelContent.accessLoad = true;
    if (this.requestLinkAccountAgencyId && this.requestLinkAccountAgencyId.length > 0) {
      const filter = new FilterDataModel();
      filter.propertyAnyName = 'AccountAgencyUser';
      filter.propertyName = 'linkEstateAccountAgencyId';
      filter.value = this.requestLinkAccountAgencyId;
      this.filteModelContent.filters.push(filter);
    }

    /*filter CLone*/
    const filterModel = JSON.parse(JSON.stringify(this.filteModelContent));
    /*filter CLone*/
    this.contentService.setAccessDataType(ManageUserAccessDataTypesEnum.Editor);
    this.contentService.ServiceGetAll(filterModel).subscribe({
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

  onActionSelectorLocation(model: number[] | null): void {

    this.filteModelContent.locationListIds = model;
  }
  onActionSelectorLocationWorkArea(model: number[] | null): void {

    this.filteModelContent.linkLocationWorkAreaIds = model;
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
    const dialogRef = this.dialog.open(EstateAccountUserAddComponent, {
      height: '90%',
      panelClass: panelClass,
      enterAnimationDuration: environment.cmsViewConfig.enterAnimationDuration,
      exitAnimationDuration: environment.cmsViewConfig.exitAnimationDuration,
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }

  onActionButtonEditRow(model: EstateAccountUserModel = this.tableRowSelected): void {

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
    const dialogRef = this.dialog.open(EstateAccountUserEditComponent, {
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
  onActionButtonDeleteRow(model: EstateAccountUserModel = this.tableRowSelected): void {
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
  onActionButtonAgencyRow(
    mode: EstateAccountUserModel = this.tableRowSelected, event?: MouseEvent
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
      this.link = "/#/estate/account-agency/LinkAccountUserId/" + this.tableRowSelected.id;
      window.open(this.link, "_blank");
    } else {
      this.router.navigate(["/estate/account-agency/LinkAccountUserId", this.tableRowSelected.id]);
    }
  }
  onActionButtonHistoryRow(
    mode: EstateAccountUserModel = this.tableRowSelected, event?: MouseEvent
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
      this.link = "/#/estate/property-history/LinkEstateUserId/" + this.tableRowSelected.id;
      window.open(this.link, "_blank");
    } else {
      this.router.navigate(["/estate/property-history/LinkEstateUserId", this.tableRowSelected.id]);
    }
  }
  onActionButtonPropertyRow(
    mode: EstateAccountUserModel = this.tableRowSelected, event?: MouseEvent
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
      this.link = "/#/estate/property/LinkEstateUserId/" + this.tableRowSelected.id;
      window.open(this.link, "_blank");
    } else {
      this.router.navigate(["/estate/property/LinkEstateUserId", this.tableRowSelected.id]);
    }
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

  }



  onActionCopied(): void {
    this.cmsToastrService.typeSuccessCopedToClipboard();
  }

  onActionButtonReload(): void {
    this.optionloadComponent = true;
    this.DataGetAll();
  }
  onSubmitOptionsSearch(model: any): void {
    this.filteModelContent.filters = model;
    this.DataGetAll();
  }


}
