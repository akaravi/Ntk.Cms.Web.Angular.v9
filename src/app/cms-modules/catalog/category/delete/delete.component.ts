
import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  CatalogCategoryModel,
  CatalogCategoryService,
  DataFieldInfoModel, ErrorExceptionResult,
  FilterModel,
  FormInfoModel, ManageUserAccessDataTypesEnum
} from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';


@Component({
  selector: 'app-catalog-category-delete',
  templateUrl: './delete.component.html',
})
export class CatalogCategoryDeleteComponent implements OnInit {
  requestId = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CatalogCategoryDeleteComponent>,
    private publicHelper: PublicHelper,
    private categoryService: CatalogCategoryService,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
    private cmsToastrService: CmsToastrService
  ) {
    this.publicHelper.processService.cdr = this.cdr;
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => { this.loading.message = str; });
    if (data) {
      this.requestId = data.id || '';
    }
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  loading = new ProgressSpinnerModel();
  dataModelResultCategory: ErrorExceptionResult<CatalogCategoryModel> = new ErrorExceptionResult<CatalogCategoryModel>();
  dataModelResultCategoryAllData: ErrorExceptionResult<CatalogCategoryModel> = new ErrorExceptionResult<CatalogCategoryModel>();
  dataModel: any = {};
  formInfo: FormInfoModel = new FormInfoModel();
  ngOnInit(): void {

    if (this.requestId === '') {
      this.cmsToastrService.typeErrorDeleteRowIsNull();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }
    this.DataGetOne();
    this.DataGetAll();
  }

  DataGetOne(): void {
    if (this.requestId === '') {
      this.cmsToastrService.typeErrorDeleteRowIsNull();
      return;
    }
    this.translate.get('TITLE.Loading_Information').subscribe((str: string) => { this.formInfo.formAlert = str; });
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructor.name);
    });

    this.categoryService.setAccessLoad();
    this.categoryService.setAccessDataType(ManageUserAccessDataTypesEnum.Editor);
    this.categoryService
      .ServiceGetOneById(this.requestId)
      .subscribe({
        next: (ret) => {
          this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
          this.dataModelResultCategory = ret;
          if (!ret.isSuccess) {
            this.translate.get('ERRORMESSAGE.MESSAGE.typeError').subscribe((str: string) => { this.formInfo.formAlert = str; });
            this.formInfo.formError = ret.errorMessage;
            this.formInfo.formErrorStatus = true;
            this.cmsToastrService.typeErrorGetOne();
          } else {
            this.formInfo.formAlert = '';
          }
          this.publicHelper.processService.processStop(pName);
        },
        error: (er) => {
          this.translate.get('ERRORMESSAGE.MESSAGE.typeError').subscribe((str: string) => { this.formInfo.formAlert = str; });
          this.formInfo.formErrorStatus = true;
          this.cmsToastrService.typeError(er);
          this.publicHelper.processService.processStop(pName, false);
        }
      }
      );

  }
  DataGetAll(): void {
    this.translate.get('TITLE.Loading_Information').subscribe((str: string) => { this.formInfo.formAlert = str; });
    const filterModel: FilterModel = new FilterModel();
    filterModel.rowPerPage = 100;
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructor.name);
    });

    this.categoryService
      .ServiceGetAll(filterModel)
      .subscribe({
        next: (ret) => {
          this.dataModelResultCategoryAllData = ret;
          if (!ret.isSuccess) {
            this.translate.get('ERRORMESSAGE.MESSAGE.typeError').subscribe((str: string) => { this.formInfo.formAlert = str; });
            this.formInfo.formError = ret.errorMessage;
            this.formInfo.formErrorStatus = true;
            this.cmsToastrService.typeErrorGetAll();
          } else {
            this.formInfo.formAlert = '';
          }
          this.publicHelper.processService.processStop(pName);
        },
        error: (er) => {
          this.translate.get('ERRORMESSAGE.MESSAGE.typeError').subscribe((str: string) => { this.formInfo.formAlert = str; });
          this.formInfo.formErrorStatus = true;
          this.cmsToastrService.typeError(er);
          this.publicHelper.processService.processStop(pName, false);
        }
      }
      );

  }
  onFormMove(): void {
    if (!this.requestId || this.requestId.length === 0) {
      this.cmsToastrService.typeErrorDeleteRowIsNull();
      return;
    }
    if (!this.formGroup.valid) {
      return;
    }
    this.formInfo.formSubmitAllow = true;
    if (this.dataModel.newCatId === this.requestId) {
      this.translate.get('ERRORMESSAGE.MESSAGE.typeError').subscribe((str: string) => { this.formInfo.formAlert = str; });
      this.formInfo.formError =
        this.translate.instant('ERRORMESSAGE.MESSAGE.The_delete_category_ID_is_the_same_as_the_alternate_category');
      this.formInfo.buttonSubmittedEnabled = true;
    }

    this.formInfo.buttonSubmittedEnabled = false;
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructor.name);
    });

    this.categoryService
      .ServiceMove(this.requestId, this.dataModel.newCatId)
      .subscribe({
        next: (ret) => {
          if (!ret.isSuccess) {
            this.translate.get('ERRORMESSAGE.MESSAGE.typeError').subscribe((str: string) => { this.formInfo.formAlert = str; });
            this.formInfo.formError = ret.errorMessage;
            this.cmsToastrService.typeErrorMove();
          } else {
            this.translate.get('MESSAGE.The_Transfer_Was_Successful').subscribe((str: string) => { this.formInfo.formAlert = str; });
            this.cmsToastrService.typeSuccessMove();
          }
          this.formInfo.formSubmitAllow = true;
          this.formInfo.buttonSubmittedEnabled = true;
          this.publicHelper.processService.processStop(pName);

        },
        error: (er) => {
          this.translate.get('ERRORMESSAGE.MESSAGE.typeError').subscribe((str: string) => { this.formInfo.formAlert = str; });
          this.cmsToastrService.typeError(er);
          this.formInfo.buttonSubmittedEnabled = true;
          this.formInfo.formSubmitAllow = true;
          this.publicHelper.processService.processStop(pName);
        }
      }
      );
  }
  onFormDelete(): void {
    if (!this.requestId || this.requestId.length === 0) {
      this.cmsToastrService.typeErrorDeleteRowIsNull();
      return;
    }

    this.formInfo.formSubmitAllow = false;
    this.formInfo.buttonSubmittedEnabled = false;
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructor.name);
    });

    this.categoryService
      .ServiceDelete(this.requestId)
      .subscribe({
        next: (ret) => {
          this.formInfo.formSubmitAllow = !ret.isSuccess;
          if (!ret.isSuccess) {
            this.translate.get('ERRORMESSAGE.MESSAGE.typeError').subscribe((str: string) => { this.formInfo.formAlert = str; });
            this.formInfo.formError = ret.errorMessage;
            this.cmsToastrService.typeErrorRemove();
          } else {
            this.translate.get('MESSAGE.Deletion_Was_Successful').subscribe((str: string) => { this.formInfo.formAlert = str; });
            this.cmsToastrService.typeSuccessRemove();
            this.dialogRef.close({ dialogChangedDate: true });
          }
          this.formInfo.buttonSubmittedEnabled = true;
          this.publicHelper.processService.processStop(pName);

        },
        error: (er) => {
          this.translate.get('ERRORMESSAGE.MESSAGE.typeError').subscribe((str: string) => { this.formInfo.formAlert = str; });
          this.formInfo.formSubmitAllow = true;
          this.cmsToastrService.typeError(er);
          this.formInfo.buttonSubmittedEnabled = true;
          this.publicHelper.processService.processStop(pName);
        }
      }
      );

  }
  onFormChangeNewCatId(model: CatalogCategoryModel): void {
    this.formInfo.formAlert = '';
    if (!this.requestId || this.requestId.length === 0 || !model || !model.id || model.id.length <= 0) {
      this.cmsToastrService.typeErrorDeleteRowIsNull();
      return;
    }
    this.dataModel.newCatId = model.id;
    if (this.dataModel.newCatId === this.requestId) {
      this.translate.get('ERRORMESSAGE.MESSAGE.typeError').subscribe((str: string) => { this.formInfo.formAlert = str; });
      this.formInfo.formError =
        this.translate.instant('ERRORMESSAGE.MESSAGE.The_delete_category_ID_is_the_same_as_the_alternate_category');
      this.formInfo.buttonSubmittedEnabled = false;
    } else {
      this.formInfo.buttonSubmittedEnabled = true;
      this.formInfo.formError = '';
    }
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });

  }
}
