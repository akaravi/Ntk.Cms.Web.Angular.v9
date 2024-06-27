
import {
  ChangeDetectorRef, Component, Inject, OnInit,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  AuthMobileConfirmDtoModel, CaptchaModel, CoreAuthService, CoreEnumService,
  CoreUserService, DataFieldInfoModel,
  ErrorExceptionResultBase,
  FormInfoModel
} from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-core-user-mobile-confirm',
  templateUrl: './mobileConfirm.component.html',

})
export class CoreUserMobileConfirmComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CoreUserMobileConfirmComponent>,
    public coreEnumService: CoreEnumService,
    public coreUserService: CoreUserService,
    private coreAuthService: CoreAuthService,
    private cmsToastrService: CmsToastrService,
    private publicHelper: PublicHelper,
    private tokenHelper: TokenHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => { this.loading.message = str; });

  }
  firstRun = true;
  expireDate: Date;
  aoutoCaptchaOrder = 1;
  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResultBase = new ErrorExceptionResultBase;
  dataModel: AuthMobileConfirmDtoModel = new AuthMobileConfirmDtoModel();
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  passwordIsValid = false;
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  captchaModel: CaptchaModel = new CaptchaModel();

  formInfo: FormInfoModel = new FormInfoModel();
  onCaptchaOrderInProcess = false;
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


  ngOnInit(): void {
    this.onCaptchaOrder();
    this.formInfo.formTitle = this.translate.instant('ACTION.CONFIRMEMAIL');
    this.tokenHelper.getCurrentToken().then((value) => {
      this.dataModel.mobile = value.mobile;
      this.dataModel.linkUserId = value.userId;

    });


    this.DataGetAccess();
  }


  DataGetAccess(): void {
    const pName = this.constructor.name + 'DataGetAccess';
    this.publicHelper.processService.processStart(pName);

    this.coreUserService
      .ServiceViewModel()
      .subscribe({
        next: (ret) => {
          if (ret.isSuccess) {
            this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
          } else {
            this.cmsToastrService.typeErrorGetAccess(ret.errorMessage);
          }
          this.publicHelper.processService.processStop(pName);
        },
        error: (er) => {
          this.cmsToastrService.typeErrorGetAccess(er);
          this.publicHelper.processService.processStop(pName, false);
        }
      }
      );
  }
  stepOne = true;
  stepTwo = false;
  onMobileConfirm(): void {
    this.dataModel.captchaKey = this.captchaModel.key;
    this.coreAuthService.ServiceMobileConfirm(this.dataModel).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.cmsToastrService.typeSuccessMobileConfirm();
          if (this.stepOne) {
            this.stepOne = false;
            this.stepTwo = true;
          } else if (this.stepTwo) {
            this.dialogRef.close({ dialogChangedDate: true });
          }
        } else {
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
          this.firstRun = false;
          this.formInfo.buttonSubmittedEnabled = true;
          this.onCaptchaOrder();
        }
      }
    });
  }
  onOtpChange(otp) {
    this.dataModel.code = otp;
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }

  onCaptchaOrder(): void {
    if (this.onCaptchaOrderInProcess) {
      return;
    }
    this.dataModel.captchaText = '';
    const pName = this.constructor.name + '.ServiceCaptcha';
    this.publicHelper.processService.processStart(pName, this.translate.instant('MESSAGE.get_security_photo_content'));
    this.coreAuthService.ServiceCaptcha().subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.captchaModel = ret.item;
          this.expireDate = ret.item.expire;//.split('+')[1];
          const startDate = new Date();
          const endDate = new Date(ret.item.expire);
          const seconds = (endDate.getTime() - startDate.getTime());
          if (this.aoutoCaptchaOrder < 10) {
            this.aoutoCaptchaOrder = this.aoutoCaptchaOrder + 1;
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
