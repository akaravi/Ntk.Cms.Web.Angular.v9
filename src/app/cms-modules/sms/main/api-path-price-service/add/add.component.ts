
import { ENTER } from '@angular/cdk/keycodes';
import {
  ChangeDetectorRef, Component, Inject, OnInit,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  CoreSiteCategoryModel,
  CoreSiteModel,
  CoreUserGroupModel, CoreUserModel, DataFieldInfoModel, ErrorExceptionResult,
  FormInfoModel, InfoEnumModel, ManageUserAccessDataTypesEnum, SmsEnumService, SmsMainApiPathModel, SmsMainApiPathPriceServiceModel, SmsMainApiPathPriceServiceService
} from 'ntk-cms-api';
import { TreeModel } from 'ntk-cms-filemanager';
import { AddBaseComponent } from 'src/app/core/cmsComponent/addBaseComponent';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
    selector: 'app-sms-apipathpriceservice-add',
    templateUrl: './add.component.html',
    styleUrls: ['./add.component.scss'],
    standalone: false
})
export class SmsMainApiPathPriceServiceAddComponent extends AddBaseComponent<SmsMainApiPathPriceServiceService, SmsMainApiPathPriceServiceModel, string> implements OnInit {
  constructorInfoAreaId = this.constructor.name;
  requestId = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SmsMainApiPathPriceServiceAddComponent>,
    public smsEnumService: SmsEnumService,
    public smsMainApiPathPriceServiceService: SmsMainApiPathPriceServiceService,
    private cmsToastrService: CmsToastrService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {
    super(smsMainApiPathPriceServiceService, new SmsMainApiPathPriceServiceModel(), publicHelper, translate);
    this.publicHelper.processService.cdr = this.cdr;
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
    if (data) {
      if (data.linkApiPathId && data.linkApiPathId.length > 0)
        this.dataModel.linkApiPathId = data.linkApiPathId;
      if (data.id) {
        this.requestId = data.id;
      }
    }
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];

  fileManagerTree: TreeModel;
  appLanguage = 'fa';

  dataModelResult: ErrorExceptionResult<SmsMainApiPathPriceServiceModel> = new ErrorExceptionResult<SmsMainApiPathPriceServiceModel>();
  dataModel: SmsMainApiPathPriceServiceModel = new SmsMainApiPathPriceServiceModel();
  formInfo: FormInfoModel = new FormInfoModel();
  dataModelSmsMessageTypeEnumResult: ErrorExceptionResult<InfoEnumModel> = new ErrorExceptionResult<InfoEnumModel>();
  dataModelSmsOutBoxTypeEnumResult: ErrorExceptionResult<InfoEnumModel> = new ErrorExceptionResult<InfoEnumModel>();

  fileManagerOpenForm = false;




  ngOnInit(): void {
    this.translate.get('TITLE.ADD').subscribe((str: string) => { this.formInfo.formTitle = str; });

    if (this.requestId) {
      this.DataGetOneContent();
    } else {
      this.DataGetAccess();
    }
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
          this.dataModel.title = this.dataModel.title + " (COPY)";
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
  DataAddContent(): void {
    this.translate.get('MESSAGE.sending_information_to_the_server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });

    this.smsMainApiPathPriceServiceService.ServiceAdd(this.dataModel).subscribe({
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

    this.DataAddContent();


  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
  /**
* tag
*/
  addOnBlurTag = true;
  readonly separatorKeysCodes = [ENTER] as const;
  addTagRegulatorNumberList(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if(!this.dataModel.regulatorNumberList)
      this.dataModel.regulatorNumberList=[];
    // Add our item
    if (value) {
      this.dataModel.regulatorNumberList.push(value);
    }
    // Clear the input value
    event.chipInput!.clear();
  }
  removeTagRegulatorNumberList(item: string): void {
    const index = this.dataModel.regulatorNumberList.indexOf(item);

    if (index >= 0) {
      this.dataModel.regulatorNumberList.splice(index, 1);
    }
  }
  /** */
  addTagServicePagination(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Add our item
    var valueNum: number = +value || -1;
    if(!this.dataModel.serviceMessageLengthPaginationList)
      this.dataModel.serviceMessageLengthPaginationList=[];

    if (valueNum >= 0) {
      this.dataModel.serviceMessageLengthPaginationList.push(valueNum);
    }
    // Clear the input value
    event.chipInput!.clear();
  }

  removeTagServicePagination(item: number): void {
    const index = this.dataModel.serviceMessageLengthPaginationList.indexOf(item);

    if (index >= 0) {
      this.dataModel.serviceMessageLengthPaginationList.splice(index, 1);
    }
  }
  /** */
  addTagEndUserPagination(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Add our item
    if(!this.dataModel.endUserMessageLengthPaginationList)
      this.dataModel.endUserMessageLengthPaginationList=[];

    var valueNum: number = +value || -1;
    if (valueNum >= 0) {
      this.dataModel.endUserMessageLengthPaginationList.push(valueNum);
    }
    // Clear the input value
    event.chipInput!.clear();
  }

  removeTagEndUserPagination(item: number): void {
    const index = this.dataModel.endUserMessageLengthPaginationList.indexOf(item);

    if (index >= 0) {
      this.dataModel.endUserMessageLengthPaginationList.splice(index, 1);
    }
  }
  /**
   * tag
   */
}
