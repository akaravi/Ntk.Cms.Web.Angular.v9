
import {
  ChangeDetectorRef, Component, Inject, OnInit,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  CoreEnumService, DataFieldInfoModel, ErrorExceptionResult,
  FormInfoModel,
  SmsMainApiPathPublicConfigModel, SmsMainApiPathPublicConfigService
} from 'ntk-cms-api';
import { NodeInterface, TreeModel } from 'ntk-cms-filemanager';
import { AddBaseComponent } from 'src/app/core/cmsComponent/addBaseComponent';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-sms-publicconfig-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class SmsMainApiPathPublicConfigAddComponent extends AddBaseComponent<SmsMainApiPathPublicConfigService, SmsMainApiPathPublicConfigModel, string> implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SmsMainApiPathPublicConfigAddComponent>,
    public coreEnumService: CoreEnumService,
    public smsMainApiPathPublicConfigService: SmsMainApiPathPublicConfigService,
    private cmsToastrService: CmsToastrService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {
    super(smsMainApiPathPublicConfigService, new SmsMainApiPathPublicConfigModel(), publicHelper);
    this.loading.cdr = this.cdr; this.loading.message = this.translate.instant('MESSAGE.Receiving_information');

    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];

  fileManagerTree: TreeModel;
  appLanguage = 'fa';

  dataModelResult: ErrorExceptionResult<SmsMainApiPathPublicConfigModel> = new ErrorExceptionResult<SmsMainApiPathPublicConfigModel>();
  dataModel: SmsMainApiPathPublicConfigModel = new SmsMainApiPathPublicConfigModel();


  formInfo: FormInfoModel = new FormInfoModel();


  fileManagerOpenForm = false;




  ngOnInit(): void {

    this.formInfo.formTitle = this.translate.instant('TITLE.ADD');

    this.DataGetAccess();
  }


  DataAddContent(): void {
    this.formInfo.formAlert = this.translate.instant('MESSAGE.sending_information_to_the_server');
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.smsMainApiPathPublicConfigService.ServiceAdd(this.dataModel).subscribe({
      next: (ret) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);

        this.formInfo.formSubmitAllow = true;
        this.dataModelResult = ret;
        if (ret.isSuccess) {
          this.formInfo.formAlert = this.translate.instant('MESSAGE.registration_completed_successfully');
          this.cmsToastrService.typeSuccessAdd();
          this.dialogRef.close({ dialogChangedDate: true });
        } else {
          this.formInfo.formAlert = this.translate.instant('ERRORMESSAGE.MESSAGE.typeError');
          this.formInfo.formError = ret.errorMessage;
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.loading.Stop(pName);

      },
      error: (er) => {
        this.formInfo.formSubmitAllow = true;
        this.cmsToastrService.typeError(er);
        this.loading.Stop(pName);
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
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}
