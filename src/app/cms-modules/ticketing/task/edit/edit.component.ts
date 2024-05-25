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

    this.loading.cdr = this.cdr; this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
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
    this.formInfo.formAlert = this.translate.instant('MESSAGE.get_information_from_the_server');
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    /*َAccess Field*/
    this.ticketingTaskService.setAccessLoad();
    this.ticketingTaskService.setAccessDataType(ManageUserAccessDataTypesEnum.Editor);
    this.ticketingTaskService
      .ServiceGetOneById(requestId)
      .subscribe(
        async (next) => {
          /*َAccess Field*/
          this.dataAccessModel = next.access;
          this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.access);

          this.loading.Stop(pName);

          this.dataModelResult = next;
          this.formInfo.formSubmitAllow = true;

          if (next.isSuccess) {
            this.dataModel = next.item;
            /** */
            this.ticketingTaskService.ServiceTaskReaded(requestId).subscribe(
              async (next) => {

              },
              (error) => {
                this.cmsToastrService.typeErrorGetOne(error);
              }

            );
            /** */
          } else {
            this.cmsToastrService.typeErrorGetOne(next.errorMessage);
          }
        },
        (error) => {
          this.loading.Stop(pName);

          this.formInfo.formSubmitAllow = true;
          this.cmsToastrService.typeErrorGetOne(error);
        }
      );
  }
  DataEditContent(): void {
    this.formInfo.formSubmitAllow = false;
    this.formInfo.formAlert = this.translate.instant('MESSAGE.sending_information_to_the_server');
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName, this.translate.instant('MESSAGE.sending_information_to_the_server'));


    this.ticketingTaskService
      .ServiceEdit(this.dataModel)
      .subscribe(
        async (next) => {

          this.formInfo.formSubmitAllow = !next.isSuccess;
          this.dataModelResult = next;
          if (next.isSuccess) {
            this.formInfo.formAlert = this.translate.instant('MESSAGE.registration_completed_successfully');
            this.cmsToastrService.typeSuccessEdit();
            setTimeout(() => {
              this.dialogRef.close({ dialogChangedDate: true });
            }
              , 1000);
          } else {
            this.cmsToastrService.typeErrorEdit(next.errorMessage);
          }
          this.loading.Stop(pName);

        },
        (error) => {
          this.loading.Stop(pName);

          this.formInfo.formSubmitAllow = true;
          this.cmsToastrService.typeErrorEdit(error);
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
