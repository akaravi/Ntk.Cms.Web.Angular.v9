import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  CoreAuthService,
  ManageUserAccessUserTypesEnum,
  TokenDeviceModel,
  TokenInfoModel
} from 'ntk-cms-api';
import { Observable, firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CmsStoreService } from '../reducers/cmsStore.service';
import { ReducerCmsStore, SET_TOKEN_DEVICE, SET_TOKEN_INFO } from '../reducers/reducer.factory';
import { ThemeService } from '../services/theme.service';
const LOCALIZATION_LOCAL_STORAGE_KEY = 'language';
@Injectable({
  providedIn: 'root',
})
export class TokenHelper {
  constructor(
    public cmsStoreService: CmsStoreService,
    public coreAuthService: CoreAuthService,
    public translate: TranslateService,
    private themeService: ThemeService,
  ) {
    this.consoleLog = environment.ProgressConsoleLog;
    //**Token */
    this.coreAuthService.tokenInfoSubject.subscribe((value) => {
      this.cmsStoreService.setState({ type: SET_TOKEN_INFO, payload: value });
      if (environment.consoleLog)
        console.log("SET_TOKEN_INFO");
    })
    this.coreAuthService.tokenDeviceSubject.subscribe((value) => {
      this.cmsStoreService.setState({ type: SET_TOKEN_DEVICE, payload: value });
      if (environment.consoleLog)
        console.log("SET_TOKEN_DEVICE");
    })
    //**Token */
  }
  consoleLog = true;

  get isMobile() {
    if (window.innerWidth < environment.cmsViewConfig.mobileWindowInnerWidth)
      return true;
    return false;
  };
  tokenInfo: TokenInfoModel = new TokenInfoModel();
  deviceTokenInfo: TokenDeviceModel = new TokenDeviceModel();

  isAdminSite = false;
  isSupportSite = false;


  /*
    /opny use on main page
    */
  onInitAppComponentStateOnChange(): Observable<ReducerCmsStore> {
    return this.cmsStoreService.getState((state) => {
      if (environment.consoleLog)
        console.log("onInitAppComponentStateOnChange:tokenhelper");
      debugger
      this.tokenInfo = state.tokenInfoStore;
      this.setDirectionThemeBylanguage(this.tokenInfo.language);
      this.CheckIsAdmin();
      return state;
    });
  }
  getStateOnChange(): Observable<ReducerCmsStore> {
    return this.cmsStoreService.getState((state) => {
      if (environment.consoleLog)
        console.log("getStateOnChange");
      return state
    });
  }
  getTokenInfoStateOnChange(): Observable<TokenInfoModel> {
    return this.cmsStoreService.getState((state) => {
      if (environment.consoleLog)
        console.log("getTokenInfoStateOnChange");
      return state.tokenInfoStore;
    });
  }
  async getTokenInfoState(): Promise<TokenInfoModel> {
    const storeSnapshot = this.cmsStoreService.getStateSnapshot();
    if (storeSnapshot?.tokenInfoStore) {
      this.tokenInfo = storeSnapshot.tokenInfoStore;
      return storeSnapshot.tokenInfoStore;
    }
    return await firstValueFrom(this.coreAuthService.ServiceCurrentToken())
      .then((ret) => {
        this.cmsStoreService.setState({ type: SET_TOKEN_INFO, payload: ret.item });
        this.tokenInfo = ret.item;
        return ret.item;
      });
  }
  async getTokenDeviceState(): Promise<TokenDeviceModel> {
    const storeSnapshot = this.cmsStoreService.getStateSnapshot();
    if (storeSnapshot?.deviceTokenInfoStore) {
      this.deviceTokenInfo = storeSnapshot.deviceTokenInfoStore;

      return storeSnapshot.deviceTokenInfoStore;
    }
    return await firstValueFrom(this.coreAuthService.ServiceCurrentDeviceToken())
      .then((ret) => {
        this.cmsStoreService.setState({ type: SET_TOKEN_DEVICE, payload: ret.item });
        this.deviceTokenInfo = ret.item;
        return ret.item;
      });
  }

  setDirectionThemeBylanguage(language) {
    if (!language || language.length === 0)
      language = localStorage.getItem(LOCALIZATION_LOCAL_STORAGE_KEY) || this.translate.getDefaultLang() || 'fa';// this.cmsTranslationService.getSelectedLanguage()
    if (language === 'ar' || language === 'fa') {
      this.themeService.updateThemeDirection("ltr");
    } else {
      this.themeService.updateThemeDirection("rtl");
    }
    document.getElementsByTagName('html')[0].setAttribute('lang', language);
  }
  CurrentTokenInfoRenew(): void {
    this.coreAuthService.CurrentTokenInfoRenew();
  }
  CheckIsAdmin(): boolean {
    if (this.tokenInfo.userAccessUserType === ManageUserAccessUserTypesEnum.AdminCpSite
      || this.tokenInfo.userAccessUserType === ManageUserAccessUserTypesEnum.AdminMainCms

      || this.tokenInfo.userAccessUserType === ManageUserAccessUserTypesEnum.SupportCpSite
      || this.tokenInfo.userAccessUserType === ManageUserAccessUserTypesEnum.SupportMainCms
    ) {
      this.isAdminSite = true;
      return true;
    }
    this.isAdminSite = false;
    return false;
  }
  CheckIsSupport(): boolean {
    if (this.tokenInfo.userAccessUserType === ManageUserAccessUserTypesEnum.SupportCpSite
      || this.tokenInfo.userAccessUserType === ManageUserAccessUserTypesEnum.SupportMainCms
    ) {
      this.isSupportSite = true;
      return true;
    }
    this.isSupportSite = false;
    return false;
  }


}
function HostListener(arg0: string, arg1: string[]): (target: TokenHelper, propertyKey: "onResize", descriptor: TypedPropertyDescriptor<(event: any) => void>) => void | TypedPropertyDescriptor<(event: any) => void> {
  throw new Error('Function not implemented.');
}

