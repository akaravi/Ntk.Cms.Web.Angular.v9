import { Component, OnInit } from '@angular/core';
import { TokenInfoModel } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss']
})
export class HeaderBarComponent implements OnInit {

  constructor(
    public tokenHelper: TokenHelper,

  ) {
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
    });
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((value) => {
      this.tokenInfo = value;

    });

  }
  cmsApiStoreSubscribe: Subscription;
  tokenInfo = new TokenInfoModel();

  ngOnInit(): void {
  }
  ngOnDestroy() {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
}
