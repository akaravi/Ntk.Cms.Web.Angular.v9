
import {
  ChangeDetectorRef, Component, Inject, OnInit,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  CoreEnumService, CoreLocationModel, CoreLocationService, DataFieldInfoModel, ErrorExceptionResult,
  FormInfoModel, InfoEnumModel
} from 'ntk-cms-api';
import { NodeInterface, TreeModel } from 'ntk-cms-filemanager';
import { AddBaseComponent } from 'src/app/core/cmsComponent/addBaseComponent';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-core-sitecategory-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class CoreLocationAddComponent extends AddBaseComponent<CoreLocationService, CoreLocationModel, number> implements OnInit {
  requestId = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CoreLocationAddComponent>,
    public coreEnumService: CoreEnumService,
    public coreLocationService: CoreLocationService,
    private cmsToastrService: CmsToastrService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {
    super(coreLocationService, new CoreLocationModel, publicHelper);
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    if (data) {
      this.requestId = +data.id || 0;
    }
    if (this.requestId > 0) {
      this.dataModel.linkParentId = this.requestId;
    }
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];

  fileManagerTree: TreeModel;
  appLanguage = 'fa';

  dataModelResult: ErrorExceptionResult<CoreLocationModel> = new ErrorExceptionResult<CoreLocationModel>();
  dataModel: CoreLocationModel = new CoreLocationModel();


  formInfo: FormInfoModel = new FormInfoModel();

  dataModelEnumLocationTypeResult: ErrorExceptionResult<InfoEnumModel> = new ErrorExceptionResult<InfoEnumModel>();

  fileManagerOpenForm = false;




  ngOnInit(): void {

    this.formInfo.formTitle = this.translate.instant('TITLE.ADD');

    this.getEnumLocationType();
    this.DataGetAccess();

  }
  getEnumLocationType(): void {
    this.coreEnumService.ServiceLocationTypeEnum().subscribe((next) => {
      this.dataModelEnumLocationTypeResult = next;
    });
  }



  // DataGetAccess(): void {
  //   const pName = this.constructor.name + 'DataGetAccess';
  //   this.loading.Start(pName);

  //   this.coreLocationService
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

    this.coreLocationService.ServiceAdd(this.dataModel).subscribe({
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
  onActionParentSelect(model: CoreLocationModel): void {
    this.dataModel.linkParentId = null;
    if (model && model.id > 0) {
      this.dataModel.linkParentId = model.id;
    }
  }
  onActionFileSelected(model: NodeInterface): void {
    this.dataModel.linkImageId = model.id;
    this.dataModel.linkImageIdSrc = model.downloadLinksrc;
  }
}
