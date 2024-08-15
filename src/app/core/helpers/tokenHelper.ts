import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  CoreAuthService,
  ManageUserAccessUserTypesEnum,
  TokenDeviceModel,
  TokenInfoModel
} from 'ntk-cms-api';
import { Observable, Subscription, firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CmsStoreService } from '../reducers/cmsStore.service';
import { SET_Info_Enum, SET_TOKEN_DEVICE, SET_TOKEN_INFO } from '../reducers/reducer.factory';
import { ThemeService } from '../services/theme.service';
const LOCALIZATION_LOCAL_STORAGE_KEY = 'language';
@Injectable({
  providedIn: 'root',
})
export class TokenHelper implements OnDestroy {
  constructor(
    public cmsStoreService: CmsStoreService,
    public coreAuthService: CoreAuthService,
    public translate: TranslateService,
    private themeService: ThemeService,
    private router: Router,
  ) {
    this.consoleLog = environment.ProgressConsoleLog;
    //**Token */
    this.coreAuthService.tokenInfoSubject.subscribe((value) => {
      this.cmsStoreService.setState({ type: SET_TOKEN_INFO, payload: value });
      console.log("SET_TOKEN_INFO");
    })
    this.coreAuthService.tokenDeviceSubject.subscribe((value) => {
      this.cmsStoreService.setState({ type: SET_TOKEN_DEVICE, payload: value });
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
  cmsApiStoreSubscribe: Subscription;
  isAdminSite = false;
  isSupportSite = false;


  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }

  async getCurrentToken(): Promise<TokenInfoModel> {
    const storeSnapshot = this.cmsStoreService.getStateSnapshot();
    if (storeSnapshot?.tokenInfoStore) {
      this.tokenInfo = storeSnapshot.tokenInfoStore;
      if (this.tokenInfo)
        this.setDirectionThemeBylanguage(this.tokenInfo.language);
      this.CheckIsAdmin();
      return storeSnapshot.tokenInfoStore;
    }
    return await firstValueFrom(this.coreAuthService.ServiceCurrentToken())
      .then((ret) => {
        this.cmsStoreService.setState({ type: SET_TOKEN_INFO, payload: ret.item });
        this.tokenInfo = ret.item;
        if (this.tokenInfo)
          this.setDirectionThemeBylanguage(this.tokenInfo.language);
        this.CheckIsAdmin();
        return ret.item;
      });
  }
  async getCurrentDeviceToken(): Promise<TokenDeviceModel> {
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
  getCurrentTokenOnChange(): Observable<TokenInfoModel> {
    return this.cmsStoreService.getState((state) => {
      if (this.consoleLog)
        console.log("getCurrentTokenOnChange");
      this.cmsStoreService.setState({ type: SET_Info_Enum, payload: null });
      this.tokenInfo = state.tokenInfoStore;
      this.setDirectionThemeBylanguage(this.tokenInfo.language);
      this.CheckIsAdmin();
      return state.tokenInfoStore;
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
  CheckRouteByToken(): void {
    const storeSnapshot = this.cmsStoreService.getStateSnapshot();
    if (storeSnapshot?.tokenInfoStore) {
      this.tokenInfo = storeSnapshot.tokenInfoStore;
    }
    this.cmsApiStoreSubscribe = this.cmsStoreService.getState((state) => state.tokenInfoStore).subscribe((value) => {
      this.tokenInfo = value;

      if (!this.tokenInfo || !this.tokenInfo.token || this.tokenInfo.token.length === 0) {
        if (this.router && this.router.url.indexOf('/auth/singin') < 0) {
          this.router.navigate(['/auth/singin']);
        }
      } else if (this.tokenInfo.userId <= 0) {

        if (this.router && this.router.url.indexOf('/auth/singin') < 0) {
          this.router.navigate(['/auth/singin']);
        }
      } else if (this.tokenInfo.userId > 0 && this.tokenInfo.siteId <= 0) {
        if (this.router && this.router.url.indexOf('/core/site/selection') < 0) {
          this.router.navigate(['/core/site/selection']);
        }
      }
      if (this.tokenInfo && this.tokenInfo.userId <= 0) {
        if (this.router && this.router.url.indexOf('/auth/singin') < 0) {
          this.router.navigate(['/auth/singin']);
        }
      }

      if (this.tokenInfo && this.tokenInfo.userId > 0 && this.tokenInfo.siteId <= 0) {
        if (this.router && this.router.url.indexOf('/core/site/selection') < 0) {
          this.router.navigate(['/core/site/selection']);
        }
      }
      // this.inputSiteId = this.tokenInfo.siteId;
      // this.inputUserId = this.tokenInfo.userId;
    });
  }

}
function HostListener(arg0: string, arg1: string[]): (target: TokenHelper, propertyKey: "onResize", descriptor: TypedPropertyDescriptor<(event: any) => void>) => void | TypedPropertyDescriptor<(event: any) => void> {
  throw new Error('Function not implemented.');
}

