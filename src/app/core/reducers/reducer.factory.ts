import { CoreCpMainMenuModel, CoreCurrencyModel, CoreModuleModel, CoreSiteModel, ErrorExceptionResult, InfoEnumModel } from 'ntk-cms-api';
import { ProcessInfoModel } from '../models/progressSpinnerModel';
import { ConnectionStatusModel } from '../models/connectionStatusModel';
import { ThemeStoreModel } from '../models/themeStoreModel';

export interface ReducerCmsStore {
  CoreSiteResultStore: ErrorExceptionResult<CoreSiteModel>;
  CoreModuleResultStore: ErrorExceptionResult<CoreModuleModel>;
  CoreCpMainResultStore: ErrorExceptionResult<CoreCpMainMenuModel>;
  EnumRecordStatusResultStore: ErrorExceptionResult<InfoEnumModel>;
  CurrencyResultStore: ErrorExceptionResult<CoreCurrencyModel>;
  processInfoStore: Map<string, ProcessInfoModel>;
  connectionStatus: ConnectionStatusModel;
  themeStore: ThemeStoreModel;
}
