import { CoreCpMainMenuModel, CoreCurrencyModel, CoreModuleModel, CoreSiteModel, ErrorExceptionResult, InfoEnumModel, ProcessInfoModel, TokenDeviceModel, TokenInfoModel } from 'ntk-cms-api';
import { ConnectionStatusModel } from '../models/connectionStatusModel';
import { ThemeStoreModel } from '../models/themeStoreModel';

export interface ReducerCmsStore {
  tokenInfoStore: TokenInfoModel;
  deviceTokenInfoStore: TokenDeviceModel;
  processInfoStore: Map<string, ProcessInfoModel>;
  coreSiteResultStore: ErrorExceptionResult<CoreSiteModel>;
  coreModuleResultStore: ErrorExceptionResult<CoreModuleModel>;
  coreCpMainResultStore: ErrorExceptionResult<CoreCpMainMenuModel>;
  enumRecordStatusResultStore: ErrorExceptionResult<InfoEnumModel>;
  currencyResultStore: ErrorExceptionResult<CoreCurrencyModel>;
  connectionStatusStore: ConnectionStatusModel;
  themeStore: ThemeStoreModel;
}

export const initialState: ReducerCmsStore = {
  tokenInfoStore: new TokenInfoModel(),
  deviceTokenInfoStore: new TokenDeviceModel(),
  processInfoStore: new Map<string, ProcessInfoModel>(),
  coreSiteResultStore: new ErrorExceptionResult<CoreSiteModel>(),
  coreModuleResultStore: new ErrorExceptionResult<CoreModuleModel>(),
  coreCpMainResultStore: new ErrorExceptionResult<CoreCpMainMenuModel>(),
  enumRecordStatusResultStore: new ErrorExceptionResult<InfoEnumModel>(),
  currencyResultStore: new ErrorExceptionResult<CoreCurrencyModel>(),
  connectionStatusStore: new ConnectionStatusModel(),
  themeStore: new ThemeStoreModel()
};


export interface AppStoreModel {
  cmsState: ReducerCmsStore;
}
// REDUCERS
export function stateReducer(state: ReducerCmsStore = initialState, action: Actions): ReducerCmsStore {
  switch (action.type) {
    case SET_TOKEN_INFO:
      return { ...state, tokenInfoStore: action.payload };
    case SET_TOKEN_DEVICE:
      return { ...state, deviceTokenInfoStore: action.payload };
    case SET_Process_Info:
      return { ...state, processInfoStore: action.payload };
    case SET_Core_Site:
      return { ...state, coreSiteResultStore: action.payload };
    case SET_Core_Module:
      return { ...state, coreModuleResultStore: action.payload };
    case SET_CpMain_Menu:
      return { ...state, coreCpMainResultStore: action.payload };
    case SET_Core_Currency:
      return { ...state, currencyResultStore: action.payload };
    case SET_Info_Enum:
      return { ...state, enumRecordStatusResultStore: action.payload };
    case SET_Connection_STATE:
      return { ...state, connectionStatusStore: action.payload };
    case SET_Theme_STATE:
      return { ...state, themeStore: action.payload };

    default:
      return initialState;
  }
}


// ACTIONS
export interface ActionInterface {
  readonly type: string;
  payload?: any;
}
export const SET_TOKEN_INFO = 'SET_TOKEN_INFO';
export const SET_TOKEN_DEVICE = 'SET_TOKEN_DEVICE';
export const SET_Process_Info = 'SET_Process_Info';
export const SET_Core_Site = 'SET_Core_Site';
export const SET_Core_Module = 'SET_Core_Module';
export const SET_CpMain_Menu = 'SET_CpMain_Menu';
export const SET_Core_Currency = 'SET_Core_Currency';
export const SET_Info_Enum = 'SET_Info_Enum';
export const SET_Connection_STATE = 'SET_Connection_STATE';
export const SET_Theme_STATE = 'SET_Theme_STATE';

export class SetTokenInfoState implements ActionInterface {
  readonly type = SET_TOKEN_INFO;
  payload: TokenInfoModel;
}
export class SetTokenDeviceState implements ActionInterface {
  readonly type = SET_TOKEN_DEVICE;
  payload: TokenDeviceModel;
}
export class SetProcessInfo implements ActionInterface {
  readonly type = SET_Process_Info;
  payload: Map<string, ProcessInfoModel>;
}
export class SetCoreSite implements ActionInterface {
  readonly type = SET_Core_Site;
  payload: ErrorExceptionResult<CoreSiteModel>;
}
export class SetCoreModule implements ActionInterface {
  readonly type = SET_Core_Module;
  payload: ErrorExceptionResult<CoreModuleModel>;
}
export class SetCpMainMenu implements ActionInterface {
  readonly type = SET_CpMain_Menu;
  payload: ErrorExceptionResult<CoreCpMainMenuModel>;
}

export class SetInfoEnum implements ActionInterface {
  readonly type = SET_Info_Enum;
  payload: ErrorExceptionResult<InfoEnumModel>;
}
export class SetCoreCurrency implements ActionInterface {
  readonly type = SET_Core_Currency;
  payload: ErrorExceptionResult<CoreCurrencyModel>;
}
export class SetConnectionState implements ActionInterface {
  readonly type = SET_Connection_STATE;
  payload: ConnectionStatusModel;
}
export class SetThemeState implements ActionInterface {
  readonly type = SET_Theme_STATE;
  payload: ThemeStoreModel;
}
export type Actions = SetTokenDeviceState | SetTokenInfoState | SetProcessInfo | SetCoreSite | SetCoreModule | SetCpMainMenu | SetInfoEnum | SetCoreCurrency | SetConnectionState | SetThemeState;
