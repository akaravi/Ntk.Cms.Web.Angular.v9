
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectorRef, Component, Inject, OnInit
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  BankPaymentInjectPaymentGotoBankStep1CalculateModel,
  BankPaymentInjectPaymentGotoBankStep2LandingSitePageModel, BankPaymentPrivateSiteConfigModel,
  CoreModuleSiteUserCreditCalculateDtoModel,
  CoreModuleSiteUserCreditPaymentDtoModel, CoreModuleSiteUserCreditService, ErrorExceptionResult,
  FormInfoModel
} from 'ntk-cms-api';

import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-coremodule-site-user-credit-charge-payment',
  templateUrl: './charge-payment.component.html',
  styleUrls: ['./charge-payment.component.scss'],
})
export class CoreModuleSiteUserCreditChargePaymentComponent implements OnInit {
  requestCredit = 0;
  requestLinkModuleId = 0;
  requestBankPrivateMaster = false;
  constructorInfoAreaId = this.constructor.name;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(DOCUMENT) private document: any,
    private dialogRef: MatDialogRef<CoreModuleSiteUserCreditChargePaymentComponent>,
    private cmsToastrService: CmsToastrService,
    private coreModuleSiteUserCreditService: CoreModuleSiteUserCreditService,
    public translate: TranslateService,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
  ) {
    this.publicHelper.processService.cdr = this.cdr;

    if (data) {
      if (data.credit && data.credit > 0) {
        this.requestCredit = data.credit;
      }
      if (data.linkModuleId && data.linkModuleId > 0) {
        this.requestLinkModuleId = data.linkModuleId;
      }
    }
    if (this.requestCredit === 0) {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }
    if (this.requestLinkModuleId === 0) {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }

    this.dataModelCalculate.credit = this.requestCredit;
    this.dataModelCalculate.linkModuleId = this.requestLinkModuleId;
    this.dataModelPayment.credit = this.requestCredit;
    this.dataModelPayment.linkModuleId = this.requestLinkModuleId;
    this.dataModelPayment.lastUrlAddressInUse = this.document.location.href;
  }
  viewCalculate = false;


  dataModelResult: ErrorExceptionResult<BankPaymentPrivateSiteConfigModel> = new ErrorExceptionResult<BankPaymentPrivateSiteConfigModel>();
  dataModelCalculateResult: ErrorExceptionResult<BankPaymentInjectPaymentGotoBankStep1CalculateModel>
    = new ErrorExceptionResult<BankPaymentInjectPaymentGotoBankStep1CalculateModel>();
  dataModelPaymentResult: ErrorExceptionResult<BankPaymentInjectPaymentGotoBankStep2LandingSitePageModel>
    = new ErrorExceptionResult<BankPaymentInjectPaymentGotoBankStep2LandingSitePageModel>();

  dataModelCalculate: CoreModuleSiteUserCreditCalculateDtoModel = new CoreModuleSiteUserCreditCalculateDtoModel();
  dataModelPayment: CoreModuleSiteUserCreditPaymentDtoModel = new CoreModuleSiteUserCreditPaymentDtoModel();
  formInfo: FormInfoModel = new FormInfoModel();


  ngOnInit(): void {
    this.formInfo.formTitle = this.translate.instant('TITLE.Select_Payment_Gateway');

  }

  DataCalculate(): void {
    this.viewCalculate = false;
    const pName = this.constructor.name + 'ServiceOrderCalculate';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructor.name);
    });
    this.coreModuleSiteUserCreditService.ServiceOrderCalculate(this.dataModelCalculate).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.dataModelCalculateResult = ret;
          this.viewCalculate = true;
        }
        else {
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.publicHelper.processService.processStop(pName);

      },
      error: (er) => {
        this.cmsToastrService.typeError(er);

        this.publicHelper.processService.processStop(pName, false);
      }
    }
    );
  }
  DataPayment(): void {
    this.formInfo.formSubmitAllow = false;
    const pName = this.constructor.name + 'ServiceOrderPayment';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructor.name);
    });
    this.coreModuleSiteUserCreditService.ServiceOrderPayment(this.dataModelPayment).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.dataModelPaymentResult = ret;
          this.cmsToastrService.typeSuccessMessage(this.translate.instant('MESSAGE.Transferring_to_the_payment_gateway'));
          localStorage.setItem('TransactionId', ret.item.transactionId.toString());
          this.document.location.href = this.dataModelPaymentResult.item.urlToPay;
        }
        else {
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
          this.formInfo.formSubmitAllow = true;
        }
        this.publicHelper.processService.processStop(pName);

      },
      error: (er) => {
        this.cmsToastrService.typeError(er);
        this.formInfo.formSubmitAllow = true;
        this.publicHelper.processService.processStop(pName);
      }
    }
    );
  }
  onActionSelectCalculate(model: BankPaymentPrivateSiteConfigModel): void {
    this.dataModelCalculate.bankPaymentPrivateId = model.id;
    this.dataModelPayment.bankPaymentPrivateId = model.id;
    this.DataCalculate();
  }
  onActionSelectBankPayment(): void {

    this.DataPayment();
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}
