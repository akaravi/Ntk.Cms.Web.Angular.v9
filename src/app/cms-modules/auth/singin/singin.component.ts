
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthUserSignInModel, CaptchaModel, CoreAuthService, FormInfoModel } from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsTranslationService } from 'src/app/core/i18n/translation.service';
import { ConnectionStatusModel } from 'src/app/core/models/connectionStatusModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { PageInfoService } from 'src/app/core/services/page-info.service';
import { environment } from 'src/environments/environment';
@Component({
    selector: 'app-auth-singin',
    templateUrl: './singin.component.html',
    standalone: false
})
export class AuthSingInComponent implements OnInit {
  constructorInfoAreaId = this.constructor.name;
  constructor(
    private cmsToastrService: CmsToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private coreAuthService: CoreAuthService,
    private cmsTranslationService: CmsTranslationService,
    public translate: TranslateService,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
    public pageInfo: PageInfoService,
    public tokenHelper: TokenHelper,

  ) {
    this.publicHelper.processService.cdr = this.cdr;
    this.firstRun = true;
    this.publicHelper.getStateOnChange().subscribe((value) => {
      this.connectionStatus = value.connectionStatusStore;
    });
  }

  loadDemoTheme = environment.loadDemoTheme;
  connectionStatus = new ConnectionStatusModel();
  firstRun = true;
  hidePassword = true;

  formInfo: FormInfoModel = new FormInfoModel();
  dataModel: AuthUserSignInModel = new AuthUserSignInModel();
  captchaModel: CaptchaModel = new CaptchaModel();
  expireDate: Date;
  countAutoCaptchaOrder = 1;
  // KeenThemes mock, change it to:
  hasError: boolean;
  returnUrl: string;
  loginType = 'email';
  onCaptchaOrderInProcess = false;
  onNavigate = false;
  ngOnInit(): void {
    this.onCaptchaOrder();
    // get return url from route parameters or default to '/'
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'.toString()] || '/';
    if (this.firstRun) {
      this.dataModel.captchaText = '0000';
    }
    this.pageInfo.updateTitle(this.translate.instant('AUTH.SINGINBYSMS.TITLE'));
  }
  onActionSubmit(): void {
    this.formInfo.buttonSubmittedEnabled = false;
    this.hasError = false;
    this.dataModel.captchaKey = this.captchaModel.key;
    this.dataModel.lang = this.cmsTranslationService.getSelectedLanguage();
    const pName = this.constructor.name + '.ServiceSigninUser';
    this.translate.get('MESSAGE.login_to_user_account').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });
    const siteId = + localStorage.getItem('siteId');
    if (siteId > 0) {
      this.dataModel.siteId = siteId;
    }
    this.coreAuthService.ServiceSigninUser(this.dataModel).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.cmsToastrService.typeSuccessLogin();
          if (res.item.siteId > 0) {
            this.onNavigate = true;
            setTimeout(() => this.router.navigate(['/dashboard']), 500);
          }
          else {
            this.onNavigate = true;
            setTimeout(() => this.router.navigate(['/core/site/selection']), 500);
          }
        } else {
          this.firstRun = false;
          this.formInfo.buttonSubmittedEnabled = true;
          this.cmsToastrService.typeErrorLogin(res.errorMessage);
          this.onCaptchaOrder();
        }

        this.publicHelper.processService.processStop(pName);
      },
      error: (er) => {
        this.firstRun = false;
        this.formInfo.buttonSubmittedEnabled = true;
        this.cmsToastrService.typeError(er);
        this.onCaptchaOrder();
        this.publicHelper.processService.processStop(pName);
      }
    }
    );
  }
  onloginTypeChange(model: string): void {
    this.loginType = model;
  }
  onCaptchaOrder(): void {
    if (this.onCaptchaOrderInProcess) {
      return;
    }
    this.countAutoCaptchaOrder = this.countAutoCaptchaOrder + 1;
    this.dataModel.captchaText = '';
    const pName = this.constructor.name + '.ServiceCaptcha';
    this.translate.get('MESSAGE.get_security_photo_content').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });
    this.coreAuthService.ServiceCaptcha().subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.captchaModel = ret.item;
          this.expireDate = ret.item.expire;//.split('+')[1];
          const startDate = new Date();
          const endDate = new Date(ret.item.expire);
          const seconds = (endDate.getTime() - startDate.getTime());
          if (this.countAutoCaptchaOrder < 10) {
            setTimeout(() => {
              if (!this.firstRun)
                this.onCaptchaOrder();
            }, seconds);
          }
        } else {
          this.cmsToastrService.typeErrorGetCpatcha(ret.errorMessage);
        }
        this.onCaptchaOrderInProcess = false;
        this.publicHelper.processService.processStop(pName);
      },
      error: (er) => {
        this.onCaptchaOrderInProcess = false;
        this.publicHelper.processService.processStop(pName);
      }
    }
    );
  }
}
