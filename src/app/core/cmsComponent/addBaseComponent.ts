import { MatDialog } from "@angular/material/dialog";
import { BaseEntity, BaseModuleEntity, DataFieldInfoModel, IApiCmsServerBase } from "ntk-cms-api";

import { CmsDataCommentComponent } from "src/app/shared/cms-data-comment/cms-data-comment.component";
import { CmsDataMemoComponent } from "src/app/shared/cms-data-memo/cms-data-memo.component";
import { CmsDataPinComponent } from "src/app/shared/cms-data-pin/cms-data-pin.component";
import { CmsDataTaskComponent } from "src/app/shared/cms-data-task/cms-data-task.component";
import { environment } from "src/environments/environment";
import { PublicHelper } from "../helpers/publicHelper";
import { ContentInfoModel } from "../models/contentInfoModel";
import { ProgressSpinnerModel } from "../models/progressSpinnerModel";
import { PageInfoService } from "../services/page-info.service";
//IApiCmsServerBase
export class AddBaseComponent<TService extends IApiCmsServerBase, TModel extends BaseEntity<TKey>, TKey> {
  constructor(baseService: TService, public item: TModel, public pageInfo: PageInfoService, public publicHelper: PublicHelper, public dialog: MatDialog) {
    pageInfo.updateContentService(baseService);
    this.DataGetAccess();
  }
  baseService: TService;

  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  loading = new ProgressSpinnerModel();
  tableRowSelected: TModel;
  onActionTableRowSelect(row: TModel): void {
    this.tableRowSelected = row;
    this.pageInfo.updateContentInfo(new ContentInfoModel(row.id, row['title'], row['viewContentHidden'], '', row['urlViewContent']));
    row["expanded"] = true;
  }
  onActionTableRowMouseClick(row: TModel): void {
    if (this.tableRowSelected.id === row.id) {
      row["expanded"] = false;
      this.onActionTableRowSelect(this.item);
      this.pageInfo.updateContentInfo(new ContentInfoModel('', '', false, '', ''));
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
  onActionbuttonMemo(model: TModel = this.tableRowSelected): void {
    //open popup
    var panelClass = '';
    if (this.publicHelper.isMobile)
      panelClass = 'dialog-fullscreen';
    else
      panelClass = 'dialog-min';

    const dialogRef = this.dialog.open(CmsDataMemoComponent, {
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
  onActionbuttonPin(model: TModel = this.tableRowSelected): void {
    //open popup
    var panelClass = '';
    if (this.publicHelper.isMobile)
      panelClass = 'dialog-fullscreen';
    else
      panelClass = 'dialog-min';
    const dialogRef = this.dialog.open(CmsDataPinComponent, {
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
    const dialogRef = this.dialog.open(CmsDataTaskComponent, {
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
    const dialogRef = this.dialog.open(CmsDataCommentComponent, {
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
