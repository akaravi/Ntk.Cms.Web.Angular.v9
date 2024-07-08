import { BaseEntity, DataFieldInfoModel, ErrorExceptionResult, IApiCmsServerBase, TokenInfoModel } from "ntk-cms-api";
import { PublicHelper } from "../helpers/publicHelper";
import { ProgressSpinnerModel } from "../models/progressSpinnerModel";
//IApiCmsServerBase
export class AddBaseComponent<TService extends IApiCmsServerBase, TModel extends BaseEntity<TKey>, TKey> {
  constructor(public baseService: TService, public item: TModel, public publicHelper: PublicHelper) {
    publicHelper.pageInfo.updateContentService(baseService);
    this.DataGetAccess();
    this.dataModel = item;
  }
  tokenInfo = new TokenInfoModel();
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<TModel> = new ErrorExceptionResult<TModel>();
  dataModel: TModel;


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
