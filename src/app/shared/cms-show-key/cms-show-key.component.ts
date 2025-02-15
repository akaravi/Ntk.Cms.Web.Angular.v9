import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CoreModuleLogShowKeyModel, CoreModuleShowKeyDtoModel, ErrorExceptionResult, ErrorExceptionResultBase, FormInfoModel, IApiCmsServerBase } from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';


@Component({
    selector: 'app-cms-show-key',
    templateUrl: './cms-show-key.component.html',
    styleUrls: ['./cms-show-key.component.scss'],
    standalone: false
})
export class CmsShowKeyComponent implements OnInit {
  static nextId = 0;
  id = ++CmsShowKeyComponent.nextId;
  requestService: IApiCmsServerBase;
  requestContentUrl = '';
  constructorInfoAreaId = this.constructor.name;
  constructor(private cmsToastrService: CmsToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CmsShowKeyComponent>,
    public http: HttpClient,
    public publicHelper: PublicHelper,
    public translate: TranslateService,
    private cdr: ChangeDetectorRef,
  ) {
    this.publicHelper.processService.cdr = this.cdr;

    if (data) {
      this.requestService = data.service;
      this.requestContentUrl = data.contentUrl;
      this.dataModel.moduleEntityId = data.id;
      this.dataModel.subjectTitle = data.title;
    }

    if (!this.requestService || !this.dataModel.moduleEntityId || this.dataModel.moduleEntityId.length == 0)
      this.dialogRef.close({ dialogChangedDate: true });

  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  showFormAdd = true;
  numbers: number[] = [5, 15, 30, 60, 120, 180, 600, 1200]

  dataModelResult: ErrorExceptionResult<CoreModuleLogShowKeyModel> = new ErrorExceptionResult<CoreModuleLogShowKeyModel>();
  dataModelResultBase: ErrorExceptionResultBase = new ErrorExceptionResultBase();
  dataModel: CoreModuleShowKeyDtoModel = new CoreModuleShowKeyDtoModel();

  ngOnInit(): void {
    this.DataGetAll();
    this.dataModel.minLive = 15;
  }

  formInfo: FormInfoModel = new FormInfoModel();
  DataGetAll(): void {
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.get_information_list').subscribe((str: string) => { this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId); });

    /*filter CLone*/
    this.requestService.ServiceShowKeyGetAll(this.dataModel.moduleEntityId).subscribe({
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

  DataAddContent(): void {
    this.translate.get('MESSAGE.sending_information_to_the_server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });

    this.requestService.ServiceShowKeyAdd(this.dataModel).subscribe({
      next: (ret) => {
        this.formInfo.formSubmitAllow = true;
        // this.dataModelResultBase = ret;
        if (ret.isSuccess) {
          this.translate.get('MESSAGE.registration_completed_successfully').subscribe((str: string) => { this.formInfo.formAlert = str; });
          this.cmsToastrService.typeSuccessAdd();
          this.DataGetAll()

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
