
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  AuthUserSignInBySmsDtoModel, CaptchaModel,
  CoreAuthService,
  FormInfoModel
} from 'ntk-cms-api';
import { Observable, Subscription, interval } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsTranslationService } from 'src/app/core/i18n/translation.service';
import { ConnectionStatusModel } from 'src/app/core/models/connectionStatusModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { PageInfoService } from 'src/app/core/services/page-info.service';
enum ErrorStates {
  NotSubmitted,
  HasError,
  NoError,
}
export class processModel {
  progressBarValue: number;
  progressBarMaxValue: number;
  message: string;
}
@Component({
  selector: 'app-auth-singin-bysms',
  templateUrl: './singin-bysms.component.html',
})
export class AuthSingInBySmsComponent implements OnInit {
  constructorInfoAreaId = this.constructor.name;
  constructor(
    private coreAuthService: CoreAuthService,
    private cmsToastrService: CmsToastrService,
    public translate: TranslateService,
    private router: Router,
    private cmsTranslationService: CmsTranslationService,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
    public pageInfo: PageInfoService,
  ) {
    this.publicHelper.processService.cdr = this.cdr;

    this.RePasswordModel = '';
    this.publicHelper.getStateOnChange().subscribe((value) => {
      this.connectionStatus = value.connectionStatusStore;
    });

  }
  connectionStatus = new ConnectionStatusModel();
  errorState: ErrorStates = ErrorStates.NotSubmitted;
  errorStates = ErrorStates;
  isLoading$: Observable<boolean>;
  dataModelAuthUserSignInBySms: AuthUserSignInBySmsDtoModel = new AuthUserSignInBySmsDtoModel();
  captchaModel: CaptchaModel = new CaptchaModel();
  diffSecondsSubscribe: Subscription;
  // private fields
  forgetState = 'sms';
  countAutoCaptchaOrder = 1;
  formInfo: FormInfoModel = new FormInfoModel();
  passwordIsValid = false;
  RePasswordModel = '';
  onCaptchaOrderInProcess = false;
  diffSeconds: number;
  onNavigate=false;
  ngOnInit(): void {
    this.onCaptchaOrder();
    this.pageInfo.updateTitle(this.translate.instant('AUTH.SINGINBYSMS.TITLE'));
  }

