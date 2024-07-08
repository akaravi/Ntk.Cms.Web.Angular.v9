import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CoreModuleDataTaskDtoModel, CoreModuleDataTaskModel, ErrorExceptionResult, ErrorExceptionResultBase, FormInfoModel, IApiCmsServerBase } from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';


@Component({
  selector: 'app-cms-data-task',
  templateUrl: './cms-data-task.component.html',
  styleUrls: ['./cms-data-task.component.scss']
})
export class CmsDataTaskComponent implements OnInit {
  static nextId = 0;
  id = ++CmsDataTaskComponent.nextId;
  service: IApiCmsServerBase;
  constructor(private cmsToastrService: CmsToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CmsDataTaskComponent>,
    public http: HttpClient,
    public publicHelper: PublicHelper,
    public translate: TranslateService,
    private cdr: ChangeDetectorRef,
    public tokenHelper: TokenHelper,
  ) {
    this.publicHelper.processService.cdr = this.cdr;
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => { this.loading.message = str; });
    if (data) {
      this.service = data.service;
      this.dataModel.moduleEntityId = data.id;
      this.dataModel.subjectTitle = data.title;
    }

    if (!this.service)
      this.dialogRef.close({ dialogChangedDate: true });

  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;

  showFormAdd = true;

  loading = new ProgressSpinnerModel();

  dataModelResult: ErrorExceptionResult<CoreModuleDataTaskModel> = new ErrorExceptionResult<CoreModuleDataTaskModel>();
  dataModelResultBase: ErrorExceptionResultBase = new ErrorExceptionResultBase();
  dataModel: CoreModuleDataTaskDtoModel = new CoreModuleDataTaskDtoModel();
  formInfo: FormInfoModel = new FormInfoModel();


  ngOnInit(): void {
    this.tokenHelper.getCurrentToken().then((value) => {

    });

    this.DataGetAll();
  }

  DataGetAll(): void {
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.get_information_list').subscribe((str: string) => { this.publicHelper.processService.processStart(pName, str); });

    /*filter CLone*/
    if (this.dataModel.moduleEntityId && this.dataModel.moduleEntityId.length > 0) {
      this.service.ServiceTaskGetAllEntity(this.dataModel.moduleEntityId).subscribe({
        next: (ret) => {
          this.dataModelResult = ret;
          if (ret.listItems?.length > 0)
            this.showFormAdd = false;
          if (!ret.isSuccess) {
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
    else {
      this.service.ServiceTaskGetAll().subscribe({
        next: (ret) => {
          this.dataModelResult = ret;
          if (ret.listItems?.length > 0)
            this.showFormAdd = false;
          if (!ret.isSuccess)
            this.cmsToastrService.typeErrorMessage(ret.errorMessage);

          this.publicHelper.processService.processStop(pName);
        },
        error: (er) => {
          this.cmsToastrService.typeError(er);
          this.publicHelper.processService.processStop(pName, false);
        }
      }
      );
    }
  }

  DataAddContent(): void {
    this.translate.get('MESSAGE.sending_information_to_the_server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructor.name);
    });

    this.service.ServiceTaskAdd(this.dataModel).subscribe({
      next: (ret) => {
        this.formInfo.formSubmitAllow = true;
        // this.dataModelResultBase = ret;
        if (ret.isSuccess) {
          this.translate.get('MESSAGE.registration_completed_successfully').subscribe((str: string) => { this.formInfo.formAlert = str; });
          this.cmsToastrService.typeSuccessAdd();
          this.DataGetAll();

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
  DataDeleteContent(id: string): void {
    this.translate.get('MESSAGE.sending_information_to_the_server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructor.name);
    });

    this.service.ServiceTaskDelete(id).subscribe({
      next: (ret) => {
        this.formInfo.formSubmitAllow = true;
        // this.dataModelResultBase = ret;
        if (ret.isSuccess) {
          this.translate.get('MESSAGE.registration_completed_successfully').subscribe((str: string) => { this.formInfo.formAlert = str; });
          this.cmsToastrService.typeSuccessRemove();
          this.DataGetAll();
          //this.dialogRef.close({ dialogChangedDate: true });

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

  onActionAdd() {
    this.showFormAdd = !this.showFormAdd
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });

  }

}
