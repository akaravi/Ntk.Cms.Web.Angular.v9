
import {
  ChangeDetectorRef, Component, Inject, OnInit,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  CoreCurrencyModel, CoreEnumService, CoreLocationModel, DataFieldInfoModel, ErrorExceptionResult, EstateContractTypeModel, EstateEnumService, EstatePropertyExpertPriceModel,
  EstatePropertyExpertPriceService, EstatePropertyTypeLanduseModel, EstatePropertyTypeUsageModel, FormInfoModel, InfoEnumModel, TokenInfoModel
} from 'ntk-cms-api';
import { TreeModel } from 'ntk-cms-filemanager';
import { AddBaseComponent } from 'src/app/core/cmsComponent/addBaseComponent';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-estate-property-expert-price-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class EstatePropertyExpertPriceAddComponent extends AddBaseComponent<EstatePropertyExpertPriceService, EstatePropertyExpertPriceModel, string> implements OnInit {
  requestTargetCategoryId = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EstatePropertyExpertPriceAddComponent>,
    public coreEnumService: CoreEnumService,
    public estatePropertyExpertPriceService: EstatePropertyExpertPriceService,
    private cmsToastrService: CmsToastrService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    private estateEnumService: EstateEnumService,
    public tokenHelper: TokenHelper,
    public translate: TranslateService,
  ) {
    super(estatePropertyExpertPriceService, new EstatePropertyExpertPriceModel(), publicHelper);
    this.publicHelper.processService.cdr = this.cdr; this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => { this.loading.message = str; });
    // if (data) {
    //   this.requestTargetCategoryId = +data.linkTargetCategoryId || 0;
    // }
    // if (this.requestTargetCategoryId > 0) {
    //   this.dataModel.linkTargetCategoryId = this.requestTargetCategoryId;
    // }
    // this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
    });
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];

  fileManagerTree: TreeModel;
  appLanguage = 'fa';
  tokenInfo = new TokenInfoModel();
  dataModelResult: ErrorExceptionResult<EstatePropertyExpertPriceModel> = new ErrorExceptionResult<EstatePropertyExpertPriceModel>();
  dataModel: EstatePropertyExpertPriceModel = new EstatePropertyExpertPriceModel();
  dataModelEstatePropertyExpertPriceTypeEnumResult: ErrorExceptionResult<InfoEnumModel> = new ErrorExceptionResult<InfoEnumModel>();


  formInfo: FormInfoModel = new FormInfoModel();

  PropertyTypeSelected = new EstatePropertyTypeLanduseModel();
  dataModelCorCurrencySelector = new CoreCurrencyModel();
  contractTypeSelected: EstateContractTypeModel;
  fileManagerOpenForm = false;

  ngOnInit(): void {
    this.formInfo.formTitle = this.translate.instant('TITLE.Register_New_Categories');

    this.getEstatePropertyExpertPriceTypeEnum();
    this.DataGetAccess();

  }

  getEstatePropertyExpertPriceTypeEnum(): void {
    this.estateEnumService.ServiceEstatePropertyExpertPriceTypeEnum().subscribe({
      next: (ret) => {
        this.dataModelEstatePropertyExpertPriceTypeEnumResult = ret;
      }
    });
  }


  DataAddContent(): void {
    this.translate.get('MESSAGE.sending_information_to_the_server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.publicHelper.processService.processStart(pName);


    this.estatePropertyExpertPriceService.ServiceAdd(this.dataModel).subscribe({
      next: (ret) => {
        this.formInfo.formSubmitAllow = true;
        this.dataModelResult = ret;
        if (ret.isSuccess) {
          this.translate.get('MESSAGE.registration_completed_successfully').subscribe((str: string) => { this.formInfo.formAlert = str; });
          this.cmsToastrService.typeSuccessAdd();
          this.dialogRef.close({ dialogChangedDate: true });
        } else {
          this.translate.get('ERRORMESSAGE.MESSAGE.typeError').subscribe((str: string) => { this.formInfo.formAlert = str; });
          this.formInfo.formError = ret.errorMessage;
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.publicHelper.processService.processStop(pName);

      },
      error: (er) => {
        this.formInfo.formSubmitAllow = true;
        this.cmsToastrService.typeError(er);
        this.publicHelper.processService.processStop(pName, false);
      }
    }
    );
  }
  onActionSelectorSelectUsage(model: EstatePropertyTypeUsageModel | null): void {
    if (!model || !model.id || model.id.length <= 0) {
      this.translate.get('MESSAGE.category_of_information_is_not_clear').subscribe((str: string) => { this.cmsToastrService.typeWarningSelected(str); });
      return;
    }
    this.dataModel.linkPropertyTypeUsageId = model.id;
  }

  onActionSelectorSelectLanduse(model: EstatePropertyTypeLanduseModel | null): void {
    this.PropertyTypeSelected = null;
    this.dataModel.linkPropertyTypeLanduseId = null;
    if (!model || !model.id || model.id.length <= 0) {
      this.translate.get('MESSAGE.category_of_information_is_not_clear').subscribe((str: string) => { this.cmsToastrService.typeWarningSelected(str); });
      return;
    }
    this.PropertyTypeSelected = model;
    this.dataModel.linkPropertyTypeLanduseId = model.id;
  }

  onActionSelectorContarctType(model: EstateContractTypeModel | null): void {
    this.dataModel.linkContractTypeId = null;
    this.contractTypeSelected = null;
    if (!model || !model.id || model.id.length <= 0) {
      const message = this.translate.instant('MESSAGE.Type_of_property_transaction_is_not_known');
      this.cmsToastrService.typeWarningSelected(message);
      return;
    }
    this.contractTypeSelected = model;
    this.dataModel.linkContractTypeId = model.id;
    this.dataModel.rentPriceMin = 0;
    this.dataModel.rentPriceMax = 0;
    this.dataModel.rentPriceAverage = 0;
    this.dataModel.salePriceMin = 0;
    this.dataModel.salePriceMax = 0;
    this.dataModel.salePriceAverage = 0;
    this.dataModel.depositPriceMin = 0;
    this.dataModel.depositPriceMax = 0;
    this.dataModel.depositPriceAverage = 0;
    this.dataModel.periodPriceMin = 0;
    this.dataModel.periodPriceMax = 0;
    this.dataModel.periodPriceAverage = 0;
  }

  onActionSelectorLocation(model: CoreLocationModel | null): void {
    this.dataModel.linkLocationId = null;
    if (model && model.id > 0) {
      this.dataModel.linkLocationId = model.id;
    }
  }

  onActionSelectCurrency(model: CoreCurrencyModel): void {
    if (!model || model.id <= 0) {
      // this.cmsToastrService.typeErrorSelected();
      this.dataModelCorCurrencySelector = null;
      this.dataModel.linkCoreCurrencyId = null;
      return;
    }
    this.dataModelCorCurrencySelector = model;
    this.dataModel.linkCoreCurrencyId = model.id;
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
