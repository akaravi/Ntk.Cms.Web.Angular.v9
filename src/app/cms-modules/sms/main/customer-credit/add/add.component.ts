
import {
  ChangeDetectorRef, Component, Inject, OnInit,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  DataFieldInfoModel, ErrorExceptionResult,
  FormInfoModel, InfoEnumModel, SmsEnumService, SmsMainCustomerCreditModel,
  SmsMainCustomerCreditService
} from 'ntk-cms-api';
import { TreeModel } from 'ntk-cms-filemanager';
import { AddBaseComponent } from 'src/app/core/cmsComponent/addBaseComponent';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-sms-customercredit-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class SmsMainCustomerCreditAddComponent extends AddBaseComponent<SmsMainCustomerCreditService, SmsMainCustomerCreditModel, string> implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SmsMainCustomerCreditAddComponent>,
    public smsEnumService: SmsEnumService,
    public SmsMainCustomerCreditService: SmsMainCustomerCreditService,
    private cmsToastrService: CmsToastrService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {
    super(SmsMainCustomerCreditService, new SmsMainCustomerCreditModel(), publicHelper);
    this.loading.cdr = this.cdr; this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];

  fileManagerTree: TreeModel;
  appLanguage = 'fa';

  dataModelResult: ErrorExceptionResult<SmsMainCustomerCreditModel> = new ErrorExceptionResult<SmsMainCustomerCreditModel>();
  dataModel: SmsMainCustomerCreditModel = new SmsMainCustomerCreditModel();


  formInfo: FormInfoModel = new FormInfoModel();

  dataModelEnumApiPathPermissionAccessStatusResult: ErrorExceptionResult<InfoEnumModel> = new ErrorExceptionResult<InfoEnumModel>();
  dataModelEnumApiPathPermissionActionResult: ErrorExceptionResult<InfoEnumModel> = new ErrorExceptionResult<InfoEnumModel>();

  fileManagerOpenForm = false;




  ngOnInit(): void {
    this.formInfo.formTitle = this.translate.instant('TITLE.ADD');

    this.getEnumApiPathPermissionAccessStatus();
    this.getEnumApiPathPermissionAction();
    this.DataGetAccess();
  }

  getEnumApiPathPermissionAccessStatus(): void {
    this.smsEnumService.ServiceSmsApiPathPermissionAccessStatusEnum().subscribe((res) => {
      this.dataModelEnumApiPathPermissionAccessStatusResult = res;
    });
  }
  getEnumApiPathPermissionAction(): void {
    this.smsEnumService.ServiceSmsApiPathPermissionActionEnum().subscribe((res) => {
      this.dataModelEnumApiPathPermissionActionResult = res;
    });
  }

  DataAddContent(): void {
    this.formInfo.formAlert = this.translate.instant('MESSAGE.sending_information_to_the_server');
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.SmsMainCustomerCreditService.ServiceAdd(this.dataModel).subscribe({
      next: (ret) => {
        this.formInfo.formSubmitAllow = true;
        this.dataModelResult = ret;
        if (ret.isSuccess) {
          this.formInfo.formAlert = this.translate.instant('MESSAGE.registration_completed_successfully');
          this.cmsToastrService.typeSuccessAdd();
          this.dialogRef.close({ dialogChangedDate: true });

        } else {
          this.formInfo.formAlert = this.translate.instant('ERRORMESSAGE.MESSAGE.typeError');
          this.formInfo.formError = ret.errorMessage;
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.loading.Stop(pName);
      },
      error: (er) => {
        this.formInfo.formSubmitAllow = true;
        this.cmsToastrService.typeError(er);
        this.loading.Stop(pName);
      }
    }
    );
  }


  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    this.formInfo.formSubmitAllow = false;

    this.DataAddContent();


  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}
