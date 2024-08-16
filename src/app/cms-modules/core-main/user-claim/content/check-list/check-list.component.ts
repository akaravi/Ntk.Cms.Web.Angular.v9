
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CoreUserClaimCheckDtoModel, CoreUserClaimCheckModel, CoreUserClaimContentModel,
  CoreUserClaimContentService, CoreUserClaimTypeModel,
  CoreUserClaimTypeService, DataFieldInfoModel, ErrorExceptionResult,
  FilterModel,
  TokenInfoModel
} from 'ntk-cms-api';
import { ComponentOptionSearchModel } from 'src/app/core/cmsComponent/base/componentOptionSearchModel';
import { ComponentOptionStatistModel } from 'src/app/core/cmsComponent/base/componentOptionStatistModel';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { environment } from 'src/environments/environment';
import { CoreUserClaimContentAddComponent } from '../add/add.component';
import { CoreUserClaimContentEditComponent } from '../edit/edit.component';

@Component({
  selector: 'app-core-userclaimcontent-checklist',
  templateUrl: './check-list.component.html',
  styleUrls: ['./check-list.component.scss']
})
export class CoreUserClaimContentCheckListComponent implements OnInit, OnDestroy {

  requestLinkUserId = 0;
  requestLinkSiteId = 0;
  constructorInfoAreaId = this.constructor.name;
  constructor(
    private coreUserClaimContentService: CoreUserClaimContentService,
    public publicHelper: PublicHelper,
    private cmsToastrService: CmsToastrService,
    private coreUserClaimTypeService: CoreUserClaimTypeService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public tokenHelper: TokenHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
    public dialog: MatDialog
  ) {
    this.publicHelper.processService.cdr = this.cdr;

    this.requestLinkUserId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkUserId'));
    this.requestLinkSiteId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkSiteId'));

  }
  comment: string;
  author: string;
  dataSource: any;
  flag = false;
  tableContentSelected = [];

  dataModelResult: ErrorExceptionResult<CoreUserClaimCheckModel> = new ErrorExceptionResult<CoreUserClaimCheckModel>();
  optionsSearch: ComponentOptionSearchModel = new ComponentOptionSearchModel();
  optionsStatist: ComponentOptionStatistModel = new ComponentOptionStatistModel();

  tokenInfo = new TokenInfoModel();

  tableRowSelected: CoreUserClaimCheckModel = new CoreUserClaimCheckModel();
  tableSource: MatTableDataSource<CoreUserClaimCheckModel> = new MatTableDataSource<CoreUserClaimCheckModel>();
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  categoryModelSelected: CoreUserClaimTypeModel = new CoreUserClaimTypeModel();
  dataModelCoreUserClaimTypeResult: ErrorExceptionResult<CoreUserClaimTypeModel> = new ErrorExceptionResult<CoreUserClaimTypeModel>();

  tabledisplayedColumns: string[] = [
    'TypeTitle',
    'IsApproved',
    'ApprovedResult',
    'ApproveCheckDate',
    'ApprovedExpireDate',
    'Action'
  ];



  expandedElement: CoreUserClaimContentModel | null;
  cmsApiStoreSubscribe: Subscription;

  ngOnInit(): void {
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
      this.DataGetAll();
    });

    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe({
      next: (ret) => {
        this.tokenInfo = ret;
        this.DataGetAll();
      }
    });
    this.getUserClaimType();
  }
  getUserClaimType(): void {
    const filter = new FilterModel();
    filter.rowPerPage = 100;
    this.coreUserClaimTypeService.ServiceGetAll(filter).subscribe({
      next: (ret) => {
        this.dataModelCoreUserClaimTypeResult = ret;
      }
    });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  DataGetAll(): void {
    this.onActionTableRowSelect(new CoreUserClaimCheckModel());
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });



    if (this.requestLinkUserId > 0 && this.requestLinkSiteId > 0) {
      /** */
      const model = new CoreUserClaimCheckDtoModel();
      model.userId = this.requestLinkUserId;
      model.siteId = this.requestLinkSiteId;
      this.coreUserClaimContentService.setAccessLoad();
      this.coreUserClaimContentService.ServiceClaimCheck(model).subscribe({
        next: (ret) => {
          if (ret.isSuccess) {
            this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);

            this.dataModelResult = ret;
            this.tableSource.data = ret.listItems;

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
      /** */
    }
    else {
      /** */
      this.coreUserClaimContentService.setAccessLoad();
      this.coreUserClaimContentService.ServiceClaimCheckCurrent().subscribe({
        next: (ret) => {
          if (ret.isSuccess) {
            this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);

            this.dataModelResult = ret;
            this.tableSource.data = ret.listItems;

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
      /** */
    }

  }

  onActionButtonNewRow(): void {
    var panelClass = '';
    if (this.tokenHelper.isMobile)
      panelClass = 'dialog-fullscreen';
    else
      panelClass = 'dialog-min';
    const dialogRef = this.dialog.open(CoreUserClaimContentAddComponent, {
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

  onActionButtonEditRow(model: CoreUserClaimCheckModel = this.tableRowSelected): void {
    if (!model || !model.linkTypeId || model.linkTypeId === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    this.onActionTableRowSelect(model);
    if (model.linkContentId && model.linkContentId > 0) {
      var panelClass = '';
      if (this.tokenHelper.isMobile)
        panelClass = 'dialog-fullscreen';
      else
        panelClass = 'dialog-min';
      const dialogRef = this.dialog.open(CoreUserClaimContentEditComponent, {
        height: '90%',
        panelClass: panelClass,
        enterAnimationDuration: environment.cmsViewConfig.enterAnimationDuration,
        exitAnimationDuration: environment.cmsViewConfig.exitAnimationDuration,
        data: { id: this.tableRowSelected.linkContentId }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.dialogChangedDate) {
          this.DataGetAll();
        }
      });
    } else {
      var panelClass = '';
      if (this.tokenHelper.isMobile)
        panelClass = 'dialog-fullscreen';
      else
        panelClass = 'dialog-min';
      const dialogRef = this.dialog.open(CoreUserClaimContentAddComponent, {
        height: '90%',
        panelClass: panelClass,
        enterAnimationDuration: environment.cmsViewConfig.enterAnimationDuration,
        exitAnimationDuration: environment.cmsViewConfig.exitAnimationDuration,
        data: { linkUserClaimTypeId: this.tableRowSelected.linkTypeId }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.dialogChangedDate) {
          this.DataGetAll();
        }
      });
    }
  }



  onActionButtonReload(): void {
    this.DataGetAll();
  }

  onActionTableRowSelect(row: CoreUserClaimCheckModel): void {
    this.tableRowSelected = row;
    if (!row["expanded"])
      row["expanded"] = false;
    row["expanded"] = !row["expanded"];
  }
  onActionBackToParent(): void {
    this.router.navigate(['/core/user/']);
  }
}
