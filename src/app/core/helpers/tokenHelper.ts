import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  CoreAuthService,
  ManageUserAccessUserTypesEnum, NtkCmsApiStoreService,
  SET_DEVICE_TOKEN_INFO, SET_TOKEN_INFO,
  TokenDeviceModel,
  TokenInfoModel
} from 'ntk-cms-api';
import { Observable, Subscription, firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CmsStoreService } from '../reducers/cmsStore.service';
import { ThemeService } from '../services/theme.service';
const LOCALIZATION_LOCAL_STORAGE_KEY = 'language';
@Injectable({
  providedIn: 'root',
})
export class TokenHelper implements OnDestroy {
  constructor(
    public coreAuthService: CoreAuthService,
    private cmsApiStore: NtkCmsApiStoreService,
    public translate: TranslateService,
    private cmsStoreService: CmsStoreService,
    private themeService: ThemeService,
    private router: Router,
  ) {

  }

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
    const storeSnapshot = this.cmsApiStore.getStateSnapshot();
    if (storeSnapshot?.ntkCmsAPiState?.tokenInfoStore) {
      this.tokenInfo = storeSnapshot.ntkCmsAPiState.tokenInfoStore;
      if (this.tokenInfo)
        this.setDirectionThemeBylanguage(this.tokenInfo.language);
      this.CheckIsAdmin();
      return storeSnapshot.ntkCmsAPiState.tokenInfoStore;
    }
    return await firstValueFrom(this.coreAuthService.ServiceCurrentToken())
      .then((ret) => {
        this.cmsApiStore.setState({ type: SET_TOKEN_INFO, payload: ret.item });
        this.tokenInfo = ret.item;
        if (this.tokenInfo)
          this.setDirectionThemeBylanguage(this.tokenInfo.language);
        this.CheckIsAdmin();
        return ret.item;
      });
  }
  async getCurrentDeviceToken(): Promise<TokenDeviceModel> {
    const storeSnapshot = this.cmsApiStore.getStateSnapshot();
    if (storeSnapshot?.ntkCmsAPiState?.deviceTokenInfoStore) {
      this.deviceTokenInfo = storeSnapshot.ntkCmsAPiState.deviceTokenInfoStore;

      return storeSnapshot.ntkCmsAPiState.deviceTokenInfoStore;
    }
    return await firstValueFrom(this.coreAuthService.ServiceCurrentDeviceToken())
      .then((ret) => {
        this.cmsApiStore.setState({ type: SET_DEVICE_TOKEN_INFO, payload: ret.item });
        this.deviceTokenInfo = ret.item;
        return ret.item;
      });
  }
  getCurrentTokenOnChange(): Observable<TokenInfoModel> {
    return this.cmsApiStore.getState((state) => {
      this.cmsStoreService.setState({ EnumRecordStatusResultStore: null });
      this.tokenInfo = state.ntkCmsAPiState.tokenInfoStore;
      this.setDirectionThemeBylanguage(this.tokenInfo.language);
      this.CheckIsAdmin();
      return state.ntkCmsAPiState.tokenInfoStore;
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
    const storeSnapshot = this.cmsApiStore.getStateSnapshot();
    if (storeSnapshot?.ntkCmsAPiState?.tokenInfoStore) {
      this.tokenInfo = storeSnapshot.ntkCmsAPiState.tokenInfoStore;
    }
    this.cmsApiStoreSubscribe = this.cmsApiStore.getState((state) => state.ntkCmsAPiState.tokenInfoStore).subscribe((value) => {
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

