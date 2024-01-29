
import {
  ChangeDetectorRef, Component, Inject, OnInit,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  CoreEnumService, CoreLocationModel, DataFieldInfoModel, ErrorExceptionResult, EstateAccountUserModel, EstateAccountUserWorkAreaModel, EstateAccountUserWorkAreaService, EstateEnumService, FormInfoModel, InfoEnumModel, TokenInfoModel
} from 'ntk-cms-api';
import { TreeModel } from 'ntk-cms-filemanager';
import { AddBaseComponent } from 'src/app/core/cmsComponent/addBaseComponent';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-estate-account-user-work-area-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class EstateAccountUserWorkAreaAddComponent extends AddBaseComponent<EstateAccountUserWorkAreaService, EstateAccountUserWorkAreaModel, string> implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EstateAccountUserWorkAreaAddComponent>,
    public coreEnumService: CoreEnumService,
    public estateEnumService: EstateEnumService,
    public estateAccountUserWorkAreaService: EstateAccountUserWorkAreaService,
    private cmsToastrService: CmsToastrService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    public tokenHelper: TokenHelper,
    public translate: TranslateService,
  ) {
    super(estateAccountUserWorkAreaService, new EstateAccountUserWorkAreaModel(), publicHelper);
    this.loading.cdr = this.cdr; this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
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
  dataModelResult: ErrorExceptionResult<EstateAccountUserWorkAreaModel> = new ErrorExceptionResult<EstateAccountUserWorkAreaModel>();
  dataModel: EstateAccountUserWorkAreaModel = new EstateAccountUserWorkAreaModel();
  formInfo: FormInfoModel = new FormInfoModel();

  dataModelEnumEstateUserTypeResult: ErrorExceptionResult<InfoEnumModel> = new ErrorExceptionResult<InfoEnumModel>();

  fileManagerOpenForm = false;

  ngOnInit(): void {

    this.formInfo.formTitle = this.translate.instant('TITLE.ADD');

    this.DataGetAccess();
    this.getEstateUserTypeEnum();

  }
  getEstateUserTypeEnum(): void {
    this.estateEnumService.ServiceEstateUserTypeEnum().subscribe((next) => {
      this.dataModelEnumEstateUserTypeResult = next;
    });
  }


  // DataGetAccess(): void {
  //   const pName = this.constructor.name + 'DataGetAccess';
  //   this.loading.Start(pName);

  //   this.estateAccountUserWorkAreaService
  //     .ServiceViewModel()
  //     .subscribe({
  //       next: (ret) => {
  //         if (ret.isSuccess) {
  //           // this.dataAccessModel = next.access;
  //           this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
  //         } else {
  //           this.cmsToastrService.typeErrorGetAccess(ret.errorMessage);
  //         }
  //         this.loading.Stop(pName);
  //       },
  //       error: (er) => {
  //         this.cmsToastrService.typeErrorGetAccess(er);
  //         this.loading.Stop(pName);
  //       }
  //     }
  //     );
  // }
  DataAddContent(): void {
    this.formInfo.formAlert = this.translate.instant('MESSAGE.sending_information_to_the_server');
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.estateAccountUserWorkAreaService.ServiceAdd(this.dataModel).subscribe({
      next: (ret) => {
        this.dataModelResult = ret;
        if (ret.isSuccess) {
          this.formInfo.formAlert = this.translate.instant('MESSAGE.registration_completed_successfully');
          this.cmsToastrService.typeSuccessAdd();
          this.dialogRef.close({ dialogChangedDate: true });
        } else {
          this.formInfo.formAlert = this.translate.instant('ERRORMESSAGE.MESSAGE.typeError');
          this.formInfo.formError = ret.errorMessage;
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.loading.Stop(pName);

        this.formInfo.formSubmitAllow = true;
      },
      error: (er) => {
        this.formInfo.formSubmitAllow = true;
        this.cmsToastrService.typeError(er);
        this.loading.Stop(pName);
      }
    }
    );
  }

  onActionSelectorAccountUser(model: EstateAccountUserModel | null): void {
    this.dataModel.linkEstateAccountUserId = null;
    if (model && model.id.length > 0) {
      this.dataModel.linkEstateAccountUserId = model.id;
    }
  }
  onActionSelectorLocation(model: CoreLocationModel | null): void {
    this.dataModel.linkCoreLocationId = null;
    if (model && model.id > 0) {
      this.dataModel.linkCoreLocationId = model.id;
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
