import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CoreModuleModel, ErrorExceptionResult, TokenInfoModel } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { PageInfoService } from 'src/app/core/services/page-info.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-page-dashboard',
  templateUrl: './page-dashboard.component.html',
  styleUrls: ['./page-dashboard.component.scss']
})
export class PageDashboardComponent implements OnInit {

  constructor(
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
    public tokenHelper: TokenHelper,
    public pageInfo: PageInfoService,
  ) {
    this.publicHelper.processService.cdr = this.cdr;
    

  }
  tokenInfo = new TokenInfoModel();
  cmsApiStoreSubscribe: Subscription;
  env = environment;
  loadDemoTheme = environment.loadDemoTheme;
  dataCoreModuleModelResult: ErrorExceptionResult<CoreModuleModel> = new ErrorExceptionResult<CoreModuleModel>();

  checkModuleExist: Map<string, CoreModuleModel> = new Map<string, CoreModuleModel>();
  ngOnInit(): void {
    this.tokenHelper.getTokenInfoState().then((value) => {
      this.tokenInfo = value;
      this.getCurrentSiteModule();
      this.cdr.detectChanges();
    });
    this.cmsApiStoreSubscribe = this.tokenHelper
      .getTokenInfoStateOnChange()
      .subscribe({
        next: (ret) => {
          this.tokenInfo = ret;
          this.getCurrentSiteModule();
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
}
