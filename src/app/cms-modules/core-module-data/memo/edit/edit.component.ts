
import {
  ChangeDetectorRef, Component, Inject,
  OnDestroy, OnInit,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  CoreEnumService, CoreModuleDataMemoModel, CoreModuleDataMemoService,
  ErrorExceptionResultBase,
  FormInfoModel, ManageUserAccessDataTypesEnum
} from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { EditBaseComponent } from 'src/app/core/cmsComponent/editBaseComponent';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-coremodule-data-memo-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class CoreModuleDataMemoEditComponent extends EditBaseComponent<CoreModuleDataMemoService, CoreModuleDataMemoModel, string>
  implements OnInit, OnDestroy {
  requestId = '';
  constructorInfoAreaId = this.constructor.name;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CoreModuleDataMemoEditComponent>,
    public coreEnumService: CoreEnumService,
    public coreModuleDataMemoService: CoreModuleDataMemoService,
    private cmsToastrService: CmsToastrService,
    private tokenHelper: TokenHelper,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
    public translate: TranslateService,
  ) {
    super(coreModuleDataMemoService, new CoreModuleDataMemoModel(), publicHelper, translate);

    this.publicHelper.processService.cdr = this.cdr;

    if (data) {
      this.requestId = data.id;
    }
  }




  dataModelResult: ErrorExceptionResultBase = new ErrorExceptionResultBase();
  dataModel: CoreModuleDataMemoModel = new CoreModuleDataMemoModel();
  @ViewChild('vform', { static: false }) formGroup: FormGroup;

  formInfo: FormInfoModel = new FormInfoModel();



  fileManagerOpenForm = false;

  cmsApiStoreSubscribe: Subscription;

  ngOnInit(): void {
    if (this.requestId && this.requestId.length > 0) {
      this.translate.get('TITLE.Edit').subscribe((str: string) => { this.formInfo.formTitle = str; });
      this.DataGetOneContent();
    } else {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
    });

    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe({
      next: (ret) => {
        this.tokenInfo = ret;
      }
    });
  }



  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }


  DataGetOneContent(): void {
    if (!this.requestId || this.requestId.length === 0) {
      this.cmsToastrService.typeErrorEditRowIsNull();
      return;
    }

    this.translate.get('MESSAGE.Receiving_Information_From_The_Server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructor.name);
    });

    /*َAccess Field*/
    this.coreModuleDataMemoService.setAccessLoad();
    this.coreModuleDataMemoService.setAccessDataType(ManageUserAccessDataTypesEnum.Editor);
    this.coreModuleDataMemoService.ServiceGetOneById(this.requestId).subscribe({
      next: (ret) => {
        /*َAccess Field*/
        // this.dataAccessModel = next.Access;
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
        this.dataModel = ret.item;
        if (ret.isSuccess) {
          this.formInfo.formTitle = this.formInfo.formTitle + ' ' + ret.item.id;
          this.formInfo.formAlert = '';
        } else {
          this.translate.get('ERRORMESSAGE.MESSAGE.typeError').subscribe((str: string) => { this.formInfo.formAlert = str; });
          this.formInfo.formError = ret.errorMessage;
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.publicHelper.processService.processStop(pName);

      },
      error: (er) => {
        this.cmsToastrService.typeError(er);
        this.publicHelper.processService.processStop(pName, false);
      }
    }
    );
  }

  DataEditContent(): void {
    this.translate.get('MESSAGE.sending_information_to_the_server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.sending_information_to_the_server').subscribe((str: string) => { this.publicHelper.processService.processStart(pName, str, this.constructor.name); });

    this.coreModuleDataMemoService.ServiceEdit(this.dataModel).subscribe({
      next: (ret) => {
        this.dataModelResult = ret;
        if (ret.isSuccess) {
          this.translate.get('MESSAGE.registration_completed_successfully').subscribe((str: string) => { this.formInfo.formAlert = str; });
          this.cmsToastrService.typeSuccessEdit();
          this.dialogRef.close({ dialogChangedDate: true });
        } else {
          this.translate.get('ERRORMESSAGE.MESSAGE.typeError').subscribe((str: string) => { this.formInfo.formAlert = str; });
          this.formInfo.formError = ret.errorMessage;
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.publicHelper.processService.processStop(pName);

        this.formInfo.formSubmitAllow = true;
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
    this.DataEditContent();
  }

  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}
