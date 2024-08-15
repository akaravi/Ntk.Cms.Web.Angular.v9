
import {
  ChangeDetectorRef, Component, Inject, OnInit,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  ContactCategoryModel, ContactCategoryService, CoreEnumService, DataFieldInfoModel, ErrorExceptionResult,
  FormInfoModel
} from 'ntk-cms-api';
import { NodeInterface, TreeModel } from 'ntk-cms-filemanager';
import { AddBaseComponent } from 'src/app/core/cmsComponent/addBaseComponent';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-contact-category-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class ContactCategoryAddComponent extends AddBaseComponent<ContactCategoryService, ContactCategoryModel, string> implements OnInit {
  requestParentId = '';
  constructorInfoAreaId = this.constructor.name;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ContactCategoryAddComponent>,
    public coreEnumService: CoreEnumService,
    public contactCategoryService: ContactCategoryService,
    private cmsToastrService: CmsToastrService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {
    super(contactCategoryService, new ContactCategoryModel(), publicHelper, translate);
    this.publicHelper.processService.cdr = this.cdr;
    if (data && data.parentId && data.parentId.length > 0) {
      this.requestParentId = data.parentId;
    }
    if (this.requestParentId.length > 0) {
      this.dataModel.linkParentId = this.requestParentId;
    }
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];

  fileManagerTree: TreeModel;
  appLanguage = 'fa';

  dataModelResult: ErrorExceptionResult<ContactCategoryModel> = new ErrorExceptionResult<ContactCategoryModel>();
  dataModel: ContactCategoryModel = new ContactCategoryModel();


  formInfo: FormInfoModel = new FormInfoModel();


  fileManagerOpenForm = false;


  onActionFileSelected(model: NodeInterface): void {
    this.dataModel.linkMainImageId = model.id;
    this.dataModel.linkMainImageIdSrc = model.downloadLinksrc;

  }

  ngOnInit(): void {
    this.formInfo.formTitle = this.translate.instant('TITLE.Register_New_Categories');

    this.DataGetAccess();

  }


  DataAddContent(): void {
    this.translate.get('MESSAGE.sending_information_to_the_server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructor.name);
    });


    this.contactCategoryService.ServiceAdd(this.dataModel).subscribe({
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
