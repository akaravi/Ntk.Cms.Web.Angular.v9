import { CoreCpMainMenuModel, CoreCurrencyModel, CoreModuleModel, CoreSiteModel, ErrorExceptionResult, InfoEnumModel } from 'ntk-cms-api';
import { ConnectionStatusModel } from '../models/connectionStatusModel';
import { ThemeStoreModel } from '../models/themeStoreModel';

export interface ReducerCmsStore {
  CoreSiteResultStore: ErrorExceptionResult<CoreSiteModel>;
  CoreModuleResultStore: ErrorExceptionResult<CoreModuleModel>;
  CoreCpMainResultStore: ErrorExceptionResult<CoreCpMainMenuModel>;
  EnumRecordStatusResultStore: ErrorExceptionResult<InfoEnumModel>;
  CurrencyResultStore: ErrorExceptionResult<CoreCurrencyModel>;
  connectionStatus: ConnectionStatusModel;
  themeStore: ThemeStoreModel;
}
