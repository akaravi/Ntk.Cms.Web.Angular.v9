import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { CoreAuthService, NtkCmsApiStoreService, SET_TOKEN_INFO, TokenInfoModel } from 'ntk-cms-api';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CmsAuthSiteGuard implements OnDestroy {
  constructor(
    private coreAuthService: CoreAuthService,
    private cmsApiStore: NtkCmsApiStoreService,
    private router: Router) {
  }
  runSubscribe = false;
  subscriptions: Subscription;
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const token = this.coreAuthService.getUserToken();
    if (!token || token.length === 0) {
      this.router.navigate(['auth'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    const storeSnapshot = this.cmsApiStore.getStateSnapshot();
    let tokenInfo: TokenInfoModel = new TokenInfoModel();
    if (storeSnapshot?.ntkCmsAPiState?.tokenInfo) {
      tokenInfo = storeSnapshot.ntkCmsAPiState.tokenInfo;
      if (tokenInfo && tokenInfo.userId > 0 && tokenInfo.siteId > 0) {
        return true;
      }
    }
    this.subscriptions = this.coreAuthService.ServiceCurrentToken().subscribe({
      next: (ret) => {
        this.cmsApiStore.setState({ type: SET_TOKEN_INFO, payload: ret.item });
        tokenInfo = ret.item;
        this.runSubscribe = true;
        return;
      },
      error: (er) => {
        this.runSubscribe = true;
      }
    }
    );
    while (!this.runSubscribe) {
      await this.delay(1000);
    }
    if (!tokenInfo || !tokenInfo.userId || tokenInfo.userId <= 0) {
      this.router.navigate(['auth'], { queryParams: { returnUrl: state.url } });
    }
    if (tokenInfo && tokenInfo.siteId > 0) {
      return true;
    }
    this.router.navigate(['/core/site/selection'], { queryParams: { returnUrl: state.url } });
    return false;
  }
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
