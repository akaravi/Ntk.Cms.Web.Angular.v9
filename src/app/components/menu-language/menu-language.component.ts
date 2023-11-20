import { I } from '@angular/cdk/keycodes';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthRenewTokenModel, CoreAuthService, CoreCpMainMenuModel, CoreCpMainMenuService, ErrorExceptionResult, TokenInfoModel } from 'ntk-cms-api';
import { filter, Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { TranslationService } from 'src/app/core/i18n/translation.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { ThemeStoreModel } from 'src/app/core/models/themeStoreModel';
import { CmsStoreService } from 'src/app/core/reducers/cmsStore.service';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { environment } from 'src/environments/environment';
interface LanguageFlag {
  lang: string;
  name: string;
  flag: string;
  active?: boolean;
}
@Component({
  selector: 'app-menu-language',
  templateUrl: './menu-language.component.html',
  styleUrls: ['./menu-language.component.scss']
})
export class MenuLanguageComponent implements OnInit {
  static nextId = 0;
  id = ++MenuLanguageComponent.nextId;
  constructor(
    private translationService: TranslationService,
    public coreAuthService: CoreAuthService,
    private cmsToastrService: CmsToastrService,
    private tokenHelper: TokenHelper,
    private router: Router,
    private publicHelper:PublicHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
    });


    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((value) => {
      this.tokenInfo = value;

      this.setLanguage(value.language);
    });
  }
  themeStore = new ThemeStoreModel();

  language: LanguageFlag;
  languages: LanguageFlag[] = [
    {
      lang: 'fa',
      name: 'فارسی',
      flag: './assets/media/flags/iran.svg',
    },
    {
      lang: 'ar',
      name: 'عربی',
      flag: './assets/media/flags/united-arab-emirates.svg',
    },
    {
      lang: 'en',
      name: 'English',
      flag: './assets/media/flags/united-states.svg',
    },
    {
      lang: 'zh',
      name: 'China',// 'Mandarin',
      flag: './assets/media/flags/china.svg',
    },
    {
      lang: 'es',
      name: 'Spanish',
      flag: './assets/media/flags/spain.svg',
    },
    {
      lang: 'ja',
      name: 'Japanese',
      flag: './assets/media/flags/japan.svg',
    },
    {
      lang: 'de',
      name: 'German',
      flag: './assets/media/flags/germany.svg',
    },
    {
      lang: 'fr',
      name: 'French',
      flag: './assets/media/flags/france.svg',
    }
  ];
  cmsApiStoreSubscribe: Subscription;
  tokenInfo: TokenInfoModel = new TokenInfoModel();
  ngOnInit(): void {
    this.setSelectedLanguage();
    this.router.events.pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((event) => {
        this.setSelectedLanguage();
      });
    var lastLang = this.translationService.getSelectedLanguage()
    if (lastLang?.length > 0) {
      const indexId = this.languages.findIndex(x => x.lang == lastLang);
      const to = 0;
      if (indexId > 0)
        this.languages.splice(to, 0, this.languages.splice(indexId, 1)[0]);
    }
    this.publicHelper.getReducerCmsStoreOnChange().subscribe((value) => {
      this.themeStore = value.themeStore;
    });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  setLanguageWithRefresh(lang: string): void {
    this.setLanguage(lang);
    /** */
    if (this.tokenInfo && this.tokenInfo.userId > 0) {
      const authModel: AuthRenewTokenModel = new AuthRenewTokenModel();
      authModel.userAccessAdminAllowToProfessionalData = this.tokenInfo.userAccessAdminAllowToProfessionalData;
      authModel.userAccessAdminAllowToAllData = this.tokenInfo.userAccessAdminAllowToAllData;
      authModel.userId = this.tokenInfo.userId;
      authModel.siteId = this.tokenInfo.siteId;
      authModel.lang = lang;

      const title = this.translate.instant('TITLE.Information');
      const message = this.translate.instant('MESSAGE.Request_to_change_language_was_sent_to_the_server');
      this.cmsToastrService.toastr.info(message, title);
      // this.loadingStatus = true;
      this.coreAuthService.ServiceRenewToken(authModel).subscribe(
        {
          next: (ret) => {
            // this.loadingStatus = false;
            if (ret.isSuccess) {
              this.tokenInfo = ret.item;
              if (ret.item.language === lang) {
                this.cmsToastrService.toastr.success(this.translate.instant('MESSAGE.New_language_acess_confirmed'), title);
                this.translate.use(ret.item.language);
              } else {
                this.cmsToastrService.toastr.warning(this.translate.instant('ERRORMESSAGE.MESSAGE.New_language_acess_denied'), title);
              }
            } else {
              this.cmsToastrService.typeErrorAccessChange(ret.errorMessage);
            }
            this.cdr.detectChanges();
          },
          error: (err) => {
            this.cmsToastrService.typeErrorAccessChange(err);
          }
        }
      );
    }
    else if (lang && lang.length > 0) {
      this.tokenHelper.setDirectionThemeBylanguage(lang);
    }
    /** */
  }

  setLanguage(lang: string): void {
    this.languages.forEach((language: LanguageFlag) => {
      if (language.lang === lang) {
        language.active = true;
        this.language = language;
      } else {
        language.active = false;
      }
    });

    this.translationService.setLanguage(lang);
  }

  setSelectedLanguage(): any {
    this.setLanguage(this.translationService.getSelectedLanguage());
  }

}
