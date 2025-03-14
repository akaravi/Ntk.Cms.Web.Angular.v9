import {
  ChangeDetectorRef, Component, Inject,
  OnInit
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  BankPaymentEnumService, BankPaymentTransactionModel, BankPaymentTransactionService, ErrorExceptionResult, InfoEnumModel, TransactionRecordStatusEnum
} from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
    selector: 'app-cms-bankpayment-transaction-info',
    templateUrl: './cms-bankpayment-transaction-info.component.html',
    styleUrls: ['./cms-bankpayment-transaction-info.component.scss'],
    standalone: false
})
export class CmsBankpaymentTransactionInfoComponent implements OnInit {
  static nextId = 0;
  id = ++CmsBankpaymentTransactionInfoComponent.nextId;
  requestId = 0;
  constructorInfoAreaId = this.constructor.name;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public bankPaymentTransactionService: BankPaymentTransactionService,
    private dialogRef: MatDialogRef<CmsBankpaymentTransactionInfoComponent>,
    private bankPaymentEnumService: BankPaymentEnumService,
    private cmsToastrService: CmsToastrService,
    public translate: TranslateService,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
  ) {
    this.publicHelper.processService.cdr = this.cdr;
    if (data) {
      this.requestId = + data.id || 0;
    }

  }


  dataModelResult: ErrorExceptionResult<BankPaymentTransactionModel> = new ErrorExceptionResult<BankPaymentTransactionModel>();
  dataModelEnumTransactionRecordStatusResult: ErrorExceptionResult<InfoEnumModel> = new ErrorExceptionResult<InfoEnumModel>();

  ngOnInit(): void {
    if (this.requestId <= 0) {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }
    this.DataGeOne();
    this.getEnumTransactionRecordStatus();
  }
  getEnumTransactionRecordStatus(): void {
    this.bankPaymentEnumService.ServiceTransactionRecordStatusEnum().subscribe({
      next: (ret) => {
        this.dataModelEnumTransactionRecordStatusResult = ret;
      }
    });
  }
  TransactionSuccessful = TransactionRecordStatusEnum.TransactionSuccessful;
  DataGeOne(): void {
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });
    this.bankPaymentTransactionService.ServiceGetOneById(this.requestId).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.dataModelResult = ret;

        }
        else {
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.publicHelper.processService.processStop(pName);
      },
      error: (err) => {
        this.cmsToastrService.typeError(err);
        this.publicHelper.processService.processStop(pName);
      }
    }
    );
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: true });
  }
}
