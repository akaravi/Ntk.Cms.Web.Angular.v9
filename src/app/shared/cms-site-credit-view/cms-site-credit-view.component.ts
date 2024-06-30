import {
  ChangeDetectorRef, Component, Inject, OnInit,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  CoreEnumService, CoreModuleModel, CoreModuleService, CoreModuleSiteCreditModel, CoreModuleSiteCreditService, DataFieldInfoModel, ErrorExceptionResult,
  FormInfoModel,
  TokenInfoModel
} from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-cms-site-credit-view',
  templateUrl: './cms-site-credit-view.component.html',
  styleUrls: ['./cms-site-credit-view.component.scss'],
})
export class CmsSiteCreditViewComponent implements OnInit {
  static nextId = 0;
  id = ++CmsSiteCreditViewComponent.nextId;
  requestLinkModuleId = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CmsSiteCreditViewComponent>,
    public publicHelper: PublicHelper,
    public coreEnumService: CoreEnumService,
    public coreModuleSiteCreditService: CoreModuleSiteCreditService,
    public coreModuleService: CoreModuleService,
    private cmsToastrService: CmsToastrService,
    private cdr: ChangeDetectorRef,
    private tokenHelper: TokenHelper,
    private router: Router,
    public translate: TranslateService,
  ) {

    this.publicHelper.processService.cdr = this.cdr; this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => { this.loading.message = str; });
    if (data) {
      this.requestLinkModuleId = +data.linkModuleId || 0;
    }
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();



  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<CoreModuleSiteCreditModel> = new ErrorExceptionResult<CoreModuleSiteCreditModel>();
  dataModuleModelResult: ErrorExceptionResult<CoreModuleModel> = new ErrorExceptionResult<CoreModuleModel>();
  tokenInfo = new TokenInfoModel();


  formInfo: FormInfoModel = new FormInfoModel();


  ngOnInit(): void {

    this.formInfo.formTitle = this.translate.instant('TITLE.Site_Validity');

    if (this.requestLinkModuleId <= 0) {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
    });
    this.DataGetOneContent();
    this.DataModuleGetOne();

  }


  DataGetOneContent(): void {
    this.translate.get('MESSAGE.Receiving_Information_From_The_Server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.publicHelper.processService.processStart(pName);

    this.coreModuleSiteCreditService.setAccessLoad();
    this.coreModuleSiteCreditService.ServiceGetCredit(this.requestLinkModuleId).subscribe(
      {
        next: (ret) => {
          this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);

          this.dataModelResult = ret;
          if (ret.isSuccess) {
            this.formInfo.formTitle = this.formInfo.formTitle + ' ' + ret.item.linkSiteId;
            this.formInfo.formAlert = '';
          } else {
            this.translate.get('ERRORMESSAGE.MESSAGE.typeError').subscribe((str: string) => { this.formInfo.formAlert = str; });
            this.formInfo.formError = ret.errorMessage;
            this.cmsToastrService.typeErrorMessage(ret.errorMessage);
          }
          this.publicHelper.processService.processStop(pName);

        },
        error: (err) => {
          this.cmsToastrService.typeError(err);
          this.publicHelper.processService.processStop(pName);

        }
      }
    );
  }


  DataModuleGetOne(): void {
    this.translate.get('MESSAGE.Receiving_Information_From_The_Server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.publicHelper.processService.processStart(pName);

    this.coreModuleService.setAccessLoad();
    this.coreModuleService.ServiceGetOneById(this.requestLinkModuleId).subscribe({
      next: (ret) => {
        this.dataModuleModelResult = ret;
        if (ret.isSuccess) {
          this.formInfo.formTitle = this.formInfo.formTitle + ' ' + ret.item.title;
          this.formInfo.formAlert = '';
        } else {
          this.translate.get('ERRORMESSAGE.MESSAGE.typeError').subscribe((str: string) => { this.formInfo.formAlert = str; });
          this.formInfo.formError = ret.errorMessage;
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.publicHelper.processService.processStop(pName);

      },
      error: (err) => {
        this.cmsToastrService.typeError(err);
        this.publicHelper.processService.processStop(pName);
      }
    }
    );
  }

  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    // this.formInfo.formSubmitAllow = false;
    // if (this.ComponentAction === ComponentActionEnum.add) {
    //   this.DataAddContent();
    // }
    // if (this.ComponentAction === ComponentActionEnum.edit) {
    //   this.DataEditContent();
    // }

  }
  onFormActionCreditCharge(): void {
    setTimeout(() => this.router.navigate(['/coremodule/site-credit-charge/', this.requestLinkModuleId]), 1000);
    this.dialogRef.close({ dialogChangedDate: false });
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}
