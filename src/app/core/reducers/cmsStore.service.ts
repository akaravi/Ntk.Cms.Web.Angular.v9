import { Injectable } from '@angular/core';
import { CmsStore, CoreCpMainMenuModel, CoreCurrencyModel, CoreModuleModel, CoreSiteModel, ErrorExceptionResult, InfoEnumModel } from 'ntk-cms-api';
import { ConnectionStatusModel } from '../models/connectionStatusModel';

import { ThemeStoreModel } from '../models/themeStoreModel';
import { ReducerCmsStore } from './reducer.factory';
const initialState: ReducerCmsStore = {
  CoreSiteResultStore: new ErrorExceptionResult<CoreSiteModel>(),
  CoreModuleResultStore: new ErrorExceptionResult<CoreModuleModel>(),
  CoreCpMainResultStore: new ErrorExceptionResult<CoreCpMainMenuModel>(),
  EnumRecordStatusResultStore: new ErrorExceptionResult<InfoEnumModel>(),
  CurrencyResultStore: new ErrorExceptionResult<CoreCurrencyModel>(),
  connectionStatus: new ConnectionStatusModel(),
  themeStore: new ThemeStoreModel(),
};
@Injectable({
  providedIn: 'root',
})
export class CmsStoreService extends CmsStore<ReducerCmsStore> {
  constructor() {
    super(initialState)
  }
}
