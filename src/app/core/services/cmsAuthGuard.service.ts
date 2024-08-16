import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { CoreAuthService, TokenInfoModel } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { TokenHelper } from '../helpers/tokenHelper';
import { CmsStoreService } from '../reducers/cmsStore.service';

@Injectable({
  providedIn: 'root'
})
export class CmsAuthGuard implements OnDestroy {
  constructor(
    private tokenHelper: TokenHelper,
    private coreAuthService: CoreAuthService,
    private cmsStoreService: CmsStoreService,
    private router: Router) {
  }

  runSubscribe = false;
  subscriptions: Subscription;
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {

    const token = this.tokenHelper.coreAuthService.getUserToken();
    if (!token || token.length === 0) {
      this.router.navigate(['auth'], { queryParams: { returnUrl: state.url } });
      //this.router.navigate(['page'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    let tokenInfo: TokenInfoModel = new TokenInfoModel();
    await this.tokenHelper.getTokenInfoState().then((value) => {
      tokenInfo = value
    });
    if (tokenInfo && tokenInfo.userId > 0 && tokenInfo.siteId > 0)
      return true;

    while (!this.runSubscribe) {
      await this.delay(10000);
    }
    if (tokenInfo && tokenInfo.userId > 0) {
      return true;
    }
    this.router.navigate(['auth'], { queryParams: { returnUrl: state.url } });
    //this.router.navigate(['page'], { queryParams: { returnUrl: state.url } });
    return false;
  }
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
