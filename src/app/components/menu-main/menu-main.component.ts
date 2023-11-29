import { I } from '@angular/cdk/keycodes';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CoreCpMainMenuModel, CoreCpMainMenuService, ErrorExceptionResult, TokenInfoModel } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { ThemeStoreModel } from 'src/app/core/models/themeStoreModel';
import { CmsStoreService } from 'src/app/core/reducers/cmsStore.service';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { ThemeService, ThemeModeType } from 'src/app/core/services/theme.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-menu-main',
  templateUrl: './menu-main.component.html',
  styleUrls: ['./menu-main.component.scss']
})
export class MenuMainComponent implements OnInit {

  constructor(
    public tokenHelper: TokenHelper,
    public publicHelper: PublicHelper,
    private cmsToastrService: CmsToastrService,
    private coreCpMainMenuService: CoreCpMainMenuService,
    private cmsStoreService: CmsStoreService,
    private router: Router,
    public translate: TranslateService,
    private themeService: ThemeService,
    private cdr: ChangeDetectorRef,) {
    this.loading.cdr = this.cdr;
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

  loadDemoTheme = environment.loadDemoTheme;
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
    this.loading.Start(pName, this.translate.instant('MESSAGE.get_information_list'));
    this.coreCpMainMenuService.ServiceGetAllMenu(null).subscribe({
      next: (ret) => {

        if (ret.isSuccess) {
          this.dataModelResult = ret;
          this.cmsStoreService.setState({ CoreCpMainResultStore: ret });
        } else {
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.loading.Stop(pName);
      },
      error: (er) => {
        this.cmsToastrService.typeError(er);
        this.loading.Stop(pName);
      }
    }
    );
  }
  onActionCleanDataMenu(): void {
    this.themeService.cleanDataMenu();
  }
  onActionClickMenu(item: CoreCpMainMenuModel) {
    setTimeout(() => {
      this.themeStore.dataMenu = '';
    }, 1000);

    if (!item)
      return;
    if (item.children?.length > 0) {
      setTimeout(() => {
        this.router.navigate(['/menu/LinkParentId/', item.id]);
      }, 1000);
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

}
