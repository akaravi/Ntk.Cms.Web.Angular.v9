import { AddBaseComponent } from './../../../../core/cmsComponent/addBaseComponent';

import {
  ChangeDetectorRef, Component, Inject, OnInit,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  CoreEnumService, CoreModuleEntityModel, CoreModuleEntityReportFileModel, CoreModuleEntityReportFileService, DataFieldInfoModel, ErrorExceptionResult,
  FormInfoModel, InfoEnumModel
} from 'ntk-cms-api';
import { NodeInterface, TreeModel } from 'ntk-cms-filemanager';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-core-module-entity-report-file-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class CoreModuleEntityReportFileAddComponent extends AddBaseComponent<CoreModuleEntityReportFileService, CoreModuleEntityReportFileModel, string> implements OnInit {
  constructorInfoAreaId = this.constructor.name;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CoreModuleEntityReportFileAddComponent>,
    public coreEnumService: CoreEnumService,
    public coreModuleEntityReportFileService: CoreModuleEntityReportFileService,
    private cmsToastrService: CmsToastrService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {
    super(coreModuleEntityReportFileService, new CoreModuleEntityReportFileModel(), publicHelper, translate);
    this.publicHelper.processService.cdr = this.cdr;

    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
    if (data && data.linkModuleEntityId) {
      this.dataModel.linkModuleEntityId = data.linkModuleEntityId;
    }
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  selectFileTypeReport = ['mrt'];

  fileManagerTree: TreeModel;
  appLanguage = 'fa';

  dataModelResult: ErrorExceptionResult<CoreModuleEntityReportFileModel> = new ErrorExceptionResult<CoreModuleEntityReportFileModel>();
  dataModel: CoreModuleEntityReportFileModel = new CoreModuleEntityReportFileModel();
  dataModelReportFileTypeEnumResult: ErrorExceptionResult<InfoEnumModel> = new ErrorExceptionResult<InfoEnumModel>();


  formInfo: FormInfoModel = new FormInfoModel();


  fileManagerOpenForm = false;
  fileManagerOpenFormReport = false;




  ngOnInit(): void {

    this.translate.get('TITLE.ADD').subscribe((str: string) => { this.formInfo.formTitle = str; });

    this.DataGetAccess();
    this.getReportFileTypeEnum();

  }


  getReportFileTypeEnum(): void {
    this.coreEnumService.ServiceReportFileTypeEnum().subscribe({
      next: (ret) => {
        this.dataModelReportFileTypeEnumResult = ret;
      }
    });
  }


  DataAddContent(): void {
    this.translate.get('MESSAGE.sending_information_to_the_server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructor.name);
    });

    this.coreModuleEntityReportFileService.ServiceAdd(this.dataModel).subscribe({
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
  onActionSelectorModuleEntitySelect(model: CoreModuleEntityModel): void {
    this.dataModel.linkModuleEntityId = null;
    if (model && model.id > 0) {
      this.dataModel.linkModuleEntityId = model.id;
    }
  }
  onActionFileSelected(model: NodeInterface): void {
    this.dataModel.linkImageId = model.id;
    this.dataModel.linkImageIdSrc = model.downloadLinksrc;

  }
  onActionFileSelectedLinkFileId(model: NodeInterface): void {
    this.dataModel.linkFileId = model.id;
    this.dataModel.linkFileIdSrc = model.downloadLinksrc;
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
}
