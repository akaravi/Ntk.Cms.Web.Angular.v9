import { BaseEntity, DataFieldInfoModel, ErrorExceptionResult, FilterModel, IApiCmsServerBase, TokenInfoModel } from "ntk-cms-api";
import { CmsDataCommentComponent } from "src/app/shared/cms-data-comment/cms-data-comment.component";
import { CmsDataMemoComponent } from "src/app/shared/cms-data-memo/cms-data-memo.component";
import { CmsDataPinComponent } from "src/app/shared/cms-data-pin/cms-data-pin.component";
import { CmsDataTaskComponent } from "src/app/shared/cms-data-task/cms-data-task.component";
import { environment } from "src/environments/environment";
import { PublicHelper } from "../helpers/publicHelper";
import { ContentInfoModel } from "../models/contentInfoModel";
import { ProgressSpinnerModel } from "../models/progressSpinnerModel";
import { ComponentOptionSearchModel } from "./base/componentOptionSearchModel";
import { ComponentOptionStatistModel } from "./base/componentOptionStatistModel";
import { CmsExportEntityComponent } from "src/app/shared/cms-export-entity/cms-export-entity.component";
import { TokenHelper } from "../helpers/tokenHelper";
import { MatTableDataSource } from "@angular/material/table";
import { CmsExportListComponent } from "src/app/shared/cms-export-list/cmsExportList.component";
//IApiCmsServerBase
export class ListBaseComponent<TService extends IApiCmsServerBase, TModel extends BaseEntity<TKey>, TKey> {
  constructor(public baseService: TService, public item: TModel, public publicHelper: PublicHelper, public tokenHelper: TokenHelper) {
    publicHelper.pageInfo.updateContentService(baseService);
  }
  filteModelContent = new FilterModel();
  tableSource: MatTableDataSource<TModel> = new MatTableDataSource<TModel>();
  tokenInfo = new TokenInfoModel();
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  loading = new ProgressSpinnerModel();
  optionsSearch: ComponentOptionSearchModel = new ComponentOptionSearchModel();
  optionsStatist: ComponentOptionStatistModel = new ComponentOptionStatistModel();
  tableRowSelected: TModel;
  tableRowsSelected: Array<TModel> = [];
  dataModelResult: ErrorExceptionResult<TModel> = new ErrorExceptionResult<TModel>();
  clickCount = 0;
  public tableRowSelectDoubleClick = false;
  public tableRowSelect3Click = false;
  onActionTableRowSelect(row: TModel): void {
    this.clickCount++;
    setTimeout(() => {
      this.tableRowSelected = row;
      this.publicHelper.pageInfo.updateContentInfo(new ContentInfoModel(row.id, row['title'], row['viewContentHidden'], '', row['urlViewContent']));

      if (this.tableRowSelected.id === row.id) {
        if (row["expanded"] == true)
          row["expanded"] = false;
        else
          row["expanded"] = true;
      }
      else{
        row["expanded"] = false;
      }

      if (this.clickCount === 1) {
        // single
        this.tableRowSelectDoubleClick = false;
        this.tableRowSelect3Click = false;
        // single
      } else if (this.clickCount === 2) {
        // double
        this.tableRowSelectDoubleClick = true;
        this.tableRowSelect3Click = false;
        // double
      } else if (this.clickCount === 3) {
        // double
        this.tableRowSelectDoubleClick = false;
        this.tableRowSelect3Click = true;
        // double
      }

      this.clickCount = 0;
    }, 500)//250


  }
  onActionTableRowMouseClick(row: TModel): void {
    if (this.tableRowSelected.id === row.id) {
      row["expanded"] = false;
      this.onActionTableRowSelect(this.item);
      this.publicHelper.pageInfo.updateContentInfo(new ContentInfoModel('', '', false, '', ''));
    } else {
      this.onActionTableRowSelect(row);
      row["expanded"] = true;
    }
  }
  onActionTableRowMouseEnter(row: TModel): void {
    if (!environment.cmsViewConfig.tableRowMouseEnter)
      return;
    row["expanded"] = true;
  }
  onActionTableRowMouseLeave(row: TModel): void {
    if (!environment.cmsViewConfig.tableRowMouseEnter)
      return;
    if (!this.tableRowSelected || this.tableRowSelected.id !== row.id)
      row["expanded"] = false;
  }
  onActionbuttonMemo(): void {
    //open popup
    var panelClass = '';
    if (this.publicHelper.isMobile)
      panelClass = 'dialog-fullscreen';
    else
      panelClass = 'dialog-min';

    const dialogRef = this.publicHelper.dialog.open(CmsDataMemoComponent, {
      height: "70%",
      panelClass: panelClass,
      enterAnimationDuration: environment.cmsViewConfig.enterAnimationDuration,
      exitAnimationDuration: environment.cmsViewConfig.exitAnimationDuration,
      data: {
        service: this.baseService,
      },
    }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.dialogChangedDate) {
        // this.DataGetAll();
      }
    });
    //open popup
  }
  /////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////
  onActionbuttonMemoRow(model: TModel = this.tableRowSelected): void {
    //open popup
    var panelClass = '';
    if (this.publicHelper.isMobile)
      panelClass = 'dialog-fullscreen';
    else
      panelClass = 'dialog-min';

    const dialogRef = this.publicHelper.dialog.open(CmsDataMemoComponent, {
      height: "70%",
      panelClass: panelClass,
      enterAnimationDuration: environment.cmsViewConfig.enterAnimationDuration,
      exitAnimationDuration: environment.cmsViewConfig.exitAnimationDuration,
      data: {
        service: this.baseService,
        id: this.tableRowSelected ? this.tableRowSelected.id : '',
        title: this.tableRowSelected ? this.tableRowSelected['title'] : ''
      },
    }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.dialogChangedDate) {
        // this.DataGetAll();
      }
    });
    //open popup
  }
  onActionGridExpandRows(flag: boolean) {
    this.tableSource.data.forEach(row => {
      row['expanded'] = flag;
    });
  }
  onActionbuttonExport(): void {
    //open popup
    var panelClass = '';
    if (this.tokenHelper.isMobile)
      panelClass = 'dialog-fullscreen';

    else
      panelClass = 'dialog-min';
    const dialogRef = this.publicHelper.dialog.open(CmsExportListComponent, {
      height: "50%",
      enterAnimationDuration: environment.cmsViewConfig.enterAnimationDuration,
      exitAnimationDuration: environment.cmsViewConfig.exitAnimationDuration,
      panelClass: panelClass,
      data: {
        service: this.baseService,
        filterModel: this.filteModelContent,
        title: ''
      },
    }
    );
    dialogRef.afterClosed().subscribe((result) => {
    });
    //open popup
  }

  onActionbuttonPrintRow(model: any = this.tableRowSelected): void {
    if (!model || !model.id || model.id.length === 0) {
      this.publicHelper.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    this.onActionTableRowSelect(model);
    if (
      this.dataModelResult == null ||
      this.dataModelResult.access == null ||
      !this.dataModelResult.access.accessEditRow
    ) {
      this.publicHelper.cmsToastrService.typeErrorAccessWatch();
      return;
    }
    var panelClass = '';
    if (this.tokenHelper.isMobile)
      panelClass = 'dialog-fullscreen';
    else
      panelClass = 'dialog-min';
    //open popup
    const dialogRef = this.publicHelper.dialog.open(CmsExportEntityComponent, {
      height: "50%",
      width: "50%",
      panelClass: panelClass,
      enterAnimationDuration: environment.cmsViewConfig.enterAnimationDuration,
      exitAnimationDuration: environment.cmsViewConfig.exitAnimationDuration,
      data: {
        service: this.baseService,
        id: this.tableRowSelected ? this.tableRowSelected.id : '',
        title: this.tableRowSelected ? this.tableRowSelected['title'] : ''
      },
    }
    );
    dialogRef.afterClosed().subscribe((result) => {
    });
    //open popup
  }
  /////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////

  onActionbuttonPin(model: TModel = this.tableRowSelected): void {
    //open popup
    var panelClass = '';
    if (this.publicHelper.isMobile)
      panelClass = 'dialog-fullscreen';
    else
      panelClass = 'dialog-min';
    const dialogRef = this.publicHelper.dialog.open(CmsDataPinComponent, {
      height: "70%",
      panelClass: panelClass,
      enterAnimationDuration: environment.cmsViewConfig.enterAnimationDuration,
      exitAnimationDuration: environment.cmsViewConfig.exitAnimationDuration,
      data: {
        service: this.baseService,
        id: this.tableRowSelected ? this.tableRowSelected.id : '',
        title: this.tableRowSelected ? this.tableRowSelected['title'] : ''
      },
    }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.dialogChangedDate) {
        // this.DataGetAll();
      }
    });
    //open popup
  }
  onActionbuttonTask(model: TModel = this.tableRowSelected): void {
    //open popup
    var panelClass = '';
    if (this.publicHelper.isMobile)
      panelClass = 'dialog-fullscreen';
    else
      panelClass = 'dialog-min';
    const dialogRef = this.publicHelper.dialog.open(CmsDataTaskComponent, {
      height: "70%",

      panelClass: panelClass,
      enterAnimationDuration: environment.cmsViewConfig.enterAnimationDuration,
      exitAnimationDuration: environment.cmsViewConfig.exitAnimationDuration,
      data: {
        service: this.baseService,
        id: this.tableRowSelected ? this.tableRowSelected.id : '',
        title: this.tableRowSelected ? this.tableRowSelected['title'] : ''
      },
    }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.dialogChangedDate) {
        // this.DataGetAll();
      }
    });
    //open popup
  }
  onActionbuttonComment(model: TModel = this.tableRowSelected): void {
    //open popup
    var panelClass = '';
    if (this.publicHelper.isMobile)
      panelClass = 'dialog-fullscreen';
    else
      panelClass = 'dialog-min';
    const dialogRef = this.publicHelper.dialog.open(CmsDataCommentComponent, {
      height: "70%",
      panelClass: panelClass,
      enterAnimationDuration: environment.cmsViewConfig.enterAnimationDuration,
      exitAnimationDuration: environment.cmsViewConfig.exitAnimationDuration,
      data: {
        service: this.baseService,
        id: this.tableRowSelected ? this.tableRowSelected.id : '',
        title: this.tableRowSelected ? this.tableRowSelected['title'] : ''
      },
    }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.dialogChangedDate) {
        // this.DataGetAll();
      }
    });
    //open popup
  }
  DataGetAccess(): void {
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);
    this.baseService
      .ServiceViewModel()
      .subscribe({
        next: (ret) => {
          if (ret.isSuccess) {
            this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);

          } else {
            this.publicHelper.cmsToastrService.typeErrorGetAccess(ret.errorMessage);
          }
          this.loading.Stop(pName);
        },
        error: (er) => {
          this.publicHelper.cmsToastrService.typeErrorGetAccess(er);
          this.loading.Stop(pName);
        }
      }
      );
  }
}
