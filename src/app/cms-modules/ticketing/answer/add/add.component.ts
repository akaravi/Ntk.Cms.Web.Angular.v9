import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  AccessModel, ApplicationSourceModel, CoreEnumService,
  DataFieldInfoModel, ErrorExceptionResult,
  FormInfoModel, InfoEnumModel, TicketingAnswerModel,
  TicketingAnswerService
} from 'ntk-cms-api';
import { TreeModel } from 'ntk-cms-filemanager';
import { AddBaseComponent } from 'src/app/core/cmsComponent/addBaseComponent';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { PoinModel } from 'src/app/core/models/pointModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-ticketing-answer-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class TicketingAnswerAddComponent extends AddBaseComponent<TicketingAnswerService, TicketingAnswerModel, number> implements OnInit {
  requestLinkTaskId = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<TicketingAnswerAddComponent>,
    private activatedRoute: ActivatedRoute,
    public publicHelper: PublicHelper,
    public coreEnumService: CoreEnumService,
    private ticketingAnswerService: TicketingAnswerService,
    private cmsToastrService: CmsToastrService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {
    super(ticketingAnswerService, new TicketingAnswerModel(), publicHelper);
    this.loading.cdr = this.cdr; this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
    if (data) {
      this.requestLinkTaskId = +data.linkTaskId || 0;
    }

  }


  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  formInfo: FormInfoModel = new FormInfoModel();
  dataAccessModel: AccessModel;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  dataModel = new TicketingAnswerModel();
  dataModelResult: ErrorExceptionResult<TicketingAnswerModel> = new ErrorExceptionResult<TicketingAnswerModel>();


  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  fileManagerOpenForm = false;
  appLanguage = 'fa';

  fileManagerTree: TreeModel;
  mapMarker: any;
  mapOptonCenter = new PoinModel();

  ngOnInit(): void {
    // this.requestLinkTaskId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkTaskId'));
    if (this.requestLinkTaskId === 0) {
      this.cmsToastrService.typeErrorAddRowParentIsNull();
      return;
    }
    this.dataModel.linkTaskId = this.requestLinkTaskId;
    this.DataGetAccess();

  }

  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      this.cmsToastrService.typeErrorFormInvalid();
      return;
    }

    this.DataAddContent();
  }

  // DataGetAccess(): void {
  //   const pName = this.constructor.name + 'DataGetAccess';
  //   this.loading.Start(pName);

  //   this.ticketingAnswerService
  //     .ServiceViewModel()
  //     .subscribe(
  //       async (next) => {
  //         if (next.isSuccess) {
  //           this.dataAccessModel = next.access;
  //           this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.access);
  //         } else {
  //           this.cmsToastrService.typeErrorGetAccess(next.errorMessage);
  //         }
  //         this.loading.Stop(pName);
  //       },
  //       (error) => {
  //         this.cmsToastrService.typeErrorGetAccess(error);
  //         this.loading.Stop(pName);
  //       }
  //     );
  // }

  DataAddContent(): void {
    this.formInfo.formSubmitAllow = false;
    this.formInfo.formAlert = this.translate.instant('MESSAGE.sending_information_to_the_server');
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);


    this.ticketingAnswerService.ServiceAdd(this.dataModel).subscribe(async (next) => {
      this.formInfo.formSubmitAllow = !next.isSuccess;
      this.dataModelResult = next;
      if (next.isSuccess) {
        this.formInfo.formAlert = this.translate.instant('MESSAGE.registration_completed_successfully');
        this.cmsToastrService.typeSuccessAdd();
        setTimeout(() => { this.dialogRef.close({ dialogChangedDate: true }); }, 1000);
      } else {
        this.cmsToastrService.typeErrorAdd(next.errorMessage);
      }
      this.loading.Stop(pName);

    },
      (error) => {
        this.loading.Stop(pName);

        this.formInfo.formSubmitAllow = true;
        this.cmsToastrService.typeErrorAdd(error);
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
    this.dataModel.linkTicketingDepartemenId = model.id;
  }

}
