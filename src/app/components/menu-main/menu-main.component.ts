import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CoreAuthService, CoreCpMainMenuModel, CoreCpMainMenuService, ErrorExceptionResult, TokenInfoModel } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { ThemeStoreModel } from 'src/app/core/models/themeStoreModel';
import { CmsStoreService } from 'src/app/core/reducers/cmsStore.service';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { ThemeModeType, ThemeService } from 'src/app/core/services/theme.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-menu-main',
  templateUrl: './menu-main.component.html',

})
export class MenuMainComponent implements OnInit {
  env = environment;

  constructor(
    public tokenHelper: TokenHelper,
    public publicHelper: PublicHelper,
    private cmsToastrService: CmsToastrService,
    public coreAuthService: CoreAuthService,
    private coreCpMainMenuService: CoreCpMainMenuService,
    private cmsStoreService: CmsStoreService,
    private router: Router,
    public translate: TranslateService,
    private themeService: ThemeService,
    private cdr: ChangeDetectorRef,) {
    this.publicHelper.processService.cdr = this.cdr;
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
      if (this.tokenInfo && this.tokenInfo.userId > 0 && this.tokenInfo.siteId > 0) {
        setTimeout(() => { this.DataGetCpMenu(); }, 1000);
      }
    });
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((value) => {
      this.tokenInfo = value;
      if (this.tokenInfo && this.tokenInfo.userId > 0 && this.tokenInfo.siteId > 0) {
        setTimeout(() => { this.DataGetCpMenu(); }, 1000);
      }
    });
    this.publicHelper.getReducerCmsStoreOnChange().subscribe((value) => {
      this.themeStore = value.themeStore;
    });
  }
  appAngularVersion: string = environment.appVersion;
  appPreviewChangelogUrl: string = environment.appPreviewChangelogUrl;


  tokenInfo = new TokenInfoModel();
  cmsApiStoreSubscribe: Subscription;
  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<CoreCpMainMenuModel> = new ErrorExceptionResult<CoreCpMainMenuModel>();
  themeStore = new ThemeStoreModel();

  ngOnInit(): void { }
  ngOnDestroy() {
    this.cmsApiStoreSubscribe.unsubscribe();

  }
  DataGetCpMenu(): void {
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.get_information_list').subscribe((str: string) => { this.publicHelper.processService.processStart(pName, str); });
    this.coreCpMainMenuService.ServiceGetAllMenu(null).subscribe({
      next: (ret) => {

        if (ret.isSuccess) {
          this.dataModelResult = ret;
          this.cmsStoreService.setState({ CoreCpMainResultStore: ret });
        } else {
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.publicHelper.processService.processStop(pName);
      },
      error: (er) => {
        this.cmsToastrService.typeError(er);
        this.publicHelper.processService.processStop(pName,false);
      }
    }
    );
  }
  onActionCleanDataMenu(routerAddress: string = ''): void {
    if (routerAddress?.length > 0)
      this.router.navigate([routerAddress]);
    this.themeService.cleanDataMenu();
  }
  onActionClickMenu(item: CoreCpMainMenuModel) {
    // setTimeout(() => {
    //   this.themeStore.dataMenu = '';
    // }, 200);

    if (!item)
      return;
    if (item.children?.length > 0) {
      setTimeout(() => {
        this.router.navigate(['/menu/LinkParentId/', item.id]);
      }, 100);
      return;
    }
    if (item.routeAddressLink?.length > 0) {
      setTimeout(() => {
        this.router.navigate([item.routeAddressLink]);
      }, 1000);
      return;
    }
  }
  onActionThemeSwitch(themeMode: ThemeModeType) {
    this.themeService.updateMode(themeMode);
  }

  async onActionLogout() {
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Sign_out_of_user_account').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructor.name);
    });
    this.cmsToastrService.typeOrderActionLogout();

    this.coreAuthService.ServiceLogout().subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.cmsToastrService.typeSuccessLogout();
          document.location.reload();
        } else {
          this.cmsToastrService.typeErrorLogout();
        }
        this.publicHelper.processService.processStop(pName);
      },
      error: (err) => {
        if (this.cmsToastrService) this.cmsToastrService.typeErrorAccessChange(err);
        this.publicHelper.processService.processStop(pName);
      }
    }
    );

  }
}
