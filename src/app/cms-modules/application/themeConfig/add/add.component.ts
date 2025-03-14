
import {
  ChangeDetectorRef, Component, Inject, OnInit,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  AccessModel, ApplicationThemeConfigModel,
  ApplicationThemeConfigService, CoreEnumService, CoreSiteCategoryModel, DataFieldInfoModel, ErrorExceptionResult,
  FormInfoModel
} from 'ntk-cms-api';
import { NodeInterface, TreeModel } from 'ntk-cms-filemanager';
import { AddBaseComponent } from 'src/app/core/cmsComponent/addBaseComponent';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

type NewType = MatDialog;

@Component({
    selector: 'app-core-sitecategorycmsmodule-add',
    templateUrl: './add.component.html',
    styleUrls: ['./add.component.scss'],
    standalone: false
})
export class ApplicationThemeConfigAddComponent extends AddBaseComponent<ApplicationThemeConfigService, ApplicationThemeConfigModel, number> implements OnInit {
  requestLinkSourceId = 0;
  requestLinkCmsSiteCategoryId = 0;
  constructorInfoAreaId = this.constructor.name;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ApplicationThemeConfigAddComponent>,
    public coreEnumService: CoreEnumService,
    public applicationThemeConfigService: ApplicationThemeConfigService,
    private cmsToastrService: CmsToastrService,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
    public publicHelper: PublicHelper,
  ) {
    super(applicationThemeConfigService, new ApplicationThemeConfigModel(), publicHelper, translate);
    this.publicHelper.processService.cdr = this.cdr;

    if (data) {
      this.requestLinkSourceId = +data.linkSourceId || 0;
    }

    if (this.requestLinkSourceId > 0) {
      this.dataModel.linkSourceId = this.requestLinkSourceId;
    }
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
    this.DataGetAccess();
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  fileManagerTree: TreeModel;
  appLanguage = 'fa';

  dataAccessModel: AccessModel;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();


  dataModelResult: ErrorExceptionResult<ApplicationThemeConfigModel> = new ErrorExceptionResult<ApplicationThemeConfigModel>();
  dataModel: ApplicationThemeConfigModel = new ApplicationThemeConfigModel();


  formInfo: FormInfoModel = new FormInfoModel();


  fileManagerOpenForm = false;


  ngOnInit(): void {

  }



  DataAddContent(): void {
    this.translate.get('MESSAGE.sending_information_to_the_server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });

    this.applicationThemeConfigService.ServiceAdd(this.dataModel).subscribe({
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
  onActionFileSelected(model: NodeInterface): void {
    this.dataModel.linkMainImageId = model.id;
    this.dataModel.linkMainImageIdSrc = model.downloadLinksrc;

  }
  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    this.formInfo.formSubmitAllow = false;
    this.DataAddContent();
  }
  onActionSelectSource(model: CoreSiteCategoryModel): void {
    this.dataModel.linkSourceId = null;
    if (model && model.id > 0) {
      this.dataModel.linkSourceId = model.id;
    }
  }

  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}
