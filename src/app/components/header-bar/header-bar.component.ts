import { Component, OnInit } from '@angular/core';
import { TokenInfoModel } from 'ntk-cms-api';
import { Observable, Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ThemeStoreModel } from 'src/app/core/models/themeStoreModel';
import { CmsStoreService } from 'src/app/core/reducers/cmsStore.service';
import { PageInfoService } from 'src/app/core/services/page-info.service';
import { ThemeService, ThemeModeType } from 'src/app/core/services/theme.service';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss']
})
export class HeaderBarComponent implements OnInit {

  constructor(
    public tokenHelper: TokenHelper,
    private publicHelper: PublicHelper,
    private themeService: ThemeService,
    private pageInfoService: PageInfoService,
  ) {
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
    });
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((value) => {
      this.tokenInfo = value;

    });
    this.publicHelper.getReducerCmsStoreOnChange().subscribe((value) => {
      this.themeStore = value.themeStore;
    });
  }
  cmsApiStoreSubscribe: Subscription;
  tokenInfo = new TokenInfoModel();
  themeStore = new ThemeStoreModel();
  title$: Observable<string>;

  ngOnInit(): void {
    this.title$ = this.pageInfoService.title.asObservable();
  }
  ngOnDestroy() {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  onActionThemeSwitch(themeMode: ThemeModeType) {
    this.themeService.updateMode(themeMode);
  }

}
