
import {
  ChangeDetectorRef, Component, Inject,
  OnDestroy, OnInit,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import {
  CoreEnumService, DataFieldInfoModel, ErrorExceptionResult, EstateContractModel, EstateContractTypeModel,
  EstatePropertySupplierModel,
  EstatePropertySupplierService, FormInfoModel, InputDataTypeEnum, ManageUserAccessDataTypesEnum, TokenInfoModel
} from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-estate-property-supplier-quick-view',
  templateUrl: './quick-view.component.html',
})
export class EstatePropertySupplierQuickViewComponent implements OnInit, OnDestroy {
  requestId = '';
  requestPerviousItem: any;
  requestNextItem: any;
  constructorInfoAreaId = this.constructor.name;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EstatePropertySupplierQuickViewComponent>,
    public coreEnumService: CoreEnumService,
    public estatePropertySupplierService: EstatePropertySupplierService,
    private cmsToastrService: CmsToastrService,
    private tokenHelper: TokenHelper,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
    public translate: TranslateService,
  ) {
    this.publicHelper.processService.cdr = this.cdr;

    if (data) {
      this.requestId = data.id + '';
      this.requestPerviousItem = data.perviousItem;
      this.requestNextItem = data.nextItem;
    }
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  tokenInfo = new TokenInfoModel();

  dataModelResult: ErrorExceptionResult<EstatePropertySupplierModel> = new ErrorExceptionResult<EstatePropertySupplierModel>();
  dataModelEstateContractTypeResult: ErrorExceptionResult<EstateContractTypeModel> = new ErrorExceptionResult<EstateContractTypeModel>();
  dataModel: EstatePropertySupplierModel = new EstatePropertySupplierModel();
  formInfo: FormInfoModel = new FormInfoModel();
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  optionTabledataSource = new MatTableDataSource<EstateContractModel>();
  optionTabledisplayedColumns = ['LinkEstateContractTypeId', 'Price'];// 'SalePrice', 'DepositPrice', 'RentPrice', 'PeriodPrice'];
  fileManagerOpenForm = false;
  errorMessage: string = '';
  enumInputDataType = InputDataTypeEnum;


  cmsApiStoreSubscribe: Subscription;
  ngOnInit(): void {
    this.formInfo.formTitle = this.translate.instant('TITLE.QUICK_VIEW');
    if (this.requestId.length === 0) {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }
    this.DataGetOneContent();
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
    });

    this.cmsApiStoreSubscribe = this.tokenHelper.geTokenInfoStateOnChange().subscribe({
      next: (ret) => {
        this.tokenInfo = ret;
      }
    });
  }

  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }


  DataGetOneContent(): void {
    this.translate.get('MESSAGE.Receiving_Information_From_The_Server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });

    /*َAccess Field*/
    this.estatePropertySupplierService.setAccessLoad();
    this.estatePropertySupplierService.setAccessDataType(ManageUserAccessDataTypesEnum.Editor);
    this.estatePropertySupplierService.ServiceGetOneById(this.requestId).subscribe({
      next: (ret) => {
        /*َAccess Field*/
        // this.dataAccessModel = next.access;
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
        this.dataModel = ret.item;


        if (ret.isSuccess) {

          this.formInfo.formTitle = this.formInfo.formTitle;
          this.formInfo.formAlert = '';

        } else {
          this.translate.get('ERRORMESSAGE.MESSAGE.typeError').subscribe((str: string) => { this.formInfo.formAlert = str; });
          this.formInfo.formError = ret.errorMessage;
          this.errorMessage = ret.errorMessage + '<br> ( ' + ret.errorTypeTitle + ' ) ';
          this.cmsToastrService.typeErrorMessage(this.errorMessage);
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
  setStep(index: number): void {
    this.step = index;
  }
  step = 0;
  nextStep(): void {
    this.step++;
  }

  prevStep(): void {
    this.step--;
  }

  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
  onActionNext(): void {
    this.dialogRef.close({ dialogChangedDate: true, onActionOpenItem: this.requestNextItem });
  }
  onActionPervious(): void {
    this.dialogRef.close({ dialogChangedDate: true, onActionOpenItem: this.requestPerviousItem });
  }
}
