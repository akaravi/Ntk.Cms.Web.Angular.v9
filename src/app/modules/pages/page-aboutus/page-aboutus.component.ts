import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TokenInfoModel } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { PageInfoService } from 'src/app/core/services/page-info.service';

@Component({
  selector: 'app-page-aboutus',
  templateUrl: './page-aboutus.component.html',
})
export class PageAboutusComponent implements OnInit {

  constructor(public pageInfo: PageInfoService, public translate: TranslateService,private tokenHelper: TokenHelper,) { 

    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
      
    });
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {
      this.tokenInfo = next;
      
    });

  }
  cmsApiStoreSubscribe: Subscription;
  tokenInfo = new TokenInfoModel();

  ngOnInit(): void {
    this.pageInfo.updateTitle(this.translate.instant('ACTION.ABOUT'));
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
}
