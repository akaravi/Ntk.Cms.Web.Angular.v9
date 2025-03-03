
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsTranslationService } from 'src/app/core/i18n/translation.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  standalone: false
})
export class AuthComponent implements OnInit {
  constructorInfoAreaId = this.constructor.name;
  constructor(
    private router: Router,
    public publicHelper: PublicHelper,
    public tokenHelper: TokenHelper,
    public translate: CmsTranslationService,
    private cdr: ChangeDetectorRef) {
    this.publicHelper.processService.cdr = this.cdr;
    this.tokenHelper.getTokenInfoState().then((value) => {
      if (value != null && value.token?.length > 0 && value.userId > 0 && value.siteId > 0)
        setTimeout(() => this.router.navigate(['/dashboard']), 500);
      else if (value != null && value.token?.length > 0 && value.userId > 0)
        setTimeout(() => this.router.navigate(['/core/site/selection']), 500);
    });

  }

  today: Date = new Date();
  //tesettt = 'gfjhgjh';
  showSplashModel = true;
  ngOnInit(): void {
    // this.translate.get('ACTION.ABOUT').subscribe((translation: string) => {
    //   console.log('Translated subscribe:', translation);
    // });

    // this.tesettt = this.translate.instant('ACTION.ABOUT');
    // console.log('Translated instant:', this.tesettt);


    if (window.innerWidth < environment.cmsViewConfig.mobileWindowInnerWidth) {
      setTimeout(() => {
        this.showSplashModel = false;
        this.cdr.markForCheck();
      }, 5000);
    }

  }

}
