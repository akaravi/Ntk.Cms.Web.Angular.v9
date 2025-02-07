
import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CoreModuleSiteCreditCalculateDtoModel, CoreSiteService } from 'ntk-cms-api';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { CmsBankpaymentTransactionInfoComponent } from 'src/app/shared/cms-bankpayment-transaction-info/cms-bankpayment-transaction-info.component';
import { CoreModuleSiteCreditChargePaymentComponent } from '../charge-payment/charge-payment.component';

@Component({
    selector: 'app-coremodule-site-credit-charge',
    templateUrl: './charge.component.html',
    standalone: false
})
export class CoreModuleSiteCreditChargeComponent implements OnInit {
    requestLinkModuleId = 0;
    constructorInfoAreaId = this.constructor.name;
    constructor(
        @Inject(DOCUMENT) private document: any,
        private activatedRoute: ActivatedRoute,
        private dialog: MatDialog,
        private coreSiteService: CoreSiteService,
        private cmsToastrService: CmsToastrService,
        private router: Router,
        public translate: TranslateService
    ) {
        this.requestLinkModuleId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkModuleId'));
        this.dataModelCalculate.linkModuleId = this.requestLinkModuleId;

    }
    currency = '';
    viewCalculate = false;

    dataModelCalculate: CoreModuleSiteCreditCalculateDtoModel = new CoreModuleSiteCreditCalculateDtoModel();


    ngOnInit(): void {
        this.DataGetCurrency();
        const transactionId = + localStorage.getItem('TransactionId');
        if (transactionId > 0) {
            const dialogRef = this.dialog.open(CmsBankpaymentTransactionInfoComponent, {
                // height: "90%",
                data: {
                    id: transactionId,
                },
            });
            dialogRef.afterClosed().subscribe((result) => {
                if (result && result.dialogChangedDate) {
                    localStorage.removeItem('TransactionId');
                }
            });
        }
    }

    DataGetCurrency(): void {
        this.coreSiteService.ServiceGetCurrencyMaster().subscribe({
            next: (ret) => {
                if (ret.isSuccess) {
                    this.currency = ret.item;
                } else {
                    this.cmsToastrService.typeErrorMessage(ret.errorMessage);
                }
            },
            error: (er) => {
                this.cmsToastrService.typeError(er);
            }
        }
        );
    }

    onActionButtonBuy(): void {
        const dialogRef = this.dialog.open(CoreModuleSiteCreditChargePaymentComponent, {
            //height: '90%',
            data: {
                credit: this.dataModelCalculate.credit,
                linkModuleId: this.dataModelCalculate.linkModuleId,
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.dialogChangedDate) {

            }
        });
    }

    onActionBackToParent(): void {
        this.router.navigate(['/coremodule/site-credit/']);
    }
}

