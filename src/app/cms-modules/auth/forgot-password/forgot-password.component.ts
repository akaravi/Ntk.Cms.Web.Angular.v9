
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  AuthUserForgetPasswordEntryPinCodeModel, AuthUserForgetPasswordModel, CaptchaModel,
  CoreAuthService, FormInfoModel
} from 'ntk-cms-api';
import { Observable } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { PageInfoService } from 'src/app/core/services/page-info.service';
enum ErrorStates {
  NotSubmitted,
  HasError,
  NoError,
}
@Component({
    selector: 'app-auth-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    standalone: false
})
export class AuthForgotPasswordComponent implements OnInit {
  constructorInfoAreaId = this.constructor.name;
  constructor(
    private coreAuthService: CoreAuthService,
    private cmsToastrService: CmsToastrService,
    public translate: TranslateService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
    public pageInfo: PageInfoService,

  ) {
    this.publicHelper.processService.cdr = this.cdr;

    this.RePasswordModel = '';
  }
  errorState: ErrorStates = ErrorStates.NotSubmitted;
  errorStates = ErrorStates;
  isLoading$: Observable<boolean>;
  dataModelforgetPasswordBySms: AuthUserForgetPasswordModel = new AuthUserForgetPasswordModel();
  dataModelforgetPasswordByEmail: AuthUserForgetPasswordModel = new AuthUserForgetPasswordModel();
  dataModelforgetPasswordEntryPinCode: AuthUserForgetPasswordEntryPinCodeModel = new AuthUserForgetPasswordEntryPinCodeModel();
  captchaModel: CaptchaModel = new CaptchaModel();
  // private fields
  forgetState = 'sms';
  countAutoCaptchaOrder = 1;
  formInfo: FormInfoModel = new FormInfoModel();
  passwordIsValid = false;
  RePasswordModel = '';
  onCaptchaOrderInProcess = false;
  ngOnInit(): void {
    this.onCaptchaOrder();
    this.pageInfo.updateTitle(this.translate.instant('AUTH.FORGOT.TITLE'));
  }
  onActionSubmitOrderCodeBySms(): void {
    this.formInfo.buttonSubmittedEnabled = false;
    this.errorState = ErrorStates.NotSubmitted;
    this.dataModelforgetPasswordBySms.captchaKey = this.captchaModel.key;
    this.dataModelforgetPasswordEntryPinCode.email = '';
    this.dataModelforgetPasswordEntryPinCode.mobile = this.dataModelforgetPasswordBySms.mobile;
    const pName = this.constructor.name + '.ServiceForgetPassword';
    this.translate.get('AUTH.FORGOT.REQUEST_PASSWORD_REMINDER').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });
    this.coreAuthService
      .ServiceForgetPassword(this.dataModelforgetPasswordBySms)
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.cmsToastrService.typeSuccessMessage(this.translate.instant('MESSAGE.The_activation_code_was_texted_with_you'));
            this.forgetState = 'entrycode';
          }
          else {
            this.cmsToastrService.typeErrorMessage(res.errorMessage);
          }
          this.formInfo.buttonSubmittedEnabled = true;
          this.onCaptchaOrder();
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
  onActionSubmitOrderCodeByEmail(): void {
    this.formInfo.buttonSubmittedEnabled = false;
    this.errorState = ErrorStates.NotSubmitted;
    this.dataModelforgetPasswordByEmail.captchaKey = this.captchaModel.key;
    this.dataModelforgetPasswordEntryPinCode.mobile = '';
    this.dataModelforgetPasswordEntryPinCode.email = this.dataModelforgetPasswordByEmail.email;
    const pName = this.constructor.name + '.ServiceForgetPassword';
    this.translate.get('AUTH.FORGOT.REQUEST_PASSWORD_REMINDER').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });
    this.coreAuthService
      .ServiceForgetPassword(this.dataModelforgetPasswordByEmail)
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.cmsToastrService.typeSuccessMessage(this.translate.instant('MESSAGE.The_activation_code_was_emailed_to_you'));
            this.forgetState = 'entrycode';
          }
          else {
            this.cmsToastrService.typeErrorMessage(res.errorMessage);
          }
          this.formInfo.buttonSubmittedEnabled = true;
          this.onCaptchaOrder();
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
  onActionSubmitEntryPinCode(): void {
    this.formInfo.buttonSubmittedEnabled = false;
    this.errorState = ErrorStates.NotSubmitted;
    this.dataModelforgetPasswordEntryPinCode.captchaKey = this.captchaModel.key;
    const pName = this.constructor.name + '.ServiceForgetPasswordEntryPinCode';

    this.translate.get('MESSAGE.Check_the_code_on_the_server').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });
    this.coreAuthService
      .ServiceForgetPasswordEntryPinCode(this.dataModelforgetPasswordEntryPinCode)
      .subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.cmsToastrService.typeSuccessMessage(this.translate.instant('MESSAGE.Your_password_was_changed_successfully'));
            setTimeout(() => this.router.navigate(['/']), 1000);
          }
          else {
            this.cmsToastrService.typeErrorMessage(res.errorMessage);
          }
          this.formInfo.buttonSubmittedEnabled = true;
          this.onCaptchaOrder();
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

    this.dataModelforgetPasswordBySms.captchaText = '';
    const pName = this.constructor.name + '.ServiceCaptcha';

    this.translate.get('MESSAGE.get_security_photo_content').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });
    this.coreAuthService.ServiceCaptcha().subscribe({
      next: (ret) => {
        this.captchaModel = ret.item;
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
  changeforgetState(model: string): void {
    this.forgetState = model;
  }
}
