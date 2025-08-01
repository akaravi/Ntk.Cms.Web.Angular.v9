
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthUserSignInModel, AuthUserSignUpModel, CaptchaModel, CoreAuthService, FormInfoModel } from 'ntk-cms-api';
import { Observable } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { PageInfoService } from 'src/app/core/services/page-info.service';
import { environment } from 'src/environments/environment';
import { SingupRuleComponent } from '../singupRule/singupRule.Component';
@Component({
  selector: 'app-auth-singup',
  templateUrl: './singup.component.html',
  standalone: false
})
export class AuthSingUpComponent implements OnInit, OnDestroy {
  constructorInfoAreaId = this.constructor.name;
  constructor(
    private cmsToastrService: CmsToastrService,
    private router: Router,
    private coreAuthService: CoreAuthService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
    public translate: TranslateService,
    public pageInfo: PageInfoService,

  ) {
    this.publicHelper.processService.cdr = this.cdr;

  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;

  formInfo: FormInfoModel = new FormInfoModel();
  roulaccespt = '';
  isLoading$: Observable<boolean>;
  captchaModel: CaptchaModel = new CaptchaModel();
  expireDate: Date;
  countAutoCaptchaOrder = 1;
  passwordIsValid = false;
  dataModel: AuthUserSignUpModel = new AuthUserSignUpModel();
  onCaptchaOrderInProcess = false;
  RePasswordModel = '';
  PasswordView = false;
  loginAuto = false;
  hidePassword = true;
  loadDemoTheme = environment.loadDemoTheme;
  onNavigate = false;

  ngOnInit(): void {
    this.onCaptchaOrder();
    this.pageInfo.updateTitle(this.translate.instant('AUTH.REGISTER.SIGNUP'));
  }
  ngOnDestroy(): void {
  }
  onActionSubmit(): void {
    if (!this.dataModel.email || this.dataModel.email.length === 0) {
      this.formInfo.formError = this.translate.instant('ERRORMESSAGE.MESSAGE.enter_your_email_address');
      this.formInfo.formErrorStatus = true;
      this.cmsToastrService.typeErrorRegistery(this.formInfo.formError);
      return;
    }
    if (!this.dataModel.name || this.dataModel.name.length === 0) {
      this.formInfo.formError = this.translate.instant('ERRORMESSAGE.MESSAGE.enter_your_name');
      this.formInfo.formErrorStatus = true;
      this.cmsToastrService.typeErrorRegistery(this.formInfo.formError);
      return;
    }
    if (!this.dataModel.family || this.dataModel.family.length === 0) {
      this.formInfo.formError = this.translate.instant('ERRORMESSAGE.MESSAGE.enter_your_last_name');
      this.formInfo.formErrorStatus = true;
      this.cmsToastrService.typeErrorRegistery(this.formInfo.formError);
      return;
    }
    if (!this.dataModel.password || this.dataModel.password.length === 0) {
      this.formInfo.formError = this.translate.instant('ERRORMESSAGE.MESSAGE.enter_the_password');
      this.formInfo.formErrorStatus = true;
      this.cmsToastrService.typeErrorRegistery(this.formInfo.formError);
      return;
    }
    if (!this.RePasswordModel || this.RePasswordModel.length === 0) {
      this.formInfo.formError = this.translate.instant('ERRORMESSAGE.MESSAGE.re_enter_the_password');
      this.formInfo.formErrorStatus = true;
      this.cmsToastrService.typeErrorRegistery(this.formInfo.formError);
      return;
    }
    if (!this.dataModel.captchaText || this.dataModel.captchaText.length === 0) {

      this.formInfo.formErrorStatus = true;
      this.cmsToastrService.typeErrorRegistery(this.formInfo.formError);
      return;
    }
    if (this.dataModel.password !== this.RePasswordModel) {
      this.formInfo.formError = this.translate.instant('ERRORMESSAGE.MESSAGE.password_and_re_password_are_different');
      this.dataModel.password = '';
      this.RePasswordModel = '';
      this.formInfo.formErrorStatus = true;
      this.cmsToastrService.typeErrorRegistery(this.formInfo.formError);
      return;
    }
    this.formInfo.formErrorStatus = false;
    this.dataModel.captchaKey = this.captchaModel.key;
    const pName = this.constructor.name + '.ServiceSignupUser';
    this.translate.get('MESSAGE.Creating_new_account').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });
    /** read storage */
    const siteId = + localStorage.getItem('siteId');
    if (siteId > 0) {
      this.dataModel.siteId = siteId;
    }
    const ResellerSiteId = + localStorage.getItem('ResellerSiteId');
    if (ResellerSiteId > 0) {
      this.dataModel.resellerSiteId = ResellerSiteId;
    }
    const ResellerUserId = + localStorage.getItem('ResellerUserId');
    if (ResellerUserId > 0) {
      this.dataModel.resellerUserId = ResellerUserId;
    }
    /** read storage */
    this.coreAuthService.ServiceSignupUser(this.dataModel).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.cmsToastrService.typeSuccessRegistery();
          this.formInfo.formErrorStatus = false;
          if (!this.loginAuto) {
            setTimeout(() => this.router.navigate(['/']), 500);
          }
          /** Login */
          if (this.loginAuto) {
            const dataLoginModel = new AuthUserSignInModel();
            dataLoginModel.captchaKey = this.dataModel.captchaKey;
            dataLoginModel.captchaText = this.dataModel.captchaText;
            dataLoginModel.email = this.dataModel.email;
            dataLoginModel.password = this.dataModel.password;
            dataLoginModel.siteId = this.dataModel.siteId;
            dataLoginModel.mobile = this.dataModel.mobile;
            const pName2 = this.constructor.name + 'ServiceSigninUser';
            this.translate.get('MESSAGE.login_to_user_account').subscribe((str: string) => {
              this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
            });
            this.coreAuthService.ServiceSigninUser(dataLoginModel).subscribe({
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
                  this.formInfo.buttonSubmittedEnabled = true;
                  this.cmsToastrService.typeErrorLogin(res.errorMessage);
                  setTimeout(() => this.router.navigate(['/']), 500);
                }
                this.publicHelper.processService.processStop(pName2);
              },
              error: (err) => {
                this.formInfo.buttonSubmittedEnabled = true;
                this.cmsToastrService.typeError(err);
                this.publicHelper.processService.processStop(pName2);
              }
            }
            );
          }
          /** Login */
        } else {
          this.cmsToastrService.typeErrorRegistery(ret.errorMessage);
          this.formInfo.buttonSubmittedEnabled = true;
          this.formInfo.formErrorStatus = true;
          this.onCaptchaOrder();
        }
        this.publicHelper.processService.processStop(pName);
      }, error: (err) => {
        this.cmsToastrService.typeError(err);
        this.formInfo.formErrorStatus = true;
        this.formInfo.buttonSubmittedEnabled = true;
        this.onCaptchaOrder();
        this.publicHelper.processService.processStop(pName);
      }
    });
  }
  onRoulaccespt(): void {
    if (this.roulaccespt)
      return;
    const dialogRef = this.dialog.open(SingupRuleComponent, {
      height: "90%",
      width: "90%",
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      this.roulaccespt = result;
      //console.log(result);
    });
  }
  passwordValid(event): void {
    this.passwordIsValid = event;
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
    this.coreAuthService.ServiceCaptcha()
      .subscribe({
        next: (ret) => {
          if (ret.isSuccess) {
            this.captchaModel = ret.item;
            this.expireDate = ret.item.expire;//.split('+')[1];
            const startDate = new Date();
            const endDate = new Date(ret.item.expire);
            const seconds = (endDate.getTime() - startDate.getTime());
            if (this.countAutoCaptchaOrder < 10) {
              this.countAutoCaptchaOrder = this.countAutoCaptchaOrder + 1;
              setTimeout(() => { this.onCaptchaOrder(); }, seconds);
            }
          } else {
            this.cmsToastrService.typeErrorGetCpatcha(ret.errorMessage);
          }
          this.onCaptchaOrderInProcess = false;
          this.publicHelper.processService.processStop(pName);
        }
        , error: (err) => {
          this.onCaptchaOrderInProcess = false;
          this.publicHelper.processService.processStop(pName);
        }
      }
      );
  }
  ActionPasswordGenerator(): void {
    // const chars = '0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    const passwordLength = 10;
    let password = '';
    for (let i = 0; i <= passwordLength; i++) {
      const randomNumber = Math.floor(Math.random() * chars.length);
      password += chars.substring(randomNumber, randomNumber + 1);
    }
    this.dataModel.password = password;
    this.RePasswordModel = password;
    this.PasswordView = true;
  }
}
