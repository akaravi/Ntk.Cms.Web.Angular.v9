import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { CoreAuthService, TokenInfoModel } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { CmsStoreService } from '../reducers/cmsStore.service';
import { SET_TOKEN_INFO } from '../reducers/reducer.factory';

@Injectable({
  providedIn: 'root'
})
export class CmsAuthGuard implements OnDestroy {
  constructor(
    private coreAuthService: CoreAuthService,
    private cmsStoreService: CmsStoreService,
    private router: Router) {
  }
  debugger
  runSubscribe = false;
  subscriptions: Subscription;
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const token = this.coreAuthService.getUserToken();
    if (!token || token.length === 0) {
      this.router.navigate(['auth'], { queryParams: { returnUrl: state.url } });
      //this.router.navigate(['page'], { queryParams: { returnUrl: state.url } });
      return false;
    }
    const storeSnapshot = this.cmsStoreService.getStateSnapshot();
    let tokenInfo: TokenInfoModel = new TokenInfoModel();
    if (storeSnapshot?.tokenInfoStore) {
      tokenInfo = storeSnapshot.tokenInfoStore;
      if (tokenInfo && tokenInfo.userId > 0) {
        return true;
      }
    }
    this.subscriptions = this.coreAuthService.ServiceCurrentToken().subscribe({
      next: (ret) => {
        this.cmsStoreService.setState({ type: SET_TOKEN_INFO, payload: ret.item });
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
