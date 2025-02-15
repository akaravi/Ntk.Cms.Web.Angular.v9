
import {
  ChangeDetectorRef, Component, Inject, OnInit,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  CoreEnumService, CoreModuleEntityModel, CoreUserSupportAccessModel, CoreUserSupportAccessService,
  ErrorExceptionResult, ErrorExceptionResultBase, FilterDataModel,
  FilterModel, FormInfoModel, InfoEnumModel, ManageUserAccessDataTypesEnum
} from 'ntk-cms-api';
import { TreeModel } from 'ntk-cms-filemanager';
import { EditBaseComponent } from 'src/app/core/cmsComponent/editBaseComponent';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
    selector: 'app-core-user-support-access-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss'],
    standalone: false
})
export class CoreUserSupportAccessEditComponent extends EditBaseComponent<CoreUserSupportAccessService, CoreUserSupportAccessModel, number>
  implements OnInit {
  requestLinkSiteId = 0;
  requestLinkUserId = 0;
  requestModuleName = '';
  requestModuleEntityName = '';
  constructorInfoAreaId = this.constructor.name;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CoreUserSupportAccessEditComponent>,
    public coreEnumService: CoreEnumService,
    public coreUserSupportAccessService: CoreUserSupportAccessService,
    private cmsToastrService: CmsToastrService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {
    super(coreUserSupportAccessService, new CoreUserSupportAccessModel(), publicHelper, translate);

    this.publicHelper.processService.cdr = this.cdr;


    if (data) {
      this.requestLinkSiteId = +data.linkSiteId || 0;
      this.requestLinkUserId = +data.linkUserId || 0;
      this.requestModuleName = data.moduleName;
      this.requestModuleEntityName = data.moduleEntityName;
    }

    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;



  fileManagerTree: TreeModel;
  appLanguage = 'fa';


  dataModelResult: ErrorExceptionResultBase = new ErrorExceptionResultBase();
  dataModel: CoreUserSupportAccessModel = new CoreUserSupportAccessModel();

  formInfo: FormInfoModel = new FormInfoModel();

  dataModelEnumManageUserAccessUserTypesResult: ErrorExceptionResult<InfoEnumModel> = new ErrorExceptionResult<InfoEnumModel>();
  fileManagerOpenForm = false;

  ngOnInit(): void {
    if (this.requestLinkSiteId > 0 && this.requestLinkUserId > 0 && this.requestModuleName && this.requestModuleName.length > 0 && this.requestModuleEntityName && this.requestModuleEntityName.length > 0) {
      this.translate.get('TITLE.Edit').subscribe((str: string) => { this.formInfo.formTitle = str; });
      this.DataGetOneContent();
    } else {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }
    this.getEnumManageUserAccessUserTypes();

  }

  getEnumManageUserAccessUserTypes(): void {
    this.coreEnumService.ServiceManageUserAccessUserTypesEnum().subscribe({
      next: (ret) => {
        this.dataModelEnumManageUserAccessUserTypesResult = ret;
      }
    });
  }
  DataGetOneContent(): void {
    if (this.requestLinkSiteId <= 0 || this.requestLinkUserId <= 0 || !this.requestModuleName || this.requestModuleName.length == 0 || !this.requestModuleEntityName || this.requestModuleEntityName.length <= 0) {
      this.cmsToastrService.typeErrorEditRowIsNull();
      return;
    }

    this.translate.get('MESSAGE.Receiving_Information_From_The_Server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });
    const filteModelContent = new FilterModel();
    /*make filter*/
    let filter = new FilterDataModel();
    filter.propertyName = 'LinkSiteId';
    filter.value = this.requestLinkSiteId;
    filteModelContent.filters.push(filter);
    /*make filter*/
    filter = new FilterDataModel();
    filter.propertyName = 'LinkUserId';
    filter.value = this.requestLinkUserId;
    filteModelContent.filters.push(filter);
    /*make filter*/
    filter = new FilterDataModel();
    filter.propertyName = 'ModuleName';
    filter.value = this.requestModuleName;
    filteModelContent.filters.push(filter);
    /*make filter*/
    filter = new FilterDataModel();
    filter.propertyName = 'ModuleEntityName';
    filter.value = this.requestModuleEntityName;
    filteModelContent.filters.push(filter);

    this.coreUserSupportAccessService.setAccessLoad();
    this.coreUserSupportAccessService.setAccessDataType(ManageUserAccessDataTypesEnum.Editor);
    this.coreUserSupportAccessService.ServiceGetAll(filteModelContent).subscribe({
      next: (ret) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
        if (ret.isSuccess) {
          if (ret.listItems && ret.listItems.length > 0) {
            this.dataModel = ret.listItems[0];
            this.formInfo.formAlert = '';
          }
          else {
            this.cmsToastrService.typeError(this.translate.instant('MESSAGE.Module_not_found_for_editing'));
          }
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

    this.coreUserSupportAccessService.ServiceEdit(this.dataModel).subscribe({
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
  onActionSelectorModuleEntitySelect(model: CoreModuleEntityModel): void {
    this.dataModel.moduleName = '';
    this.dataModel.moduleEntityName = '';
    if (model && model.id > 0) {
      this.dataModel.moduleName = model.moduleName;
      this.dataModel.moduleEntityName = model.moduleEntityName;
    }
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
