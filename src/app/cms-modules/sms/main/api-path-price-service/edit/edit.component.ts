
import {
  ChangeDetectorRef, Component, Inject, OnInit,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  CoreSiteCategoryModel,
  CoreSiteModel,
  CoreUserGroupModel, CoreUserModel,
  ErrorExceptionResult,
  ErrorExceptionResultBase,
  FormInfoModel, InfoEnumModel, ManageUserAccessDataTypesEnum, SmsEnumService, SmsMainApiPathModel, SmsMainApiPathPriceServiceModel, SmsMainApiPathPriceServiceService
} from 'ntk-cms-api';
import { TreeModel } from 'ntk-cms-filemanager';
import { EditBaseComponent } from 'src/app/core/cmsComponent/editBaseComponent';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-sms-apipathpriceservice-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class SmsMainApiPathPriceServiceEditComponent extends EditBaseComponent<SmsMainApiPathPriceServiceService, SmsMainApiPathPriceServiceModel, string>
  implements OnInit {
  requestId = '';
  constructorInfoAreaId = this.constructor.name;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SmsMainApiPathPriceServiceEditComponent>,
    public smsEnumService: SmsEnumService,
    public smsMainApiPathPriceServiceService: SmsMainApiPathPriceServiceService,
    private cmsToastrService: CmsToastrService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {
    super(smsMainApiPathPriceServiceService, new SmsMainApiPathPriceServiceModel(), publicHelper, translate);

    this.publicHelper.processService.cdr = this.cdr;
    if (data && data.id) {
      this.requestId = data.id;
    }

    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;


  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];

  fileManagerTree: TreeModel;
  appLanguage = 'fa';


  dataModelResult: ErrorExceptionResultBase = new ErrorExceptionResultBase();
  dataModel: SmsMainApiPathPriceServiceModel = new SmsMainApiPathPriceServiceModel();

  formInfo: FormInfoModel = new FormInfoModel();

  dataModelSmsMessageTypeEnumResult: ErrorExceptionResult<InfoEnumModel> = new ErrorExceptionResult<InfoEnumModel>();
  dataModelSmsOutBoxTypeEnumResult: ErrorExceptionResult<InfoEnumModel> = new ErrorExceptionResult<InfoEnumModel>();

  fileManagerOpenForm = false;
  dataSmsMainApiPathPriceServiceModel: SmsMainApiPathPriceServiceModel[];
  ngOnInit(): void {
    if (this.requestId.length > 0) {
      this.translate.get('TITLE.Edit').subscribe((str: string) => { this.formInfo.formTitle = str; });

    } else {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }
    this.DataGetOneContent();

    this.getSmsMessageTypeEnum();
    this.getSmsOutBoxTypeEnum();
  }


  getSmsMessageTypeEnum(): void {
    this.smsEnumService.ServiceSmsMessageTypeEnum().subscribe((res) => {
      this.dataModelSmsMessageTypeEnumResult = res;
    });
  }
  getSmsOutBoxTypeEnum(): void {
    this.smsEnumService.ServiceSmsOutBoxTypeEnum().subscribe((res) => {
      this.dataModelSmsOutBoxTypeEnumResult = res;
    });
  }
  DataGetOneContent(): void {
    if (this.requestId.length <= 0) {
      this.cmsToastrService.typeErrorEditRowIsNull();
      return;
    }

    this.translate.get('MESSAGE.Receiving_Information_From_The_Server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });

    this.smsMainApiPathPriceServiceService.setAccessLoad();
    this.smsMainApiPathPriceServiceService.setAccessDataType(ManageUserAccessDataTypesEnum.Editor);
    this.smsMainApiPathPriceServiceService.ServiceGetOneById(this.requestId).subscribe({
      next: (ret) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);

        this.dataModel = ret.item;
        if (ret.isSuccess) {
          this.formInfo.formTitle = this.formInfo.formTitle;
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

    this.smsMainApiPathPriceServiceService.ServiceEdit(this.dataModel).subscribe({
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
  onActionSelectorCmsUser(model: CoreUserModel | null): void {
    if (!model || !model.id || model.id <= 0) {
      this.dataModel.linkCoreUserId = null;
      return;
    }
    this.dataModel.linkCoreUserId = model.id;
  }
  onActionSelectorCmsSite(model: CoreSiteModel | null): void {
    if (!model || !model.id || model.id <= 0) {
      this.dataModel.linkCoreSiteId = null;
      return;
    }
    this.dataModel.linkCoreSiteId = model.id;
  }
  onActionSelectorCoreUserGroup(model: CoreUserGroupModel | null): void {
    if (!model || !model.id || model.id <= 0) {
      this.dataModel.linkCoreUserGroupId = null;
      return;
    }
    this.dataModel.linkCoreUserGroupId = model.id;
  }
  onActionSelectorCoreSiteCategory(model: CoreSiteCategoryModel | null): void {
    if (!model || !model.id || model.id <= 0) {
      this.dataModel.linkCoreSiteCategoryId = null;
      return;
    }
    this.dataModel.linkCoreSiteCategoryId = model.id;
  }
  onActionSelectorSelectLinkApiPathId(model: SmsMainApiPathModel | null): void {
    if (!model || model.id.length <= 0) {
      const message = 'مسیر سرویس دهنده مشخص نیست';
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.dataModel.linkApiPathId = model.id;
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
