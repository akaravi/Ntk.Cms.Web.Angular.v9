
import {
  ChangeDetectorRef, Component, Inject, OnInit,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  CoreEnumService, CoreUserModel, DataFieldInfoModel, ErrorExceptionResult,
  FormInfoModel, InfoEnumModel, MemberPropertyAliasModel,
  MemberPropertyAliasService
} from 'ntk-cms-api';
import { NodeInterface, TreeModel } from 'ntk-cms-filemanager';
import { AddBaseComponent } from 'src/app/core/cmsComponent/addBaseComponent';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-member-propertyalias-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class MemberPropertyAliasAddComponent extends AddBaseComponent<MemberPropertyAliasService, MemberPropertyAliasModel, number> implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<MemberPropertyAliasAddComponent>,
    public coreEnumService: CoreEnumService,
    public memberPropertyAliasService: MemberPropertyAliasService,
    private cmsToastrService: CmsToastrService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {
    super(memberPropertyAliasService, new MemberPropertyAliasModel(), publicHelper);
    this.loading.cdr = this.cdr; this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  fileManagerTree: TreeModel;
  appLanguage = 'fa';
  dataModelResult: ErrorExceptionResult<MemberPropertyAliasModel> = new ErrorExceptionResult<MemberPropertyAliasModel>();
  dataModel: MemberPropertyAliasModel = new MemberPropertyAliasModel();
  formInfo: FormInfoModel = new FormInfoModel();

  fileManagerOpenForm = false;

  ngOnInit(): void {

    this.formInfo.formTitle = this.translate.instant('TITLE.ADD');

    this.DataGetAccess();

  }



  // DataGetAccess(): void {
  //   const pName = this.constructor.name + 'DataGetAccess';
  //   this.loading.Start(pName);

  //   this.memberPropertyAliasService
  //     .ServiceViewModel()
  //     .subscribe({
  //       next: (ret) => {
  //         if (ret.isSuccess) {
  //           this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
  //         } else {
  //           this.cmsToastrService.typeErrorGetAccess(ret.errorMessage);
  //         }
  //         this.loading.Stop(pName);
  //       },
  //       error: (er) => {
  //         this.cmsToastrService.typeErrorGetAccess(er);
  //         this.loading.Stop(pName);
  //       }
  //     }
  //     );
  // }
  DataAddContent(): void {
    this.formInfo.formAlert = this.translate.instant('MESSAGE.sending_information_to_the_server');
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.memberPropertyAliasService.ServiceAdd(this.dataModel).subscribe({
      next: (ret) => {
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

        this.formInfo.formSubmitAllow = true;
      },
      error: (er) => {
        this.formInfo.formSubmitAllow = true;
        this.cmsToastrService.typeError(er);
        this.loading.Stop(pName);
      }
    }
    );
  }
  onActionSelectorUser(model: CoreUserModel | null): void {
    this.dataModel.linkCmsUserId = null;
    if (model && model.id > 0) {
      this.dataModel.linkCmsUserId = model.id;
    }
  }
  onActionFileSelectedLinkMainImageId(model: NodeInterface): void {
    this.dataModel.linkMainImageId = model.id;
    // this.dataModel.linkMainImageIdSrc = model.downloadLinksrc;
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
