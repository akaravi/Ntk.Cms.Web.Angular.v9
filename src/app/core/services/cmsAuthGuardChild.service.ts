import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot
} from '@angular/router';
import { CoreAuthService, TokenInfoModel } from 'ntk-cms-api';
import { TokenHelper } from '../helpers/tokenHelper';

@Injectable({
  providedIn: 'root'
})
export class CmsAuthGuardChild implements CanActivateChild {
  constructor(private tokenHelper: TokenHelper, private router: Router) {
  }
  async canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const token = this.tokenHelper.coreAuthService.getUserToken();
    if (!token || token.length === 0) {
      this.router.navigate(['auth'], { queryParams: { returnUrl: state.url } });
      return false;
    }
    let tokenInfo: TokenInfoModel = new TokenInfoModel();
    await this.tokenHelper.getTokenInfoState().then((value) => {
      tokenInfo = value
    });
    if (tokenInfo && tokenInfo.userId > 0)
      return true;

    this.router.navigate(['auth'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
