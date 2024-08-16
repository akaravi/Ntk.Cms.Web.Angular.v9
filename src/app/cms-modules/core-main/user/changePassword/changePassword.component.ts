
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import {
  ChangeDetectorRef, Component, Inject,
  OnDestroy, OnInit,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { TranslateService } from '@ngx-translate/core';
import {
  AccessModel, AuthUserChangePasswordModel, CoreAuthService, CoreEnumService, CoreUserModel, DataFieldInfoModel, ErrorExceptionResult,
  FormInfoModel,
  TokenInfoModel
} from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-core-user-changepassword',
  templateUrl: './changePassword.component.html',
  styleUrls: ['./changePassword.component.scss'],
})
export class CoreUserChangePasswordComponent implements OnInit, OnDestroy {
  requestLinkUserId = 0;
  constructorInfoAreaId = this.constructor.name;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CoreUserChangePasswordComponent>,
    public coreEnumService: CoreEnumService,
    public coreAuthService: CoreAuthService,
    private cmsToastrService: CmsToastrService,
    public translate: TranslateService,
    private tokenHelper: TokenHelper,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
  ) {
    this.publicHelper.processService.cdr = this.cdr;

    if (data) {
      this.requestLinkUserId = +data.linkUserId || 0;
    }
    this.NewPasswordRepeat = '';
  }
  tokenInfo = new TokenInfoModel();

  NewPasswordRepeat: string;
  passwordIsValid = false;



  dataModelResult: ErrorExceptionResult<CoreUserModel> = new ErrorExceptionResult<CoreUserModel>();
  dataModel: AuthUserChangePasswordModel = new AuthUserChangePasswordModel();
  @ViewChild('vform', { static: false }) formGroup: FormGroup;

  formInfo: FormInfoModel = new FormInfoModel();

  dataAccessModel: AccessModel;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  fileManagerOpenForm = false;

  dataCoreUserIds: number[] = [];
  cmsApiStoreSubscribe: Subscription;

  ngOnInit(): void {
    this.formInfo.formTitle = 'تغییر کلمه عبور  ';
    this.tokenHelper.getTokenInfoState().then((value) => {
      this.tokenInfo = value;
    });

    this.cmsApiStoreSubscribe = this.tokenHelper.getTokenInfoStateOnChange().subscribe({
      next: (ret) => {
        this.tokenInfo = ret;
      }
    });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  DataEditContent(): void {
    this.translate.get('MESSAGE.sending_information_to_the_server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });

    if (this.requestLinkUserId > 0) {
      this.dataModel.linkUserId = this.requestLinkUserId;
    }
    this.coreAuthService.ServiceChangePassword(this.dataModel).subscribe({
      next: (ret) => {
        this.formInfo.formSubmitAllow = true;
        if (ret.isSuccess) {
          this.translate.get('MESSAGE.registration_completed_successfully').subscribe((str: string) => { this.formInfo.formAlert = str; });
          this.cmsToastrService.typeSuccessEdit();
          this.dialogRef.close({ dialogChangedDate: true });
        } else {
          this.translate.get('ERRORMESSAGE.MESSAGE.typeError').subscribe((str: string) => { this.formInfo.formAlert = str; });
          this.formInfo.formError = ret.errorMessage;
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.publicHelper.processService.processStop(pName);

      },
      error: (er) => {
        this.formInfo.formSubmitAllow = true;
        this.cmsToastrService.typeError(er);
        this.publicHelper.processService.processStop(pName, false);
      }
    }
    );
  }
  passwordValid(event): void {
    this.passwordIsValid = event;
  }
  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    if (this.tokenInfo.userAccessAdminAllowToProfessionalData) {
      if (!this.dataModel.oldPassword || this.dataModel.oldPassword.length === 0) {
        this.dataModel.oldPassword = '000';
      }
    } else {
      if (!this.dataModel.oldPassword || this.dataModel.oldPassword.length === 0) {
        this.cmsToastrService.typeErrorMessage(this.translate.instant('MESSAGE.Enter_the_previous_password'));

        return;
      }
    }
    if (!this.dataModel.newPassword || this.dataModel.newPassword.length === 0) {
      this.cmsToastrService.typeErrorMessage(this.translate.instant('MESSAGE.Enter_the_new_password'));



      return;
    }
    if (this.dataModel.newPassword !== this.NewPasswordRepeat) {
      this.cmsToastrService.typeErrorMessage(this.translate.instant('MESSAGE.The_new_password_is_equivalent_to_a_duplicate'));


      return;
    }
    this.formInfo.formSubmitAllow = false;
    this.DataEditContent();
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
  onStepClick(event: StepperSelectionEvent, stepper: MatStepper): void {
    if (event.previouslySelectedIndex < event.selectedIndex) {
      if (!this.formGroup.valid) {
        this.cmsToastrService.typeErrorFormInvalid();
        setTimeout(() => {
          stepper.selectedIndex = event.previouslySelectedIndex;
          // stepper.previous();
        }, 10);
      }
    }
  }

}
