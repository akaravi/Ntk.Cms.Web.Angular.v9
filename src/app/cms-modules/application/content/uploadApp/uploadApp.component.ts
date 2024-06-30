
import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { FilePreviewModel } from 'ngx-ntk-file-picker';
import { ApplicationAppModel, ApplicationAppService, DataFieldInfoModel, FormInfoModel, UploadApplictionDtoModel } from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
@Component({
  selector: 'app-upload-app',
  templateUrl: './uploadApp.component.html',
  styleUrls: ['./uploadApp.component.scss']
})
export class ApplicationAppUploadAppComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public dataItemModel: ApplicationAppModel,
    private dialogRef: MatDialogRef<ApplicationAppUploadAppComponent>,
    private applicationAppService: ApplicationAppService,
    private cmsToastrService: CmsToastrService,
    private publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {
    this.publicHelper.processService.cdr = this.cdr;
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => { this.loading.message = str; });
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  formInfo: FormInfoModel = new FormInfoModel();
  dataModel = new UploadApplictionDtoModel();
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  isHovering = false;
  fieldvalue = '';
  loading = new ProgressSpinnerModel();

  ngOnInit(): void {
    this.dataModel.appVersion = this.dataItemModel.appVersion;
    this.dataModel.lastBuildAppKey = this.dataItemModel.lastBuildAppKey;
    this.dataModel.linkApplicationId = this.dataItemModel.id;
    this.formInfo.formSubmitAllow = false;
    this.DataGetAccess();
  }
  DataGetAccess(): void {

    const pName = this.constructor.name + 'main';
    this.publicHelper.processService.processStart(pName);
    this.applicationAppService
      .ServiceViewModel()
      .subscribe({
        next: (ret) => {
          if (ret.isSuccess) {
            this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
          } else {
            this.cmsToastrService.typeErrorGetAccess(ret.errorMessage);
          }
          this.publicHelper.processService.processStop(pName);
        },
        error: (er) => {
          this.cmsToastrService.typeErrorGetAccess(er);
          this.publicHelper.processService.processStop(pName, false);
        }
      }
      );
  }
  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    if (!this.dataModel.uploadFileGUID || this.dataModel.uploadFileGUID.length === 0) {
      this.cmsToastrService.typeErrorEdit(this.translate.instant('MESSAGE.File_has_not_been_uploaded'));
      return;
    }
    if (!this.dataModel.linkApplicationId || this.dataModel.linkApplicationId > 0) {
      this.cmsToastrService.typeErrorEdit(this.translate.instant('MESSAGE.Application_is_not_clear'));
      return;
    }
    const pName = this.constructor.name + 'main';
    this.publicHelper.processService.processStart(pName);
    this.formInfo.formSubmitAllow = false;
    this.applicationAppService.ServiceUpload(this.dataModel).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.formInfo.formSubmitAllow = false;
          this.cmsToastrService.typeSuccessAppUpload();
        } else {
          this.formInfo.formSubmitAllow = true;
          this.cmsToastrService.typeErrorEdit(ret.errorMessage);
        }
        this.publicHelper.processService.processStop(pName);

      },
      error: (er) => {
        this.formInfo.formSubmitAllow = true;
        this.cmsToastrService.typeError(er);;
        this.publicHelper.processService.processStop(pName);
      }
    });
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
  toggleHover(model: any): void {
    this.isHovering = true;
  }
  onUpload(e): void {
    //console.log(e);
  }
  OnActionUploadSuccess(model: FilePreviewModel): void {
    if (model.uploadResponse && model.uploadResponse.item && model.uploadResponse.item.fileKey) {
      this.dataModel.uploadFileGUID = model.uploadResponse.item.fileKey;
      this.formInfo.formSubmitAllow = true;
    }
  }
}
