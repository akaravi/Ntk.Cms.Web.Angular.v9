
import {
  ChangeDetectorRef, Component, Inject, OnDestroy, OnInit,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  CoreEnumService, CoreSiteModel, CoreUserClaimContentModel, CoreUserClaimContentService, CoreUserClaimTypeModel, CoreUserModel,
  ErrorExceptionResultBase,
  FormInfoModel,
  ManageUserAccessDataTypesEnum
} from 'ntk-cms-api';
import { NodeInterface, TreeModel } from 'ntk-cms-filemanager';
import { Subscription } from 'rxjs';
import { EditBaseComponent } from 'src/app/core/cmsComponent/editBaseComponent';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-core-userclaim-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class CoreUserClaimContentEditComponent extends EditBaseComponent<CoreUserClaimContentService, CoreUserClaimContentModel, number>
  implements OnInit, OnDestroy {
  requestId = 0;
  constructorInfoAreaId = this.constructor.name;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CoreUserClaimContentEditComponent>,
    public coreEnumService: CoreEnumService,
    public coreUserClaimContentService: CoreUserClaimContentService,
    public publicHelper: PublicHelper,
    private cmsToastrService: CmsToastrService,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
    private tokenHelper: TokenHelper,
  ) {
    super(coreUserClaimContentService, new CoreUserClaimContentModel(), publicHelper, translate);

    this.publicHelper.processService.cdr = this.cdr;

    if (data) {
      this.requestId = +data.id || 0;
    }

    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
      if (!this.tokenInfo.userAccessAdminAllowToProfessionalData && this.tokenInfo.userAccessAdminAllowToAllData) {
        this.dataModel.linkUserId = this.tokenInfo.userId;
        this.dataModel.linkSiteId = this.tokenInfo.siteId;
        this.ProfessionalData = true;
      } else {
        this.ProfessionalData = false;
      }
    });
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe({
      next: (ret) => {
        this.tokenInfo = ret;
        if (!this.tokenInfo.userAccessAdminAllowToProfessionalData && this.tokenInfo.userAccessAdminAllowToAllData) {
          this.dataModel.linkUserId = this.tokenInfo.userId;
          this.dataModel.linkSiteId = this.tokenInfo.siteId;
          this.ProfessionalData = true;
        } else {
          this.ProfessionalData = false;
        }
      }
    });
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;


  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  cmsApiStoreSubscribe: Subscription;

  ProfessionalData = false;
  fileManagerTree: TreeModel;
  appLanguage = 'fa';


  dataModelResult: ErrorExceptionResultBase = new ErrorExceptionResultBase();
  dataModel: CoreUserClaimContentModel = new CoreUserClaimContentModel();

  formInfo: FormInfoModel = new FormInfoModel();


  fileManagerOpenForm = false;


  ngOnInit(): void {
    if (this.requestId > 0) {
      this.translate.get('TITLE.Edit').subscribe((str: string) => { this.formInfo.formTitle = str; });
      this.DataGetOneContent();
    } else {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }


  }
  ngOnDestroy() {
    this.cmsApiStoreSubscribe.unsubscribe();
  }

  DataGetOneContent(): void {
    if (this.requestId <= 0) {
      this.cmsToastrService.typeErrorEditRowIsNull();
      return;
    }

    this.translate.get('MESSAGE.Receiving_Information_From_The_Server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });

    this.coreUserClaimContentService.setAccessLoad();
    this.coreUserClaimContentService.setAccessDataType(ManageUserAccessDataTypesEnum.Editor);
    this.coreUserClaimContentService.ServiceGetOneById(this.requestId).subscribe({
      next: (ret) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);

        this.dataModel = ret.item;
        if (ret.isSuccess) {

          this.formInfo.formTitle = this.formInfo.formTitle + ' ' + ret.item.id;
          this.formInfo.formAlert = '';
        } else {
          this.translate.get('ERRORMESSAGE.MESSAGE.typeError').subscribe((str: string) => { this.formInfo.formAlert = str; });
          this.formInfo.formError = ret.errorMessage;
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

  DataEditContent(): void {
    this.translate.get('MESSAGE.sending_information_to_the_server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.sending_information_to_the_server').subscribe((str: string) => { this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId); });

    this.coreUserClaimContentService.ServiceEdit(this.dataModel).subscribe({
      next: (ret) => {
        this.formInfo.formSubmitAllow = true;
        this.dataModelResult = ret;
        if (ret.isSuccess) {
          this.translate.get('MESSAGE.registration_completed_successfully').subscribe((str: string) => { this.formInfo.formAlert = str; });
          this.cmsToastrService.typeSuccessEdit();
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
  onActionFileSelected(model: NodeInterface): void {
    this.dataModel.linkFileContentId = model.id;
    this.dataModel.linkFileContentIdSrc = model.downloadLinksrc;
  }
  onActionSelectUser(model: CoreUserModel | null): void {
    if (!model || model.id <= 0) {
      this.cmsToastrService.typeErrorMessage(
        this.translate.instant('MESSAGE.Specify_the_user'),
        this.translate.instant('MESSAGE.Information_user_is_not_clear')
      );
      return;
    }
    this.dataModel.linkUserId = model.id;
  }
  onActionSelectSite(model: CoreSiteModel | null): void {
    if (!model || model.id <= 0) {
      this.cmsToastrService.typeErrorMessage(
        this.translate.instant('MESSAGE.Specify_the_site'),
        this.translate.instant('MESSAGE.Information_site_is_not_clear')
      );
      return;
    }
    this.dataModel.linkSiteId = model.id;
  }

  onActionSelectClaimType(model: CoreUserClaimTypeModel | null): void {
    if (!model || model.id <= 0) {
      this.cmsToastrService.typeErrorMessage(
        this.translate.instant('MESSAGE.Specify_the_category'),
        this.translate.instant('MESSAGE.type_of_information_documents_is_not_clear')
      );
      return;
    }
    this.dataModel.linkUserClaimTypeId = model.id;
  }
  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    this.formInfo.formSubmitAllow = false;
    this.DataEditContent();
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}
