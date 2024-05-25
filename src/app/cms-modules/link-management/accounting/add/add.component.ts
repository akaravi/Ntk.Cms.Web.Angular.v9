
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
  LinkManagementAccountingModel, LinkManagementAccountingService, LinkManagementMemberModel
} from 'ntk-cms-api';
import { TreeModel } from 'ntk-cms-filemanager';
import { AddBaseComponent } from 'src/app/core/cmsComponent/addBaseComponent';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-linkmanagement-accounting-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class LinkManagementAccountingAddComponent extends AddBaseComponent<LinkManagementAccountingService, LinkManagementAccountingModel, number> implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<LinkManagementAccountingAddComponent>,
    public coreEnumService: CoreEnumService,
    public categoryService: LinkManagementAccountingService,
    private cmsToastrService: CmsToastrService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {
    super(categoryService, new LinkManagementAccountingModel(), publicHelper);
    this.loading.cdr = this.cdr; this.loading.message = this.translate.instant('MESSAGE.Receiving_information');

    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];

  fileManagerTree: TreeModel;
  appLanguage = 'fa';

  dataModelResult: ErrorExceptionResult<LinkManagementAccountingModel> = new ErrorExceptionResult<LinkManagementAccountingModel>();
  dataModel: LinkManagementAccountingModel = new LinkManagementAccountingModel();


  formInfo: FormInfoModel = new FormInfoModel();


  fileManagerOpenForm = false;



  ngOnInit(): void {

    this.formInfo.formTitle = this.translate.instant('TITLE.Register_New_Categories');


    this.DataGetAccess();

  }

  DataAddContent(): void {
    this.formInfo.formAlert = this.translate.instant('MESSAGE.sending_information_to_the_server');
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);


    this.categoryService.ServiceAdd(this.dataModel).subscribe({
      next: (ret) => {
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
  onActionSelectorSelectLinkManagementMemberId(model: LinkManagementMemberModel | null): void {
    if (!model || model.id <= 0) {
      const message = this.translate.instant('MESSAGE.Type_of_User_account_is_not_known');
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.dataModel.linkManagementMemberId = model.id;
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
