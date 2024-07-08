
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectorRef, Component, Inject,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  CoreEnumService, ErrorExceptionResult, FormInfoModel, SmsApiSendMessageTestDtoModel,
  SmsApiSendResultModel, SmsMainApiPathModel, SmsMainApiPathService
} from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';


@Component({
  selector: 'app-sms-privateconfig-sendtest',
  templateUrl: './sendTest.component.html',
  styleUrls: ['./sendTest.component.scss'],
})
export class SmsMainApiPathSendTestComponent implements OnInit {
  requestLinkApiPathId = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(DOCUMENT) private document: any,
    private dialogRef: MatDialogRef<SmsMainApiPathSendTestComponent>,
    public coreEnumService: CoreEnumService,
    public smsMainApiPathService: SmsMainApiPathService,
    private cmsToastrService: CmsToastrService,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
    public translate: TranslateService,
  ) {
    this.publicHelper.processService.cdr = this.cdr;
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => { this.loading.message = str; });

    if (data && data.linkApiPathId) {
      this.requestLinkApiPathId = data.linkApiPathId;
    }
    // this.dataModel.lastUrlAddressInUse = this.document.location.href;
  }

  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  loading = new ProgressSpinnerModel();
  dataModelParentSelected: SmsMainApiPathModel = new SmsMainApiPathModel();
  dataModel: SmsApiSendMessageTestDtoModel = new SmsApiSendMessageTestDtoModel();
  dataModelResult: ErrorExceptionResult<SmsApiSendResultModel> = new ErrorExceptionResult<SmsApiSendResultModel>();
  formInfo: FormInfoModel = new FormInfoModel();
  sendByShow = false;

  ngOnInit(): void {
    if (this.requestLinkApiPathId.length <= 0) {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }
    this.dataModel.linkApiPathId = this.requestLinkApiPathId;
  }



  onActionSelectPrivateSiteConfig(model: SmsMainApiPathModel): void {
    this.dataModel.linkApiPathId = this.requestLinkApiPathId;
    this.dataModelParentSelected = model;
    if (model && model.id.length > 0) {
      this.dataModel.linkApiPathId = model.id;

      this.sendByShow = false;
      if (model.apiAbilitySendByDirect)
        this.dataModel.sendByQueue = false;
      if (model.apiAbilitySendByQueue)
        this.dataModel.sendByQueue = true;
      if (model.apiAbilitySendByQueue && model.apiAbilitySendByDirect)
        this.sendByShow = true;
    }
  }

  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    if (!this.dataModel.linkApiPathId || this.dataModel.linkApiPathId.length <= 0) {
      this.cmsToastrService.typeErrorFormInvalid();
    }
    this.formInfo.formSubmitAllow = false;
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructor.name);
    });

    this.smsMainApiPathService.ServiceSendMessageTest(this.dataModel).subscribe({
      next: (ret) => {
        this.formInfo.formSubmitAllow = true;
        this.dataModelResult = ret;
        if (ret.isSuccess) {
          this.formInfo.formAlert = this.translate.instant('MESSAGE.Submit_request_was_successfully_registered');
          this.cmsToastrService.typeSuccessMessage(this.translate.instant('MESSAGE.Send_request_was_successfully_registered'));
        } else {
          this.translate.get('ERRORMESSAGE.MESSAGE.typeError').subscribe((str: string) => { this.formInfo.formAlert = str; });
          this.formInfo.formError = ret.errorMessage;
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.publicHelper.processService.processStop(pName);

      },
      error: (err) => {
        this.formInfo.formSubmitAllow = true;
        this.cmsToastrService.typeError(err);
        this.publicHelper.processService.processStop(pName);

      }
    }
    );//).toPromise();
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}
