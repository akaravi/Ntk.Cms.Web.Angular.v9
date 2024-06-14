import {
  ChangeDetectorRef, Component, Inject, OnInit,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  CoreEnumService, CoreSiteCategoryModel,
  FilterDataModel, FilterModel, FormInfoModel,
  ManageUserAccessDataTypesEnum, WebDesignerMainPageTemplateModel, WebDesignerMainPageTemplateService, WebDesignerMainPageTemplateSiteCategoryModel,
  WebDesignerMainPageTemplateSiteCategoryService
} from 'ntk-cms-api';
import { TreeModel } from 'ntk-cms-filemanager';
import { EditBaseComponent } from 'src/app/core/cmsComponent/editBaseComponent';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
@Component({
  selector: 'app-webdesigner-pagetemplate-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class WebDesignerMainPageTemplateEditComponent extends EditBaseComponent<WebDesignerMainPageTemplateService, WebDesignerMainPageTemplateModel, string>
  implements OnInit {
  requestId = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<WebDesignerMainPageTemplateEditComponent>,
    public coreEnumService: CoreEnumService,
    public webDesignerMainPageTemplateService: WebDesignerMainPageTemplateService,
    public webDesignerMainPageTemplateSiteCategoryService: WebDesignerMainPageTemplateSiteCategoryService,
    private cmsToastrService: CmsToastrService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {
    super(webDesignerMainPageTemplateService, new WebDesignerMainPageTemplateModel(), publicHelper);

    this.loading.cdr = this.cdr; this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => { this.loading.message = str; });
    if (data) {
      this.requestId = data.id + '';
    }
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;

  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  fileManagerTree: TreeModel;
  appLanguage = 'fa';

  dataModel: WebDesignerMainPageTemplateModel = new WebDesignerMainPageTemplateModel();
  formInfo: FormInfoModel = new FormInfoModel();

  fileManagerOpenForm = false;
  dataCoreSiteCategoryModel: CoreSiteCategoryModel[];
  dataCoreSiteCategoryIds: number[] = [];
  dataWebDesignerMainPageTemplateSiteCategoryModel: WebDesignerMainPageTemplateSiteCategoryModel[];
  ngOnInit(): void {
    if (this.requestId.length > 0) {
      this.translate.get('TITLE.Edit').subscribe((str: string) => { this.formInfo.formTitle = str; });
      this.DataGetOneContent();
    } else {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }

    this.DataGetAllSourceSiteCategory();
  }

  DataGetOneContent(): void {
    this.translate.get('MESSAGE.Receiving_Information_From_The_Server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);
    this.webDesignerMainPageTemplateService.setAccessLoad();
    this.webDesignerMainPageTemplateService.setAccessDataType(ManageUserAccessDataTypesEnum.Editor);
    this.webDesignerMainPageTemplateService.ServiceGetOneById(this.requestId).subscribe(
      (next) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.access);
        this.dataModel = next.item;
        if (next.isSuccess) {
          this.formInfo.formTitle = this.formInfo.formTitle + ' ' + next.item.title;
          this.formInfo.formAlert = '';
        } else {
          this.translate.get('ERRORMESSAGE.MESSAGE.typeError').subscribe((str: string) => { this.formInfo.formAlert = str; });
          this.formInfo.formError = next.errorMessage;
          this.cmsToastrService.typeErrorMessage(next.errorMessage);
        }
        this.loading.Stop(pName);

      },
      (error) => {
        this.cmsToastrService.typeError(error);
        this.loading.Stop(pName);
      }
    );
  }
  DataEditContent(): void {
    this.translate.get('MESSAGE.sending_information_to_the_server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);
    this.webDesignerMainPageTemplateService.ServiceEdit(this.dataModel).subscribe(
      (next) => {
        this.formInfo.formSubmitAllow = true;
        this.dataModelResult = next;
        if (next.isSuccess) {
          this.translate.get('MESSAGE.registration_completed_successfully').subscribe((str: string) => { this.formInfo.formAlert = str; });
          this.cmsToastrService.typeSuccessEdit();
          this.dialogRef.close({ dialogChangedDate: true });
        } else {
          this.translate.get('ERRORMESSAGE.MESSAGE.typeError').subscribe((str: string) => { this.formInfo.formAlert = str; });
          this.formInfo.formError = next.errorMessage;
          this.cmsToastrService.typeErrorMessage(next.errorMessage);
        }
        this.loading.Stop(pName);
      },
      (error) => {
        this.formInfo.formSubmitAllow = true;
        this.cmsToastrService.typeError(error);
        this.loading.Stop(pName);
      }
    );
  }
  DataGetAllSourceSiteCategory(): void {
    this.translate.get('MESSAGE.Receiving_Information_From_The_Server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'webDesignerMainPageTemplateSiteCategoryService';
    this.loading.Start(pName);
    const filteModelContent = new FilterModel();
    const filter = new FilterDataModel();
    filter.propertyName = 'LinkPageTemplateId';
    filter.value = this.requestId;
    filteModelContent.filters.push(filter);
    this.webDesignerMainPageTemplateSiteCategoryService.ServiceGetAll(filteModelContent).subscribe(
      (next) => {
        this.dataWebDesignerMainPageTemplateSiteCategoryModel = next.listItems;
        const listG: number[] = [];
        this.dataWebDesignerMainPageTemplateSiteCategoryModel.forEach(element => {
          listG.push(element.linkSiteCagegoryId);
        });
        this.dataCoreSiteCategoryIds = listG;
        if (next.isSuccess) {
          this.formInfo.formAlert = '';
        } else {
          this.translate.get('ERRORMESSAGE.MESSAGE.typeError').subscribe((str: string) => { this.formInfo.formAlert = str; });
          this.formInfo.formError = next.errorMessage;
          this.cmsToastrService.typeErrorMessage(next.errorMessage);
        }
        this.loading.Stop(pName);
      },
      (error) => {
        this.cmsToastrService.typeError(error);
        this.loading.Stop(pName);
      }
    );
  }
  onActionSelectorUserCategorySelect(model: CoreSiteCategoryModel[]): void {
    this.dataCoreSiteCategoryModel = model;
  }
  onActionSelectorUserCategorySelectAdded(model: CoreSiteCategoryModel): void {
    const entity = new WebDesignerMainPageTemplateSiteCategoryModel();
    entity.linkSiteCagegoryId = model.id;
    entity.linkPageTemplateId = this.dataModel.id;
    const pName = this.constructor.name + 'webDesignerMainPageTemplateSiteCategoryService.ServiceAdd';
    this.loading.Start(pName);
    this.webDesignerMainPageTemplateSiteCategoryService.ServiceAdd(entity).subscribe(
      (next) => {
        if (next.isSuccess) {
          this.translate.get('MESSAGE.registration_in_this_group_was_successful').subscribe((str: string) => { this.formInfo.formAlert = str; });
          this.cmsToastrService.typeSuccessEdit();
          // this.dialogRef.close({ dialogChangedDate: true });
        } else {
          this.translate.get('ERRORMESSAGE.MESSAGE.typeError').subscribe((str: string) => { this.formInfo.formAlert = str; });
          this.formInfo.formError = next.errorMessage;
          this.cmsToastrService.typeErrorMessage(next.errorMessage);
        }
        this.loading.Stop(pName);
      },
      (error) => {
        this.formInfo.formSubmitAllow = true;
        this.cmsToastrService.typeError(error);
        this.loading.Stop(pName);
      }
    );
  }
  onActionSelectorUserCategorySelectRemoved(model: CoreSiteCategoryModel): void {
    const entity = new WebDesignerMainPageTemplateSiteCategoryModel();
    entity.linkSiteCagegoryId = model.id;
    entity.linkPageTemplateId = this.dataModel.id;
    const pName = this.constructor.name + 'webDesignerMainPageTemplateSiteCategoryService.ServiceDeleteEntity';
    this.loading.Start(pName);
    this.webDesignerMainPageTemplateSiteCategoryService.ServiceDeleteEntity(entity).subscribe(
      (next) => {
        if (next.isSuccess) {
          this.translate.get('MESSAGE.Deletion_from_this_group_Was_Successful').subscribe((str: string) => { this.formInfo.formAlert = str; });
          this.cmsToastrService.typeSuccessEdit();
          // this.dialogRef.close({ dialogChangedDate: true });
        } else {
          this.translate.get('ERRORMESSAGE.MESSAGE.typeError').subscribe((str: string) => { this.formInfo.formAlert = str; });
          this.formInfo.formError = next.errorMessage;
          this.cmsToastrService.typeErrorMessage(next.errorMessage);
        }
        this.loading.Stop(pName);
      },
      (error) => {
        this.formInfo.formSubmitAllow = true;
        this.cmsToastrService.typeError(error);
        this.loading.Stop(pName);
      }
    );
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
