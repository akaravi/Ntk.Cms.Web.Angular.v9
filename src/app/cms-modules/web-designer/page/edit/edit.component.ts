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
  ErrorExceptionResult,
  FormInfoModel, InfoEnumModel, ManageUserAccessDataTypesEnum, WebDesignerEnumService, WebDesignerMainPageDependencyModel, WebDesignerMainPageModel, WebDesignerMainPageService, WebDesignerMainPageTemplateModel
} from 'ntk-cms-api';
import { TreeModel } from 'ntk-cms-filemanager';
import { EditBaseComponent } from 'src/app/core/cmsComponent/editBaseComponent';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
@Component({
  selector: 'app-webdesigner-page-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class WebDesignerMainPageEditComponent extends EditBaseComponent<WebDesignerMainPageService, WebDesignerMainPageModel, string>
  implements OnInit {
  requestId = '';
  constructorInfoAreaId = this.constructor.name;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<WebDesignerMainPageEditComponent>,
    public webDesignerEnumService: WebDesignerEnumService,
    public webDesignerMainPageService: WebDesignerMainPageService,
    private cmsToastrService: CmsToastrService,
    public translate: TranslateService,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
  ) {
    super(webDesignerMainPageService, new WebDesignerMainPageModel(), publicHelper, translate);

    this.publicHelper.processService.cdr = this.cdr;
    if (data) {
      this.requestId = data.id + '';
    }
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;

  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  keywordDataModel = [];
  fileManagerTree: TreeModel;
  appLanguage = 'fa';


  dataModel: WebDesignerMainPageModel = new WebDesignerMainPageModel();
  formInfo: FormInfoModel = new FormInfoModel();

  dataModelEnumPageAbilityTypeResult: ErrorExceptionResult<InfoEnumModel> = new ErrorExceptionResult<InfoEnumModel>();
  fileManagerOpenForm = false;
  ngOnInit(): void {
    if (this.requestId.length > 0) {
      this.translate.get('TITLE.Edit').subscribe((str: string) => { this.formInfo.formTitle = str; });
      this.DataGetOneContent();
    } else {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }

    this.getEnumPageAbilityType();
  }
  getEnumPageAbilityType(): void {
    this.webDesignerEnumService.ServicePageAbilityTypeEnum().subscribe({
      next: (ret) => {
        this.dataModelEnumPageAbilityTypeResult = ret;
      }
    });
  }

  DataGetOneContent(): void {
    this.translate.get('MESSAGE.Receiving_Information_From_The_Server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'webDesignerMainPageService.ServiceGetOneById';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });
    this.webDesignerMainPageService.setAccessLoad();
    this.webDesignerMainPageService.setAccessDataType(ManageUserAccessDataTypesEnum.Editor);
    //todo: karavi subscribe
    this.webDesignerMainPageService.ServiceGetOneById(this.requestId).subscribe({
      next: (ret) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
        this.dataModel = ret.item;
        if (ret.isSuccess) {
          this.keywordDataModel = [];
          if (this.dataModel.keyword && this.dataModel.keyword.length > 0) {
            this.keywordDataModel = this.dataModel.keyword.split(',');
          }
          this.formInfo.formTitle = this.formInfo.formTitle + ' ' + ret.item.title;
          this.formInfo.formAlert = '';
        } else {
          this.translate.get('ERRORMESSAGE.MESSAGE.typeError').subscribe((str: string) => { this.formInfo.formAlert = str; });
          this.formInfo.formError = ret.errorMessage;
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.publicHelper.processService.processStop(pName);

      },
      error: (err) => {
        this.cmsToastrService.typeError(err);
        this.publicHelper.processService.processStop(pName);
      }
    }
    );
  }
  DataEditContent(): void {
    this.translate.get('MESSAGE.sending_information_to_the_server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.sending_information_to_the_server').subscribe((str: string) => { this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId); });
    //todo: karavi subscribe
    this.webDesignerMainPageService.ServiceEdit(this.dataModel).subscribe({
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
      error: (err) => {
        this.formInfo.formSubmitAllow = true;
        this.cmsToastrService.typeError(err);
        this.publicHelper.processService.processStop(pName);
      }
    }
    );
  }
  onActionSelectParent(model: WebDesignerMainPageModel | null): void {
    this.dataModel.linkPageParentGuId = model.id;
  }
  onActionSelectDependency(model: WebDesignerMainPageDependencyModel | null): void {
    if (!model || model.id?.length <= 0) {
      this.cmsToastrService.typeErrorMessage(
        this.translate.instant('MESSAGE.Specify_the_display_location'),
        this.translate.instant('MESSAGE.information_screen_is_not_clear')
      );
      return;
    }
    this.dataModel.linkPageDependencyGuId = model.id;
  }
  onActionSelectTemplate(model: WebDesignerMainPageTemplateModel | null): void {
    if (!model || model.id?.length <= 0) {
      this.cmsToastrService.typeErrorMessage(
        this.translate.instant('MESSAGE.Specify_the_template'),
        this.translate.instant('MESSAGE.Screen_template_is_not_clear')
      );
      return;
    }
    this.dataModel.linkPageTemplateGuId = model.id;
  }
  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    this.formInfo.formSubmitAllow = false;
    this.dataModel.keyword = '';
    if (this.keywordDataModel && this.keywordDataModel.length > 0) {
      const listKeyword = [];
      this.keywordDataModel.forEach(element => {
        if (element.display) {
          listKeyword.push(element.display);
        } else {
          listKeyword.push(element);
        }
      });
      if (listKeyword && listKeyword.length > 0) {
        this.dataModel.keyword = listKeyword.join(',');
      }
    }
    this.DataEditContent();
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
  onActionSelectCategory(model: CoreSiteCategoryModel | null): void {
    if (!model || model.id <= 0) {
      const message = this.translate.instant('MESSAGE.category_of_site_is_not_clear');
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.dataModel.pageDependencyIsDefaultPageLinkSiteCategoryId = model.id;
  }


  /**
* tag
*/
  addOnBlurTag = true;
  readonly separatorKeysCodes = [ENTER] as const;
  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Add our item
    if (value) {
      this.keywordDataModel.push(value);
    }
    // Clear the input value
    event.chipInput!.clear();
  }

  removeTag(item: string): void {
    const index = this.keywordDataModel.indexOf(item);

    if (index >= 0) {
      this.keywordDataModel.splice(index, 1);
    }
  }
  /**
   * tag
   */
}
