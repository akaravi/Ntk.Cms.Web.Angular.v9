import { MatDialog } from "@angular/material/dialog";
import { BaseEntity, BaseModuleEntity, DataFieldInfoModel, ErrorExceptionResult, IApiCmsServerBase } from "ntk-cms-api";

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
    this.dataModel=item;
  }
  baseService: TService;
  loading = new ProgressSpinnerModel();
  
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  dataModelResult: ErrorExceptionResult<TModel> = new ErrorExceptionResult<TModel>();
  dataModel: TModel;

 
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