  prorocess: processModel;
  buttonnResendSmsDisable = true;
  otpConfig = {
    allowNumbersOnly: true,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '50px',
      'height': '50px',
      'margin': '5px',
    }
  }
  onOtpChange(otp) {
    this.dataModelAuthUserSignInBySms.code = otp;
  }
  private downloadTimer: any;

  onActionSubmitOrderCodeBySms(): void {

    if (this.forgetState == 'entrycode') {
      if (!this.dataModelAuthUserSignInBySms.captchaText || this.dataModelAuthUserSignInBySms.captchaText.length == 0) {
        this.cmsToastrService.typeWarningMessage(this.translate.instant('ERRORMESSAGE.MESSAGE.typeErrorSetCpatcha'));
        return;
      }
      this.dataModelAuthUserSignInBySms.code = '';
    }

    this.formInfo.buttonSubmittedEnabled = false;
    this.errorState = ErrorStates.NotSubmitted;
    this.dataModelAuthUserSignInBySms.captchaKey = this.captchaModel.key;
    this.dataModelAuthUserSignInBySms.lang = this.cmsTranslationService.getSelectedLanguage();
    const pName = this.constructor.name + '.ServiceSigninUserBySMS';

    this.translate.get('MESSAGE.Send_login_request_with_one_time_password').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });
    this.coreAuthService
      .ServiceSigninUserBySMS(this.dataModelAuthUserSignInBySms)
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.cmsToastrService.typeSuccessMessage(this.translate.instant('MESSAGE.The_login_code_was_texted_with_you'));
            this.forgetState = 'entrycode';
            //TimeDown
            this.prorocess = new processModel();
            this.prorocess.progressBarValue = 0;
            this.prorocess.progressBarMaxValue = 60;
            this.prorocess.message = '';
            this.buttonnResendSmsDisable = true;
            var timeleft = this.prorocess.progressBarMaxValue;
            this.downloadTimer = setInterval(() => {
              this.prorocess.progressBarValue = this.prorocess.progressBarMaxValue - timeleft;
              this.prorocess.message = '(' + timeleft + ' ' + this.translate.instant('MESSAGE.SECONDS') + ')';
              timeleft -= 1;
              if (timeleft <= 0) {
                this.buttonnResendSmsDisable = false;
                this.prorocess.message = '';
                clearInterval(this.downloadTimer);
              }
              this.cdr.detectChanges();

            }, 500)
            //TimeDown
          }
          else {
            this.cmsToastrService.typeErrorMessage(res.errorMessage);
          }
          this.formInfo.buttonSubmittedEnabled = true;
          if (this.countAutoCaptchaOrder < 10) {
          if (!this.captchaModel || this.diffSeconds < 2) {
            this.onCaptchaOrder();
          }
        }
          this.publicHelper.processService.processStop(pName);
        },
        error: (er) => {
          this.cmsToastrService.typeError(er);
          this.formInfo.buttonSubmittedEnabled = true;
          this.onCaptchaOrder();
          this.publicHelper.processService.processStop(pName);
        }
      });
  }
  ngOnDestroy() {
    clearInterval(this.downloadTimer);
  }
  onActionSubmitEntryPinCode(): void {
    this.formInfo.buttonSubmittedEnabled = false;
    this.errorState = ErrorStates.NotSubmitted;
    this.dataModelAuthUserSignInBySms.captchaKey = this.captchaModel.key;
    this.dataModelAuthUserSignInBySms.lang = this.cmsTranslationService.getSelectedLanguage();
    const pName = this.constructor.name + '.ServiceSigninUserBySMS';
    this.translate.get('MESSAGE.Send_login_request_with_one_time_password').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });
    /** read storage */
    const siteId = + localStorage.getItem('siteId');
    if (siteId > 0) {
      this.dataModelAuthUserSignInBySms.siteId = siteId;
    }
    const ResellerSiteId = + localStorage.getItem('ResellerSiteId');
    if (ResellerSiteId > 0) {
      this.dataModelAuthUserSignInBySms.resellerSiteId = ResellerSiteId;
    }
    const ResellerUserId = + localStorage.getItem('ResellerUserId');
    if (ResellerUserId > 0) {
      this.dataModelAuthUserSignInBySms.resellerUserId = ResellerUserId;
    }
    /** read storage */
    this.coreAuthService
      .ServiceSigninUserBySMS(this.dataModelAuthUserSignInBySms)
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.cmsToastrService.typeSuccessLogin();
            this.formInfo.buttonSubmittedEnabled = false;
            if (res.item.siteId > 0) {
              this.onNavigate = true;
              setTimeout(() => this.router.navigate(['/dashboard']), 500);
            }
            else {
              this.onNavigate = true;
              setTimeout(() => this.router.navigate(['/core/site/selection']), 500);
            }
          }
          else {
            this.onCaptchaOrder();
            this.cmsToastrService.typeErrorMessage(res.errorMessage);
          }
          this.formInfo.buttonSubmittedEnabled = true;
          this.publicHelper.processService.processStop(pName);
        },
        error: (er) => {
          this.cmsToastrService.typeError(er);
          this.formInfo.buttonSubmittedEnabled = true;
          this.onCaptchaOrder();
          this.publicHelper.processService.processStop(pName);
        }
      }
      );
  }
  passwordValid(event): void {
    this.passwordIsValid = event;
  }
  onCaptchaOrder(): void {
    if (this.onCaptchaOrderInProcess) {
      return;
    }
    this.countAutoCaptchaOrder = this.countAutoCaptchaOrder + 1;
    if (this.diffSecondsSubscribe)
      this.diffSecondsSubscribe.unsubscribe();
    this.dataModelAuthUserSignInBySms.captchaText = '';
    const pName = this.constructor.name + '.ServiceCaptcha';
    this.translate.get('MESSAGE.get_security_photo_content').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });
    this.coreAuthService.ServiceCaptcha().subscribe({
      next: (ret) => {
        this.captchaModel = ret.item;
        this.onCaptchaOrderInProcess = false;
        this.diffSecondsSubscribe = interval(500).subscribe(x => {
          this.diffSeconds = new Date(this.captchaModel.expire).getTime() - new Date().getTime();

          if (this.diffSeconds < 0 && this.countAutoCaptchaOrder < 10) {
            this.diffSecondsSubscribe.unsubscribe();
            this.onCaptchaOrder();
          }
        });
        this.publicHelper.processService.processStop(pName);
      },
      error: (er) => {
        this.onCaptchaOrderInProcess = false;
        this.publicHelper.processService.processStop(pName);
      }
    }
    );
  }

  changeforgetState(model: string): void {
    this.forgetState = model;
  }
}
