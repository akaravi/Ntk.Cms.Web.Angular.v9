import { Component, OnInit } from '@angular/core';
import { TokenInfoModel } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ThemeStoreModel } from 'src/app/core/models/themeStoreModel';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss']
})
export class HeaderBarComponent implements OnInit {

  constructor(
    public tokenHelper: TokenHelper,
    private publicHelper: PublicHelper,
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

  ngOnInit(): void {
  }
  ngOnDestroy() {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
}
