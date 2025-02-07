import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CoreCpMainMenuModel, CoreCpMainMenuService, CoreModuleModel, ErrorExceptionResult, TokenInfoModel } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsStoreService } from 'src/app/core/reducers/cmsStore.service';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { PageInfoService } from 'src/app/core/services/page-info.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-page-dashboard',
    templateUrl: './page-dashboard.component.html',
    styleUrls: ['./page-dashboard.component.scss'],
    standalone: false
})
export class PageDashboardComponent implements OnInit {
  constructorInfoAreaId = this.constructor.name;
  constructor(
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
    public tokenHelper: TokenHelper,
    public pageInfo: PageInfoService,
    private coreCpMainMenuService: CoreCpMainMenuService,
    private cmsToastrService: CmsToastrService,
    private cmsStoreService: CmsStoreService,
    private router: Router,
  ) {
    this.publicHelper.processService.cdr = this.cdr;
  }
  tokenInfo = new TokenInfoModel();
  cmsApiStoreSubscribe: Subscription;
  env = environment;
  loadDemoTheme = environment.loadDemoTheme;
  dataCoreModuleModelResult: ErrorExceptionResult<CoreModuleModel> = new ErrorExceptionResult<CoreModuleModel>();
  dataModelResult: ErrorExceptionResult<CoreCpMainMenuModel> = new ErrorExceptionResult<CoreCpMainMenuModel>();
  dataPinListResult: CoreCpMainMenuModel[] = [];
  checkModuleExist: Map<string, CoreModuleModel> = new Map<string, CoreModuleModel>();
  ngOnInit(): void {
    this.tokenHelper.getTokenInfoState().then((value) => {
      this.tokenInfo = value;
      this.getCurrentSiteModule();
      this.loadData();
      this.cdr.detectChanges();
    });

    this.cmsApiStoreSubscribe = this.tokenHelper.getTokenInfoStateOnChange().subscribe({
      next: (ret) => {
        this.tokenInfo = ret;
        this.getCurrentSiteModule();
        this.loadData();
        this.cdr.detectChanges();
      }
    });
    localStorage.removeItem('siteId');
    this.pageInfo.updateTitle(this.translate.instant('ROUTE.DASHBOARD'));
  }
  async getCurrentSiteModule(): Promise<void> {
    this.dataCoreModuleModelResult = await this.publicHelper.getCurrentSiteModule();
    this.checkModuleExist = new Map<string, CoreModuleModel>();
    if (this.dataCoreModuleModelResult && this.dataCoreModuleModelResult.listItems)
      this.dataCoreModuleModelResult.listItems.forEach((el) => this.checkModuleExist[el.className.toLowerCase()] = el);
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  loadData() {

    if (this.tokenInfo && this.tokenInfo.userId > 0 && this.tokenInfo.siteId > 0) {
      setTimeout(() => {
        const storeSnapshot = this.cmsStoreService.getStateSnapshot();
        if (storeSnapshot?.coreCpMainResultStore?.isSuccess && storeSnapshot?.coreCpMainResultStore?.listItems?.length > 0) {
          this.dataModelResult = storeSnapshot.coreCpMainResultStore;
          this.DataPinListSelect();
        } else {
          this.DataGetCpMenu();
        }
      }, 200);
    }
  }
  DataGetCpMenu(): void {
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.get_information_list').subscribe((str: string) => { this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId); });
    this.coreCpMainMenuService.ServiceGetAllMenu(null).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.dataModelResult = ret;
          this.DataPinListSelect();
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
  onActionClickMenu(item: CoreCpMainMenuModel, event?: MouseEvent) {
    if (!item)
      return;
    const pName = this.constructor.name + "menu";
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => { this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId); });
    if (item.children?.length > 0) {
      if (event?.ctrlKey) {
        window.open('/#/menu/LinkParentId/' + item.id, "_blank");
      } else {
        this.router.navigate(['/menu/LinkParentId/', item.id]);
      }
      setTimeout(() => this.publicHelper.processService.processStop(pName), 500);
      return;
    }
    if (item.routeAddressLink?.length > 0) {
      if (event?.ctrlKey) {
        window.open('/#' + item.routeAddressLink, "_blank");
      } else {
        this.router.navigate([item.routeAddressLink]);
      }
      setTimeout(() => this.publicHelper.processService.processStop(pName), 500);

      return;
    }
  }
  updateThemeMenuPinToggel(id: number): void {
    this.publicHelper.themeService.updateThemeMenuPinToggel(id);
    this.DataPinListSelect()
  }
  DataPinListSelect() {
    this.dataPinListResult = [];
    if (this.publicHelper.themeService?.ThemeMenuPin?.length > 0) {
      this.dataModelResult.listItems.forEach((rowS1) => {
        rowS1['parentTitle'] = '.';
        if (this.publicHelper.themeService?.ThemeMenuPin[rowS1.id])
          this.dataPinListResult.push(rowS1);
        rowS1.children.forEach((rowS2) => {
          rowS2['parentTitle'] = rowS1.titleML
          if (this.publicHelper.themeService?.ThemeMenuPin[rowS2.id])
            this.dataPinListResult.push(rowS2);
          rowS2.children.forEach((rowS3) => {
            rowS3['parentTitle'] = rowS2.titleML
            if (this.publicHelper.themeService?.ThemeMenuPin[rowS3.id])
              this.dataPinListResult.push(rowS3);
          });
        });
      });
    }
  }
}
