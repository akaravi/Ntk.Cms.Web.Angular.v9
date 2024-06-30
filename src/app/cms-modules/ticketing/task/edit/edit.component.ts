import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  AccessModel, ApplicationSourceModel, CoreEnumService,
  ErrorExceptionResultBase,
  FormInfoModel,
  ManageUserAccessDataTypesEnum, TicketingTaskModel,
  TicketingTaskService
} from 'ntk-cms-api';
import { TreeModel } from 'ntk-cms-filemanager';
import { EditBaseComponent } from 'src/app/core/cmsComponent/editBaseComponent';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { PoinModel } from 'src/app/core/models/pointModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';


@Component({
  selector: 'app-ticketing-task-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class TicketingTaskEditComponent extends EditBaseComponent<TicketingTaskService, TicketingTaskModel, number>
  implements OnInit {
  requestId = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private activatedRoute: ActivatedRoute,
    private dialogRef: MatDialogRef<TicketingTaskEditComponent>,
    public publicHelper: PublicHelper,
    public coreEnumService: CoreEnumService,
    private ticketingTaskService: TicketingTaskService,
    private cmsToastrService: CmsToastrService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {
    super(ticketingTaskService, new TicketingTaskModel(), publicHelper);

    this.publicHelper.processService.cdr = this.cdr; this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => { this.loading.message = str; });
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
    if (data) {
      this.requestId = + data.id || 0;
    }
    // if (this.requestId == 0) {
    //   this.requestId = + Number(this.activatedRoute.snapshot.paramMap.get('Id'));
    // }
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;



  formInfo: FormInfoModel = new FormInfoModel();
  dataAccessModel: AccessModel;
  dataModel = new TicketingTaskModel();
  dataModelResult: ErrorExceptionResultBase = new ErrorExceptionResultBase();


  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  fileManagerOpenForm = false;
  appLanguage = 'fa';

  fileManagerTree: TreeModel;
  mapMarker: any;
  mapOptonCenter = new PoinModel();

  ngOnInit(): void {

    if (this.requestId === 0) {
      this.cmsToastrService.typeErrorAddRowParentIsNull();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }
    this.DataGetOne(this.requestId);

  }


  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      this.cmsToastrService.typeErrorFormInvalid();
      return;
    }

    this.DataEditContent();
  }

  DataGetOne(requestId: number): void {
    this.formInfo.formSubmitAllow = false;
    this.translate.get('MESSAGE.get_information_from_the_server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.publicHelper.processService.processStart(pName);

    /*َAccess Field*/
    this.ticketingTaskService.setAccessLoad();
    this.ticketingTaskService.setAccessDataType(ManageUserAccessDataTypesEnum.Editor);
    this.ticketingTaskService
      .ServiceGetOneById(requestId)
      .subscribe({
        next: (ret) => {
          /*َAccess Field*/
          this.dataAccessModel = ret.access;
          this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);

          this.publicHelper.processService.processStop(pName);

          this.dataModelResult = ret;
          this.formInfo.formSubmitAllow = true;

          if (ret.isSuccess) {
            this.dataModel = ret.item;
            /** */
            this.ticketingTaskService.ServiceTaskReaded(requestId).subscribe({
              next: (ret2) => {

              },
              error: (err2) => {
                this.cmsToastrService.typeErrorGetOne(err2);
              }
            }

            );
            /** */
          } else {
            this.cmsToastrService.typeErrorGetOne(ret.errorMessage);
          }
        },
        error: (err) => {
          this.publicHelper.processService.processStop(pName);

          this.formInfo.formSubmitAllow = true;
          this.cmsToastrService.typeErrorGetOne(err);
        }
      }
      );
  }
  DataEditContent(): void {
    this.formInfo.formSubmitAllow = false;
    this.translate.get('MESSAGE.sending_information_to_the_server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.sending_information_to_the_server').subscribe((str: string) => { this.publicHelper.processService.processStart(pName, str); });


    this.ticketingTaskService
      .ServiceEdit(this.dataModel)
      .subscribe({
        next: (ret) => {

          this.formInfo.formSubmitAllow = !ret.isSuccess;
          this.dataModelResult = ret;
          if (ret.isSuccess) {
            this.translate.get('MESSAGE.registration_completed_successfully').subscribe((str: string) => { this.formInfo.formAlert = str; });
            this.cmsToastrService.typeSuccessEdit();
            setTimeout(() => {
              this.dialogRef.close({ dialogChangedDate: true });
            }
              , 1000);
          } else {
            this.cmsToastrService.typeErrorEdit(ret.errorMessage);
          }
          this.publicHelper.processService.processStop(pName);

        },
        error: (err) => {
          this.publicHelper.processService.processStop(pName);

          this.formInfo.formSubmitAllow = true;
          this.cmsToastrService.typeErrorEdit(err);
        }
      }
      );
  }

  onStepClick(event: StepperSelectionEvent, stepper: any): void {
    if (event.previouslySelectedIndex < event.selectedIndex) {
      // if (!this.formGroup.valid) {
      //   this.cmsToastrService.typeErrorFormInvalid();
      //   setTimeout(() => {
      //     stepper.selectedIndex = event.previouslySelectedIndex;
      //     // stepper.previous();
      //   }, 10);
      // }
    }
  }

  onActionBackToParent(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
  onActionFileSelectedLinkMainImageId(): void {
    // this.dataModel.linkMainImageId = model.id;
    // this.dataModel.linkMainImageIdSrc = model.downloadLinksrc;
  }

  onActionSelectSource(model: ApplicationSourceModel | null): void {
    if (!model || model.id <= 0) {
      this.cmsToastrService.typeErrorMessage(
        this.translate.instant('MESSAGE.Specify_the_source'),
        this.translate.instant('MESSAGE.The_source_of_the_information_application_is_not_known')
      );
      return;
    }


  }

}
