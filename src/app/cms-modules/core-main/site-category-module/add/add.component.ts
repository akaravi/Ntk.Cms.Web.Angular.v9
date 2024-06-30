
import {
  ChangeDetectorRef, Component, Inject, OnInit,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  AccessModel, CoreEnumService, CoreModuleModel, CoreSiteCategoryCmsModuleModel,
  CoreSiteCategoryCmsModuleService, CoreSiteCategoryModel, DataFieldInfoModel, ErrorExceptionResult,
  FormInfoModel
} from 'ntk-cms-api';
import { AddBaseComponent } from 'src/app/core/cmsComponent/addBaseComponent';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-core-sitecategorycmsmodule-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class CoreSiteCategoryCmsModuleAddComponent extends AddBaseComponent<CoreSiteCategoryCmsModuleService, CoreSiteCategoryCmsModuleModel, number> implements OnInit {
  requestLinkCmsModuleId = 0;
  requestLinkCmsSiteCategoryId = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CoreSiteCategoryCmsModuleAddComponent>,
    public coreEnumService: CoreEnumService,
    public coreSiteCategoryCmsModuleService: CoreSiteCategoryCmsModuleService,
    private cmsToastrService: CmsToastrService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {
    super(coreSiteCategoryCmsModuleService, new CoreSiteCategoryCmsModuleModel(), publicHelper);
    this.publicHelper.processService.cdr = this.cdr;
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => { this.loading.message = str; });
    if (data) {
      this.requestLinkCmsSiteCategoryId = +data.linkCmsSiteCategoryId || 0;
      this.requestLinkCmsModuleId = +data.linkCmsModuleId || 0;
    }

    if (this.requestLinkCmsSiteCategoryId > 0) {
      this.dataModel.linkCmsSiteCategoryId = this.requestLinkCmsSiteCategoryId;
    }
    if (this.requestLinkCmsModuleId > 0) {
      this.dataModel.linkCmsModuleId = this.requestLinkCmsModuleId;
    }
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();


  dataAccessModel: AccessModel;


  dataModelResult: ErrorExceptionResult<CoreSiteCategoryCmsModuleModel> = new ErrorExceptionResult<CoreSiteCategoryCmsModuleModel>();
  dataModel: CoreSiteCategoryCmsModuleModel = new CoreSiteCategoryCmsModuleModel();

  formInfo: FormInfoModel = new FormInfoModel();


  fileManagerOpenForm = false;


  ngOnInit(): void {

    this.DataGetAccess();
  }




  DataAddContent(): void {
    this.translate.get('MESSAGE.sending_information_to_the_server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.publicHelper.processService.processStart(pName);

    this.coreSiteCategoryCmsModuleService.ServiceAdd(this.dataModel).subscribe({
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
        this.publicHelper.processService.processStop(pName,false);
      }
    }
    );
  }
  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    this.formInfo.formSubmitAllow = false;
    this.DataAddContent();
  }
  onActionSiteCategorySelect(model: CoreSiteCategoryModel): void {
    this.dataModel.linkCmsSiteCategoryId = null;
    if (model && model.id > 0) {
      this.dataModel.linkCmsSiteCategoryId = model.id;
    }
  }
  onActionSelectorModuleSelect(model: CoreModuleModel): void {
    this.dataModel.linkCmsModuleId = null;
    if (model && model.id > 0) {
      this.dataModel.linkCmsModuleId = model.id;
    }
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}
