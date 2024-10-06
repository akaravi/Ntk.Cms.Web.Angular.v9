
import {
  ChangeDetectorRef, Component, Inject, OnInit,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  CoreEnumService, DataFieldInfoModel, ErrorExceptionResult,
  EstateAccountAgencyExpertModel, EstateAccountAgencyExpertService,
  EstateAccountAgencyModel,
  EstateAccountExpertModel, EstateEnumService, FormInfoModel, InfoEnumModel, TokenInfoModel
} from 'ntk-cms-api';
import { TreeModel } from 'ntk-cms-filemanager';
import { AddBaseComponent } from 'src/app/core/cmsComponent/addBaseComponent';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-estate-account-agency-expert-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class EstateAccountAgencyExpertAddComponent extends AddBaseComponent<EstateAccountAgencyExpertService, EstateAccountAgencyExpertModel, string> implements OnInit {
  constructorInfoAreaId = this.constructor.name;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EstateAccountAgencyExpertAddComponent>,
    public coreEnumService: CoreEnumService,
    public estateEnumService: EstateEnumService,
    public estateAccountAgencyExpertService: EstateAccountAgencyExpertService,
    private cmsToastrService: CmsToastrService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    public tokenHelper: TokenHelper,
    public translate: TranslateService,
  ) {
    super(estateAccountAgencyExpertService, new EstateAccountAgencyExpertModel(), publicHelper, translate);
    this.publicHelper.processService.cdr = this.cdr;
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
    this.tokenHelper.getTokenInfoState().then((value) => {
      this.tokenInfo = value;
    });
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  fileManagerTree: TreeModel;
  appLanguage = 'fa';
  tokenInfo = new TokenInfoModel();
  dataModelResult: ErrorExceptionResult<EstateAccountAgencyExpertModel> = new ErrorExceptionResult<EstateAccountAgencyExpertModel>();
  dataModel: EstateAccountAgencyExpertModel = new EstateAccountAgencyExpertModel();
  formInfo: FormInfoModel = new FormInfoModel();

  dataModelEnumEstateUserTypeResult: ErrorExceptionResult<InfoEnumModel> = new ErrorExceptionResult<InfoEnumModel>();

  fileManagerOpenForm = false;

  ngOnInit(): void {

    this.translate.get('TITLE.ADD').subscribe((str: string) => { this.formInfo.formTitle = str; });

    this.DataGetAccess();
    this.getEstateUserTypeEnum();

  }
  getEstateUserTypeEnum(): void {
    this.estateEnumService.ServiceEstateUserTypeEnum().subscribe({
      next: (ret) => {
        this.dataModelEnumEstateUserTypeResult = ret;
      }
    });
  }



  DataAddContent(): void {
    this.translate.get('MESSAGE.sending_information_to_the_server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });

    this.estateAccountAgencyExpertService.ServiceAdd(this.dataModel).subscribe({
      next: (ret) => {
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

        this.formInfo.formSubmitAllow = true;
      },
      error: (er) => {
        this.formInfo.formSubmitAllow = true;
        this.cmsToastrService.typeError(er);
        this.publicHelper.processService.processStop(pName, false);
      }
    }
    );
  }

  onActionSelectorAccountUser(model: EstateAccountExpertModel | null): void {
    this.dataModel.linkEstateExpertId = null;
    if (model && model.id.length > 0) {
      this.dataModel.linkEstateExpertId = model.id;
    }
  }
  onActionSelectorAccountAgency(model: EstateAccountAgencyModel | null): void {
    this.dataModel.linkEstateAccountAgencyId = null;
    if (model && model.id.length > 0) {
      this.dataModel.linkEstateAccountAgencyId = model.id;
    }
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
