import { Component, OnInit } from '@angular/core';
import { TokenInfoModel } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ThemeStoreModel } from 'src/app/core/models/themeStoreModel';
import { ThemeService } from 'src/app/core/services/theme.service';

@Component({
  selector: 'app-footer-bar',
  templateUrl: './footer-bar.component.html',
  styleUrls: ['./footer-bar.component.scss']
})
export class FooterBarComponent implements OnInit {

  constructor(
    public tokenHelper: TokenHelper,
    public publicHelper: PublicHelper,
    private themeService: ThemeService
  ) {
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
    });
    this.cmsApiStoreSubscribe = this.tokenHelper.geTokenInfoStateOnChange().subscribe((value) => {
      this.tokenInfo = value;

    });
  }
  themeStore = new ThemeStoreModel();
  cmsApiStoreSubscribe: Subscription;
  tokenInfo = new TokenInfoModel();
  ngOnInit(): void {
    this.publicHelper.getStateOnChange().subscribe((value) => {
      this.themeStore = value.themeStore;
    });
  }
  ngOnDestroy() {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  onActionCleanDataMenu(): void {
    this.themeService.cleanDataMenu();
  }
}
