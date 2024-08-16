import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CoreAuthService, CoreCpMainMenuModel, CoreCpMainMenuService, ErrorExceptionResult, TokenInfoModel } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ThemeStoreModel } from 'src/app/core/models/themeStoreModel';
import { CmsStoreService } from 'src/app/core/reducers/cmsStore.service';
import { SET_CpMain_Menu } from 'src/app/core/reducers/reducer.factory';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { ThemeModeType, ThemeService } from 'src/app/core/services/theme.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-menu-main',
  templateUrl: './menu-main.component.html',

})
export class MenuMainComponent implements OnInit {
  env = environment;
  constructorInfoAreaId = this.constructor.name;
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
    this.tokenHelper.getTokenInfoState().then((value) => {
      this.tokenInfo = value;
      if (this.tokenInfo && this.tokenInfo.userId > 0 && this.tokenInfo.siteId > 0) {
        //setTimeout(() => { 
        this.DataGetCpMenu();
        //}, 1000);
      }
    });
    this.cmsApiStoreSubscribe = this.tokenHelper.getTokenInfoStateOnChange().subscribe((value) => {
      this.tokenInfo = value;
      if (this.tokenInfo && this.tokenInfo.userId > 0 && this.tokenInfo.siteId > 0) {
        //setTimeout(() => {
        this.DataGetCpMenu();
        // }, 1000);
      }
    });
    this.publicHelper.getStateOnChange().subscribe((value) => {
      this.themeStore = value.themeStore;
    });
  }
  appAngularVersion: string = environment.appVersion;
  appPreviewChangelogUrl: string = environment.appPreviewChangelogUrl;


  tokenInfo = new TokenInfoModel();
  cmsApiStoreSubscribe: Subscription;

  dataModelResult: ErrorExceptionResult<CoreCpMainMenuModel> = new ErrorExceptionResult<CoreCpMainMenuModel>();
  themeStore = new ThemeStoreModel();

  ngOnInit(): void { }
  ngOnDestroy() {
    this.cmsApiStoreSubscribe.unsubscribe();

  }
  DataGetCpMenu(): void {
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.get_information_list').subscribe((str: string) => { this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId); });
    this.coreCpMainMenuService.ServiceGetAllMenu(null).subscribe({
      next: (ret) => {

        if (ret.isSuccess) {
          this.dataModelResult = ret;
          this.cmsStoreService.setState({ type: SET_CpMain_Menu, payload: ret });
        } else {
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.publicHelper.processService.processStop(pName);
      },
      error: (er) => {
        this.cmsToastrService.typeError(er);
        this.publicHelper.processService.processStop(pName, false);
      }
    }
    );
  }
  onActionCleanDataMenu(routerAddress: string = ''): void {
    if (routerAddress?.length > 0)
      this.router.navigate([routerAddress]);
    this.themeService.cleanDataMenu();
  }
  onActionClickMenu(item: CoreCpMainMenuModel, event?: MouseEvent) {
    // setTimeout(() => {
    //   this.themeStore.dataMenu = '';
    // }, 200);

    if (!item)
      return;
    const pName = this.constructor.name + "menu";
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => { this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId); });
    if (item.children?.length > 0) {
      //setTimeout(() => {
      if (event?.ctrlKey) {
        window.open('/#/menu/LinkParentId/' + item.id, "_blank");
      } else {
        this.router.navigate(['/menu/LinkParentId/', item.id]);
      }
      this.publicHelper.processService.processStop(pName);
      //}, 100);
      return;
    }
    if (item.routeAddressLink?.length > 0) {
      //setTimeout(() => {
      if (event?.ctrlKey) {
        window.open('/#' + item.routeAddressLink, "_blank");
      } else {
        this.router.navigate([item.routeAddressLink]);
      }
      this.publicHelper.processService.processStop(pName);
      //}, 100);
      return;
    }
  }
  onActionThemeSwitch(themeMode: ThemeModeType) {
    this.themeService.updateThemeModeType(themeMode);
  }

  async onActionLogout() {
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Sign_out_of_user_account').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
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
