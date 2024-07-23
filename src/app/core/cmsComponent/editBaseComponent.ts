import { TranslateService } from "@ngx-translate/core";
import { BaseEntity, DataFieldInfoModel, ErrorExceptionResultBase, IApiCmsServerBase, TokenInfoModel } from "ntk-cms-api";
import { CmsDataCommentComponent } from "src/app/shared/cms-data-comment/cms-data-comment.component";
import { CmsDataMemoComponent } from "src/app/shared/cms-data-memo/cms-data-memo.component";
import { CmsDataPinComponent } from "src/app/shared/cms-data-pin/cms-data-pin.component";
import { CmsDataTaskComponent } from "src/app/shared/cms-data-task/cms-data-task.component";
import { environment } from "src/environments/environment";
import { PublicHelper } from "../helpers/publicHelper";
//IApiCmsServerBase
export class EditBaseComponent<TService extends IApiCmsServerBase, TModel extends BaseEntity<TKey>, TKey> {
  constructor(public baseService: TService, public item: TModel, public publicHelper: PublicHelper, public translate: TranslateService,
  ) {
    publicHelper.pageInfo.updateContentService(baseService);
    this.dataModel = item;
  }
  tokenInfo = new TokenInfoModel();
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  dataModelResult: ErrorExceptionResultBase = new ErrorExceptionResultBase;
  dataModel: TModel;
  onActionButtonMemo(model: TModel = this.dataModel): void {
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
        id: this.dataModel ? this.dataModel.id : '',
        title: this.dataModel ? this.dataModel['title'] : ''
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
  onActionButtonPin(model: TModel = this.dataModel): void {
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
        id: this.dataModel ? this.dataModel.id : '',
        title: this.dataModel ? this.dataModel['title'] : ''
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
  onActionButtonTask(model: TModel = this.dataModel): void {
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
        id: this.dataModel ? this.dataModel.id : '',
        title: this.dataModel ? this.dataModel['title'] : ''
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
  onActionButtonComment(model: TModel = this.dataModel): void {
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
        id: this.dataModel ? this.dataModel.id : '',
        title: this.dataModel ? this.dataModel['title'] : ''
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
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructor.name);
    });
    this.baseService
      .ServiceViewModel()
      .subscribe({
        next: (ret) => {
          if (ret.isSuccess) {
            this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);

          } else {
            this.publicHelper.cmsToastrService.typeErrorGetAccess(ret.errorMessage);
          }
          this.publicHelper.processService.processStop(pName);
        },
        error: (er) => {
          this.publicHelper.cmsToastrService.typeErrorGetAccess(er);
          this.publicHelper.processService.processStop(pName, false);
        }
      }
      );
  }
}
