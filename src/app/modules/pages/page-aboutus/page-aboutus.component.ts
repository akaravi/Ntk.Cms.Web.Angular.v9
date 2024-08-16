import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CoreSiteModel, CoreSiteService, ErrorExceptionResult, TokenInfoModel } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { PageInfoService } from 'src/app/core/services/page-info.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-page-aboutus',
  templateUrl: './page-aboutus.component.html',
})
export class PageAboutusComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor(public pageInfo: PageInfoService,
    public translate: TranslateService,
    private tokenHelper: TokenHelper,
    private coreSiteService: CoreSiteService,
    private cmsToastrService: CmsToastrService,
    public publicHelper: PublicHelper,
  ) {

    this.tokenHelper.getTokenInfoState().then((value) => {
      this.tokenInfo = value;
      if (this.tokenInfo.siteId > 0)
        this.SiteInfo(this.tokenInfo.siteId);
      else
        this.SiteInfo(0);
    });
    this.cmsApiStoreSubscribe = this.tokenHelper.getTokenInfoStateOnChange().subscribe({
      next: (ret) => {
        this.tokenInfo = ret;
        if (this.tokenInfo.siteId > 0)
          this.SiteInfo(this.tokenInfo.siteId);
        else
          this.SiteInfo(0);
      }
    });

  }
  cmsApiStoreSubscribe: Subscription;
  tokenInfo = new TokenInfoModel();

  dataModelResult: ErrorExceptionResult<CoreSiteModel> = new ErrorExceptionResult<CoreSiteModel>();
  loadDemoTheme = environment.loadDemoTheme;
  ngOnInit(): void {
    this.pageInfo.updateTitle(this.translate.instant('ACTION.ABOUT'));
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  SiteInfo(linkSiteId: number): void {
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });

    this.coreSiteService.ServiceMasterSiteInfo(linkSiteId).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.dataModelResult = ret;
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
}
