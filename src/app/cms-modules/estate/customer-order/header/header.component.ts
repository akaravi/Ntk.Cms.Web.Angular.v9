
import {
  ChangeDetectorRef, Component, Input, OnInit
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  DataFieldInfoModel, ErrorExceptionResult,
  EstateCustomerOrderModel,
  EstateCustomerOrderService,
  RecordStatusEnum
} from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { CmsLinkToComponent } from 'src/app/shared/cms-link-to/cms-link-to.component';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-estate-customer-order-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class EstateCustomerOrderHeaderComponent implements OnInit {
  constructorInfoAreaId = this.constructor.name;
  constructor(
    private headerService: EstateCustomerOrderService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
    private cmsToastrService: CmsToastrService,
    public dialog: MatDialog
  ) {
    this.publicHelper.processService.cdr = this.cdr;
  }
  @Input() optionId = '';

  dataModelResult: ErrorExceptionResult<EstateCustomerOrderModel> = new ErrorExceptionResult<EstateCustomerOrderModel>();
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();




  ngOnInit(): void {
    if (this.optionId?.length > 0) {
      this.DataGetOneContent();
    }

  }

  DataGetOneContent(): void {
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructor.name);
    });

    this.headerService.setAccessLoad();
    this.headerService.ServiceGetOneById(this.optionId).subscribe({
      next: (ret) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
        if (ret.isSuccess) {
          this.dataModelResult = ret;
        } else {
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
  onActionButtonLinkTo(model: EstateCustomerOrderModel = this.dataModelResult.item): void {
    if (!model || !model.id || model.id.length === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    if (model.recordStatus != RecordStatusEnum.Available) {
      this.cmsToastrService.typeWarningRecordStatusNoAvailable();
      return;
    }
    //open popup
    var panelClass = '';
    if (this.publicHelper.isMobile)
      panelClass = 'dialog-fullscreen';
    else
      panelClass = 'dialog-min';
    const dialogRef = this.dialog.open(CmsLinkToComponent, {
      height: "90%",
      panelClass: panelClass,
      enterAnimationDuration: environment.cmsViewConfig.enterAnimationDuration,
      exitAnimationDuration: environment.cmsViewConfig.exitAnimationDuration,
      data: {
        title: model.title,
        urlViewContentQRCodeBase64: model.urlViewContentQRCodeBase64,
        urlViewContent: model.urlViewContent,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.dialogChangedDate) {
      }
    });
    //open popup
  }
}
