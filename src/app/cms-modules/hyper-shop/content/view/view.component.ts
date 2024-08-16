
import {
  ChangeDetectorRef, Component, Inject,
  OnDestroy, OnInit,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  CoreEnumService, DataFieldInfoModel, ErrorExceptionResult,
  FormInfoModel, HyperShopContentModel, HyperShopContentService, TokenInfoModel
} from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-application-memberinfo-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class HyperShopContentViewComponent implements OnInit, OnDestroy {
  requestId = '';
  constructorInfoAreaId = this.constructor.name;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<HyperShopContentViewComponent>,
    public coreEnumService: CoreEnumService,
    public hyperShopContentService: HyperShopContentService,
    private cmsToastrService: CmsToastrService,
    private tokenHelper: TokenHelper,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
    public translate: TranslateService,
  ) {
    this.publicHelper.processService.cdr = this.cdr;
    if (data) {
      this.requestId = data.id + '';
    }
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  tokenInfo = new TokenInfoModel();

  dataModelResult: ErrorExceptionResult<HyperShopContentModel> = new ErrorExceptionResult<HyperShopContentModel>();
  formInfo: FormInfoModel = new FormInfoModel();
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  fileManagerOpenForm = false;

  cmsApiStoreSubscribe: Subscription;

  ngOnInit(): void {
    this.formInfo.formTitle = this.translate.instant('TITLE.VIEW');
    if (!this.requestId || this.requestId.length === 0) {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }
    this.DataGetOneContent();
    this.tokenHelper.getTokenInfoState().then((value) => {
      this.tokenInfo = value;
    });

    this.cmsApiStoreSubscribe = this.tokenHelper.getTokenInfoStateOnChange().subscribe({
      next: (ret) => {
        this.tokenInfo = ret;
      }
    });
  }

  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }


  DataGetOneContent(): void {
    this.translate.get('MESSAGE.Receiving_Information_From_The_Server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });

    /*َAccess Field*/
    this.hyperShopContentService.setAccessLoad();

    this.hyperShopContentService.ServiceGetOneById(this.requestId).subscribe({
      next: (ret) => {
        /*َAccess Field*/
        // this.dataAccessModel = next.access;
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
        this.dataModelResult = ret;
        if (ret.isSuccess) {
          this.formInfo.formTitle = this.formInfo.formTitle + ' ' + ret.item.code + ' # ' + ret.item.name;
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

  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}
