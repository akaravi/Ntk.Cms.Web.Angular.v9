
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
  CoreEnumService, DataFieldInfoModel, ErrorExceptionResult, EstateEnumService, EstatePropertyDetailGroupModel, EstatePropertyDetailModel, EstatePropertyDetailService, EstatePropertyTypeLanduseModel, FormInfoModel, InfoEnumModel
} from 'ntk-cms-api';
import { TreeModel } from 'ntk-cms-filemanager';
import { AddBaseComponent } from 'src/app/core/cmsComponent/addBaseComponent';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-estate-property-detail-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class EstatePropertyDetailAddComponent extends AddBaseComponent<EstatePropertyDetailService, EstatePropertyDetailModel, string> implements OnInit {
  requestLinkPropertyTypeLanduseId = '';
  requestLinkPropertyDetailGroupId = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EstatePropertyDetailAddComponent>,
    public coreEnumService: CoreEnumService,
    public estatePropertyDetailService: EstatePropertyDetailService,
    private cmsToastrService: CmsToastrService,
    private estateEnumService: EstateEnumService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {
    super(estatePropertyDetailService, new EstatePropertyDetailModel(), publicHelper);
    this.loading.cdr = this.cdr;
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => { this.loading.message = str; });
    if (data) {
      this.requestLinkPropertyTypeLanduseId = data.linkPropertyTypeLanduseId;
      this.requestLinkPropertyDetailGroupId = data.linkPropertyDetailGroupId;
    }
    if (this.requestLinkPropertyTypeLanduseId && this.requestLinkPropertyTypeLanduseId.length > 0) {
      this.dataModel.linkPropertyTypeLanduseId = this.requestLinkPropertyTypeLanduseId;
    }
    if (this.requestLinkPropertyDetailGroupId && this.requestLinkPropertyDetailGroupId.length > 0) {
      this.dataModel.linkPropertyDetailGroupId = this.requestLinkPropertyDetailGroupId;
    }
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  fileManagerTree: TreeModel;
  appLanguage = 'fa';
  dataModelResult: ErrorExceptionResult<EstatePropertyDetailModel> = new ErrorExceptionResult<EstatePropertyDetailModel>();
  dataModel: EstatePropertyDetailModel = new EstatePropertyDetailModel();
  formInfo: FormInfoModel = new FormInfoModel();

  fileManagerOpenForm = false;

  dataModelInputDataTypeEnumResult: ErrorExceptionResult<InfoEnumModel> = new ErrorExceptionResult<InfoEnumModel>();
  keywordDefaultDataModel = [];
  keywordNullDataModel = [];

  ngOnInit(): void {

    this.translate.get('TITLE.ADD').subscribe((str: string) => { this.formInfo.formTitle = str; });

    this.DataGetAccess();
    this.getInputDataTypeEnum();
  }
  getInputDataTypeEnum(): void {
    this.coreEnumService.ServiceInputDataTypeEnum().subscribe({
      next: (ret) => {
        this.dataModelInputDataTypeEnumResult = ret;
      }
    });
  }

  DataAddContent(): void {
    //! for convert color to hex
    this.dataModel.iconColor = this.dataModel.iconColor?.toString();
    this.translate.get('MESSAGE.sending_information_to_the_server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.publicHelper.processService.processStart(pName);

    this.estatePropertyDetailService.ServiceAdd(this.dataModel).subscribe({
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
    this.formInfo.formSubmitAllow = false;
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
