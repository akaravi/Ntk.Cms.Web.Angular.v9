
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectorRef, Component, Inject, OnInit
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  BankPaymentInjectPaymentGotoBankStep1CalculateModel,
  BankPaymentInjectPaymentGotoBankStep2LandingSitePageModel, BankPaymentPrivateSiteConfigModel,
  DonateModuleCalculateDtoModel,
  DonateModulePaymentDtoModel, DonateTransactionService, ErrorExceptionResult,
  FormInfoModel
} from 'ntk-cms-api';

import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-donate-target-period-charge-payment',
  templateUrl: './charge-payment.component.html',
  styleUrls: ['./charge-payment.component.scss'],
})
export class DonateTargetPeriodChargePaymentComponent implements OnInit {
  requestsupportPayment = 0;
  requestLinkTargetPeriodId = 0;
  requestBankPrivateMaster = false;
  constructorInfoAreaId = this.constructor.name;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(DOCUMENT) private document: any,
    private dialogRef: MatDialogRef<DonateTargetPeriodChargePaymentComponent>,
    private cmsToastrService: CmsToastrService,
    private donateTransactionService: DonateTransactionService,
    public translate: TranslateService,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
  ) {
    this.publicHelper.processService.cdr = this.cdr;
    if (data) {
      if (data.supportPayment && data.supportPayment > 0) {
        this.requestsupportPayment = data.supportPayment;
      }
      if (data.linkTargetPeriodId && data.linkTargetPeriodId > 0) {
        this.requestLinkTargetPeriodId = data.linkTargetPeriodId;
      }
    }
    if (this.requestsupportPayment === 0) {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }
    if (this.requestLinkTargetPeriodId === 0) {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }

    this.dataModelCalculate.supportPayment = this.requestsupportPayment;
    this.dataModelCalculate.linkTargetPeriodId = this.requestLinkTargetPeriodId;
    this.dataModelPayment.supportPayment = this.requestsupportPayment;
    this.dataModelPayment.linkTargetPeriodId = this.requestLinkTargetPeriodId;
    this.dataModelPayment.lastUrlAddressInUse = this.document.location.href;
  }
  viewCalculate = false;


  dataModelResult: ErrorExceptionResult<BankPaymentPrivateSiteConfigModel> = new ErrorExceptionResult<BankPaymentPrivateSiteConfigModel>();
  dataModelCalculateResult: ErrorExceptionResult<BankPaymentInjectPaymentGotoBankStep1CalculateModel>
    = new ErrorExceptionResult<BankPaymentInjectPaymentGotoBankStep1CalculateModel>();
  dataModelPaymentResult: ErrorExceptionResult<BankPaymentInjectPaymentGotoBankStep2LandingSitePageModel>
    = new ErrorExceptionResult<BankPaymentInjectPaymentGotoBankStep2LandingSitePageModel>();

  dataModelCalculate: DonateModuleCalculateDtoModel = new DonateModuleCalculateDtoModel();
  dataModelPayment: DonateModulePaymentDtoModel = new DonateModulePaymentDtoModel();
  formInfo: FormInfoModel = new FormInfoModel();


  ngOnInit(): void {
    this.formInfo.formTitle = this.translate.instant('TITLE.Select_Payment_Gateway');

  }

  DataCalculate(): void {
    this.viewCalculate = false;
    const pName = this.constructor.name + 'ServiceOrderCalculate';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });
    this.donateTransactionService.ServiceOrderCalculate(this.dataModelCalculate).subscribe({
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
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });
    this.donateTransactionService.ServiceOrderPayment(this.dataModelPayment).subscribe({
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
        this.publicHelper.processService.processStop(pName)
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
