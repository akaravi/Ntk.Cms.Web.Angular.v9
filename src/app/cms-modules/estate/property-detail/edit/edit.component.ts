
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
  CoreEnumService,
  ErrorExceptionResult, ErrorExceptionResultBase, EstatePropertyDetailGroupModel, EstatePropertyDetailModel, EstatePropertyDetailService, EstatePropertyTypeLanduseModel, FormInfoModel, InfoEnumModel, ManageUserAccessDataTypesEnum
} from 'ntk-cms-api';
import { TreeModel } from 'ntk-cms-filemanager';
import { EditBaseComponent } from 'src/app/core/cmsComponent/editBaseComponent';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-estate-property-detail-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EstatePropertyDetailEditComponent extends EditBaseComponent<EstatePropertyDetailService, EstatePropertyDetailModel, string>
  implements OnInit {
  requestId = '';
  constructorInfoAreaId = this.constructor.name;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EstatePropertyDetailEditComponent>,
    public coreEnumService: CoreEnumService,
    public estatePropertyDetailService: EstatePropertyDetailService,
    private cmsToastrService: CmsToastrService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {
    super(estatePropertyDetailService, new EstatePropertyDetailModel(), publicHelper, translate);

    this.publicHelper.processService.cdr = this.cdr;

    if (data) {
      this.requestId = data.id;
    }
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;


  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  fileManagerTree: TreeModel;
  appLanguage = 'fa';

  dataModelResult: ErrorExceptionResultBase = new ErrorExceptionResultBase();
  dataModel: EstatePropertyDetailModel = new EstatePropertyDetailModel();
  formInfo: FormInfoModel = new FormInfoModel();

  dataModelInputDataTypeEnumResult: ErrorExceptionResult<InfoEnumModel> = new ErrorExceptionResult<InfoEnumModel>();
  keywordDefaultDataModel = [];
  keywordNullDataModel = [];
  fileManagerOpenForm = false;

  ngOnInit(): void {
    this.translate.get('TITLE.Edit').subscribe((str: string) => { this.formInfo.formTitle = str; });
    if (!this.requestId || this.requestId.length === 0) {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }
    this.DataGetOneContent();

    this.getInputDataTypeEnum();
  }
  getInputDataTypeEnum(): void {
    this.coreEnumService.ServiceInputDataTypeEnum().subscribe({
      next: (ret) => {
        this.dataModelInputDataTypeEnumResult = ret;
      }
    });
  }


  DataGetOneContent(): void {

    this.translate.get('MESSAGE.Receiving_Information_From_The_Server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });

    this.estatePropertyDetailService.setAccessLoad();
    this.estatePropertyDetailService.setAccessDataType(ManageUserAccessDataTypesEnum.Editor);
    this.estatePropertyDetailService.ServiceGetOneById(this.requestId).subscribe({
      next: (ret) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);

        this.dataModel = ret.item;
        if (ret.isSuccess) {
          this.dataModel.configValueDefaultValueJson = this.dataModel.configValueDefaultValueJson + '';
          this.dataModel.configValueNullValueJson = this.dataModel.configValueNullValueJson + '';
          this.keywordDefaultDataModel = this.dataModel.configValueDefaultValueJson.split(',');
          this.keywordNullDataModel = this.dataModel.configValueNullValueJson.split(',');
          this.formInfo.formTitle = this.formInfo.formTitle + ' ' + ret.item.title;
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
    //! for convert color to hex
    this.dataModel.iconColor = this.dataModel.iconColor?.toString();
    this.translate.get('MESSAGE.sending_information_to_the_server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.sending_information_to_the_server').subscribe((str: string) => { this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId); });

    this.estatePropertyDetailService.ServiceEdit(this.dataModel).subscribe({
      next: (ret) => {
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
  onActionSelectorSelect(model: EstatePropertyTypeLanduseModel | null): void {
    if (!model || !model.id || model.id.length <= 0) {
      this.translate.get('MESSAGE.category_of_information_is_not_clear').subscribe((str: string) => { this.cmsToastrService.typeErrorSelected(str); });
      return;
    }
    this.dataModel.linkPropertyTypeLanduseId = model.id;
  }
  onActionSelectorDetailGroup(model: EstatePropertyDetailGroupModel | null): void {
    if (!model || !model.id || model.id.length <= 0) {
      this.translate.get('MESSAGE.category_of_information_is_not_clear').subscribe((str: string) => { this.cmsToastrService.typeErrorSelected(str); });
      return;
    }
    this.dataModel.linkPropertyDetailGroupId = model.id;
  }
  onIconPickerSelect(model: any): void {
    this.dataModel.iconFont = model;
  }

  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    this.dataModel.configValueDefaultValueJson = '';
    if (this.keywordDefaultDataModel && this.keywordDefaultDataModel.length > 0) {
      const listKeyword = [];
      this.keywordDefaultDataModel.forEach(element => {
        if (element.display) {
          listKeyword.push(element.display);
        } else {
          listKeyword.push(element);
        }
      });
      if (listKeyword && listKeyword.length > 0) {
        this.dataModel.configValueDefaultValueJson = listKeyword.join(',');
      }
    }
    this.dataModel.configValueNullValueJson = '';
    if (this.keywordNullDataModel && this.keywordNullDataModel.length > 0) {
      const listKeyword = [];
      this.keywordNullDataModel.forEach(element => {
        if (element.display) {
          listKeyword.push(element.display);
        } else {
          listKeyword.push(element);
        }
      });
      if (listKeyword && listKeyword.length > 0) {
        this.dataModel.configValueNullValueJson = listKeyword.join(',');
      }
    }
    this.formInfo.formSubmitAllow = false;
    this.DataEditContent();
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
  /**
  * tag
  */
  addOnBlurTag = true;
  readonly separatorKeysCodes = [ENTER] as const;
  addTagDefault(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Add our item
    if (value) {
      this.keywordDefaultDataModel.push(value);
    }
    // Clear the input value
    event.chipInput!.clear();
  }

  removeTagDefault(item: string): void {
    const index = this.keywordDefaultDataModel.indexOf(item);

    if (index >= 0) {
      this.keywordDefaultDataModel.splice(index, 1);
    }
  }
  addTagNull(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Add our item
    if (value) {
      this.keywordNullDataModel.push(value);
    }
    // Clear the input value
    event.chipInput!.clear();
  }

  removeTagNull(item: string): void {
    const index = this.keywordNullDataModel.indexOf(item);

    if (index >= 0) {
      this.keywordNullDataModel.splice(index, 1);
    }
  }
  /**
   * tag
   */
}
