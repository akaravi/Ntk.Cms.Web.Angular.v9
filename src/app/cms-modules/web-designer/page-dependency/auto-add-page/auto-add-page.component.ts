import {
  ChangeDetectorRef, Component, Inject, OnInit,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  CoreEnumService, DataFieldInfoModel,
  ErrorExceptionResultBase, FormInfoModel,
  WebDesignerMainPageModel,
  WebDesignerMainPageService,
  WebDesignerMainPageTemplateModel, WebDesignerPageAutoAddDtoModel
} from 'ntk-cms-api';
import { TreeModel } from 'ntk-cms-filemanager';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
@Component({
    selector: 'app-webdesigner-pagedependency-autoaddpage',
    templateUrl: './auto-add-page.component.html',
    styleUrls: ['./auto-add-page.component.scss'],
    standalone: false
})
export class WebDesignerMainPageDependencyAutoAddPageComponent implements OnInit {
  constructorInfoAreaId = this.constructor.name;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<WebDesignerMainPageDependencyAutoAddPageComponent>,
    public coreEnumService: CoreEnumService,
    public webDesignerMainPageService: WebDesignerMainPageService,
    private cmsToastrService: CmsToastrService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {
    this.publicHelper.processService.cdr = this.cdr;
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  fileManagerTree: TreeModel;
  appLanguage = 'fa';

  dataModelResult: ErrorExceptionResultBase = new ErrorExceptionResultBase();
  dataModel: WebDesignerPageAutoAddDtoModel = new WebDesignerPageAutoAddDtoModel();
  formInfo: FormInfoModel = new FormInfoModel();

  fileManagerOpenForm = false;
  ngOnInit(): void {
    this.formInfo.formTitle = this.translate.instant('TITLE.Automatically_add_all_pages');

  }

  DataAddContent(): void {
    this.translate.get('MESSAGE.sending_information_to_the_server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });
    this.webDesignerMainPageService.ServiceAutoAdd(this.dataModel).subscribe({
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
      error: (err) => {
        this.formInfo.formSubmitAllow = true;
        this.cmsToastrService.typeError(err);
        this.publicHelper.processService.processStop(pName);
      }
    }
    );
  }
  onActionSelectModule(model: WebDesignerMainPageTemplateModel | null): void {
    if (!model || model.id.length <= 0) {
      this.cmsToastrService.typeErrorMessage(
        this.translate.instant('MESSAGE.Specify_the_template'),
        this.translate.instant('MESSAGE.Information_of_template_is_not_clear')
      );
      return;
    }
    this.dataModel.linkPageTemplateGuId = model.id;
  }
  onActionSelectParent(model: WebDesignerMainPageModel): void {
    this.dataModel.linkPageParentGuId = '';
    if (model && model.id && model.id.length > 0) {
      this.dataModel.linkPageParentGuId = model.id;
    }
  }
  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    this.formInfo.formSubmitAllow = false;
    if (!this.dataModel.linkPageTemplateGuId || this.dataModel.linkPageTemplateGuId.length <= 0) {
      this.cmsToastrService.typeErrorMessage(
        this.translate.instant('MESSAGE.Specify_the_template'),
        this.translate.instant('MESSAGE.Information_of_template_is_not_clear')
      );
      return;
    }
    this.DataAddContent();
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}
