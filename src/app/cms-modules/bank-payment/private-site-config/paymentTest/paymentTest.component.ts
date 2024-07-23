
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectorRef, Component, Inject, OnInit,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  BankPaymentInjectOnlineTransactionDtoModel, BankPaymentInjectPaymentGotoBankStep2LandingSitePageModel, BankPaymentPrivateSiteConfigModel, BankPaymentPrivateSiteConfigService, CoreEnumService, ErrorExceptionResult, FormInfoModel
} from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
@Component({
  selector: 'app-bankpayment-privateconfig-paymenttest',
  templateUrl: './paymentTest.component.html',
  styleUrls: ['./paymentTest.component.scss'],
})
export class BankPaymentPrivateSiteConfigPaymentTestComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(DOCUMENT) private document: any,
    private dialogRef: MatDialogRef<BankPaymentPrivateSiteConfigPaymentTestComponent>,
    public coreEnumService: CoreEnumService,
    public bankPaymentPrivateSiteConfigService: BankPaymentPrivateSiteConfigService,
    private cmsToastrService: CmsToastrService,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
    public translate: TranslateService,
  ) {
    this.publicHelper.processService.cdr = this.cdr;

    if (data) {
      this.requestLinkPrivateSiteConfigId = +data.linkPrivateSiteConfigId || 0;
    }
    this.dataModel.lastUrlAddressInUse = this.document.location.href;
  }
  requestLinkPrivateSiteConfigId = 0;
  @ViewChild('vform', { static: false }) formGroup: FormGroup;

  dataModelParentSelected: BankPaymentPrivateSiteConfigModel = new BankPaymentPrivateSiteConfigModel();
  dataModel: BankPaymentInjectOnlineTransactionDtoModel = new BankPaymentInjectOnlineTransactionDtoModel();
  dataModelResult: ErrorExceptionResult<BankPaymentInjectPaymentGotoBankStep2LandingSitePageModel>
    = new ErrorExceptionResult<BankPaymentInjectPaymentGotoBankStep2LandingSitePageModel>();
  formInfo: FormInfoModel = new FormInfoModel();
  dataModelResultGotoBank = false;
  ngOnInit(): void {
    if (this.requestLinkPrivateSiteConfigId <= 0) {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }
    this.dataModel.bankPaymentPrivateId = this.requestLinkPrivateSiteConfigId;
  }
  onActionSelectPrivateSiteConfig(model: BankPaymentPrivateSiteConfigModel): void {
    this.dataModel.bankPaymentPrivateId = null;
    this.dataModelParentSelected = model;
    if (model && model.id > 0) {
      this.dataModel.bankPaymentPrivateId = model.id;
    }
  }
  onGotoBank(): void {
    if (this.dataModelResultGotoBank && this.dataModelResult.isSuccess && this.dataModelResult.item.urlToPay.length > 0) {
      this.cmsToastrService.typeSuccessMessage(this.translate.instant('MESSAGE.Transferring_to_the_payment_gateway'));

      this.document.location.href = this.dataModelResult.item.urlToPay;
    }
  }
  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    if (!this.dataModel.bankPaymentPrivateId || this.dataModel.bankPaymentPrivateId <= 0) {
      this.cmsToastrService.typeErrorFormInvalid();
    }
    if (!this.dataModel.amount || this.dataModel.amount <= 0) {
      this.cmsToastrService.typeErrorFormInvalid();
    }
    this.formInfo.formSubmitAllow = false;
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructor.name);
    });

    this.bankPaymentPrivateSiteConfigService.ServiceTestPay(this.dataModel).subscribe(
      {
        next: (ret) => {
          this.formInfo.formSubmitAllow = true;
          this.dataModelResult = ret;
          if (ret.isSuccess) {
            localStorage.setItem('TransactionId', ret.item.transactionId.toString());
            this.formInfo.formAlert = this.translate.instant('MESSAGE.Payment_request_was_successfully_registered');
            this.cmsToastrService.typeSuccessMessage(this.translate.instant('MESSAGE.Payment_request_was_successfully_registered'));
            this.dataModelResultGotoBank = true;
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
    );
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}
