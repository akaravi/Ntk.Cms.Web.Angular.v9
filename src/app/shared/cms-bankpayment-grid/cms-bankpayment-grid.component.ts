import {
  ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output
} from '@angular/core';
import {
  BankPaymentPrivateSiteConfigModel, BankPaymentPrivateSiteConfigService, BlogCategoryModel, ErrorExceptionResult
} from 'ntk-cms-api';

import { TranslateService } from '@ngx-translate/core';
import { NodeInterface } from 'ntk-cms-filemanager';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';

@Component({
  selector: 'app-cms-bankpayment-grid',
  templateUrl: './cms-bankpayment-grid.component.html',
})
export class CmsBankpaymentGridComponent implements OnInit {
  static nextId = 0;
  id = ++CmsBankpaymentGridComponent.nextId;
  constructor(
    public bankPaymentPrivateSiteConfigService: BankPaymentPrivateSiteConfigService,

    public translate: TranslateService,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
  ) {
    this.publicHelper.processService.cdr = this.cdr;
  }
  @Input() optionMasterItem = false;
  errorMessage = '';
  @Output() optionChange = new EventEmitter<BankPaymentPrivateSiteConfigModel>();
  dataModelSelect: BankPaymentPrivateSiteConfigModel = new BankPaymentPrivateSiteConfigModel();



  dataModelResult: ErrorExceptionResult<BankPaymentPrivateSiteConfigModel> = new ErrorExceptionResult<BankPaymentPrivateSiteConfigModel>();
  dataModel: BlogCategoryModel = new BlogCategoryModel();


  onActionFileSelected(model: NodeInterface): void {
    this.dataModel.linkMainImageId = model.id;
    this.dataModel.linkMainImageIdSrc = model.downloadLinksrc;

  }

  ngOnInit(): void {
    this.DataGetAll();
  }
  DataGetAll(): void {
    if (this.optionMasterItem) {
      const pName = this.constructor.name + 'main';
      this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
        this.publicHelper.processService.processStart(pName, str, this.constructor.name);
      });
      this.bankPaymentPrivateSiteConfigService.ServicePaymentGatewayCoreList().subscribe({
        next: (ret) => {
          if (ret.isSuccess) {
            this.dataModelResult = ret;
            if (!this.dataModelResult.listItems || this.dataModelResult.listItems.length == 0) {
              this.errorMessage = this.translate.instant('MESSAGE.Payment_portal_is_not_active');
            } else if (this.dataModelResult.listItems && this.dataModelResult.listItems.length == 1) {
              this.onActionSelectBank(this.dataModelResult.listItems[0]);
            }
          }
          else {
            this.errorMessage = ret.errorMessage;
          }
          this.publicHelper.processService.processStop(pName);

        },
        error: (er) => {
          this.errorMessage = er;
          this.publicHelper.processService.processStop(pName, false);
        }
      }
      );
    }
    else {
      const pName = this.constructor.name + 'main';
      this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
        this.publicHelper.processService.processStart(pName, str, this.constructor.name);
      });
      this.bankPaymentPrivateSiteConfigService.ServicePaymentGatewayList().subscribe({
        next: (ret) => {
          if (ret.isSuccess) {
            this.dataModelResult = ret;
            if (!this.dataModelResult.listItems || this.dataModelResult.listItems.length == 0) {
              this.errorMessage = this.translate.instant('MESSAGE.Payment_portal_is_not_active');
            } else if (this.dataModelResult.listItems && this.dataModelResult.listItems.length == 1) {
              this.onActionSelectBank(this.dataModelResult.listItems[0]);
            }
          }
          else {
            this.errorMessage = ret.errorMessage;
          }
          this.publicHelper.processService.processStop(pName);
        },
        error: (er) => {
          this.errorMessage = er;
          this.publicHelper.processService.processStop(pName, false);
        }

      }
      );
    }
  }

  onActionSelectBank(model: BankPaymentPrivateSiteConfigModel): void {
    this.dataModelSelect = model;
    this.optionChange.emit(this.dataModelSelect);
  }

}
