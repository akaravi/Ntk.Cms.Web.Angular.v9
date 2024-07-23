
import {
  ChangeDetectorRef, Component, Inject, OnInit,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  CoreEnumService, CoreUserClaimGroupDetailModel, CoreUserClaimGroupDetailService, CoreUserClaimGroupModel, CoreUserClaimTypeModel,
  ErrorExceptionResultBase, FilterDataModel, FilterModel, FormInfoModel,
  ManageUserAccessDataTypesEnum
} from 'ntk-cms-api';
import { TreeModel } from 'ntk-cms-filemanager';
import { EditBaseComponent } from 'src/app/core/cmsComponent/editBaseComponent';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-core-userclaimgroupdetail-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class CoreUserClaimGroupDetailEditComponent extends EditBaseComponent<CoreUserClaimGroupDetailService, CoreUserClaimGroupDetailModel, number>
  implements OnInit {
  requestModel = new CoreUserClaimGroupDetailModel();
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CoreUserClaimGroupDetailEditComponent>,
    public coreEnumService: CoreEnumService,
    public coreUserClaimGroupDetailService: CoreUserClaimGroupDetailService,
    public publicHelper: PublicHelper,
    private cmsToastrService: CmsToastrService,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {
    super(coreUserClaimGroupDetailService, new CoreUserClaimGroupDetailModel(), publicHelper, translate);

    this.publicHelper.processService.cdr = this.cdr;

    if (data) {
      this.requestModel = data.model;
    }

    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;


  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];

  fileManagerTree: TreeModel;
  appLanguage = 'fa';


  dataModelResult: ErrorExceptionResultBase = new ErrorExceptionResultBase();
  dataModel: CoreUserClaimGroupDetailModel = new CoreUserClaimGroupDetailModel();

  formInfo: FormInfoModel = new FormInfoModel();


  fileManagerOpenForm = false;


  ngOnInit(): void {
    if (this.requestModel && this.requestModel.linkUserClaimTypeId > 0) {
      this.translate.get('TITLE.Edit').subscribe((str: string) => { this.formInfo.formTitle = str; });
      this.DataGetOneContent();
    } else {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }


  }

  DataGetOneContent(): void {

    this.translate.get('MESSAGE.Receiving_Information_From_The_Server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructor.name);
    });


    const filteModelContent = new FilterModel();
    let fastfilter = new FilterDataModel();
    fastfilter.propertyName = 'LinkUserClaimGroupId';
    fastfilter.value = this.requestModel.linkUserClaimGroupId;
    filteModelContent.filters.push(fastfilter);
    /** */
    fastfilter = new FilterDataModel();
    fastfilter.propertyName = 'LinkUserClaimTypeId';
    fastfilter.value = this.requestModel.linkUserClaimTypeId;
    filteModelContent.filters.push(fastfilter);

    this.coreUserClaimGroupDetailService.setAccessLoad();
    this.coreUserClaimGroupDetailService.setAccessDataType(ManageUserAccessDataTypesEnum.Editor);
    this.coreUserClaimGroupDetailService.ServiceGetAll(filteModelContent).subscribe({
      next: (ret) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
        if (ret.isSuccess && ret.listItems.length > 0) {
          this.dataModel = ret.listItems[0];
          this.formInfo.formTitle = this.formInfo.formTitle + ' ' +
            this.dataModel.linkUserClaimGroupId + '<-->' + this.dataModel.linkUserClaimTypeId;
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
    this.translate.get('MESSAGE.sending_information_to_the_server').subscribe((str: string) => { this.publicHelper.processService.processStart(pName, str, this.constructor.name); });

    this.coreUserClaimGroupDetailService.ServiceEdit(this.dataModel).subscribe({
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
  onActionSelectClaimGroup(model: CoreUserClaimGroupModel | null): void {
    if (!model || model.id <= 0) {
      this.cmsToastrService.typeErrorMessage(
        this.translate.instant('MESSAGE.Specify_the_category'),
        this.translate.instant('MESSAGE.group_of_information_documents_is_not_clear')
      );
      return;
    }
    this.dataModel.linkUserClaimGroupId = model.id;
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
