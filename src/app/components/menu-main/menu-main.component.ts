import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CoreCpMainMenuModel, CoreCpMainMenuService, ErrorExceptionResult, TokenInfoModel } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
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
    public translate: TranslateService,
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
  }
  appAngularVersion: string = environment.appVersion;
  appPreviewChangelogUrl: string = environment.appPreviewChangelogUrl;

  loadDemoTheme = environment.loadDemoTheme;
  tokenInfo = new TokenInfoModel();
  cmsApiStoreSubscribe: Subscription;
  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<CoreCpMainMenuModel> = new ErrorExceptionResult<CoreCpMainMenuModel>();
  ngOnInit(): void { }
  DataGetCpMenu(): void {
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName, this.translate.instant('MESSAGE.get_information_list'));
    this.coreCpMainMenuService.ServiceGetAllMenu(null).subscribe({
      next: (ret) => {

        if (ret.isSuccess) {
          this.dataModelResult = ret;
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

}
