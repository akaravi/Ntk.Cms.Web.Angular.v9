import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  CoreEnumService,
  ErrorExceptionResultBase,
  FormInfoModel,
  ManageUserAccessDataTypesEnum, TicketingDepartemenLogModel,
  TicketingDepartemenLogService
} from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { EditBaseComponent } from 'src/app/core/cmsComponent/editBaseComponent';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';


@Component({
  selector: 'app-ticketing-departemenlog-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class TicketingDepartemenLogEditComponent extends EditBaseComponent<TicketingDepartemenLogService, TicketingDepartemenLogModel, number>
  implements OnInit, OnDestroy {
  requestId = 0;
  constructorInfoAreaId = this.constructor.name;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<TicketingDepartemenLogEditComponent>,
    public coreEnumService: CoreEnumService,
    public ticketingDepartemenLogService: TicketingDepartemenLogService,
    private cmsToastrService: CmsToastrService,
    private tokenHelper: TokenHelper,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
    public translate: TranslateService,
  ) {
    super(ticketingDepartemenLogService, new TicketingDepartemenLogModel(), publicHelper, translate);

    this.publicHelper.processService.cdr = this.cdr;
    if (data) {
      this.requestId = data.id;
    }
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;




  dataModelResult: ErrorExceptionResultBase = new ErrorExceptionResultBase();
  dataModel: TicketingDepartemenLogModel = new TicketingDepartemenLogModel();
  formInfo: FormInfoModel = new FormInfoModel();

  fileManagerOpenForm = false;

  cmsApiStoreSubscribe: Subscription;

  ngOnInit(): void {
    this.translate.get('TITLE.Edit').subscribe((str: string) => { this.formInfo.formTitle = str; });
    if (!this.requestId || this.requestId <= 0) {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }
    this.DataGetOneContent();
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
    this.translate.get('MESSAGE.Receiving_Information_From_The_Server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructor.name);
    });

    this.ticketingDepartemenLogService.setAccessLoad();
    this.ticketingDepartemenLogService.setAccessDataType(ManageUserAccessDataTypesEnum.Editor);
    this.ticketingDepartemenLogService.ServiceGetOneById(this.requestId).subscribe({
      next: (ret) => {
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
      error: (err) => {
        this.cmsToastrService.typeError(err);
        this.publicHelper.processService.processStop(pName);
      }
    }
    );
  }


  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}
