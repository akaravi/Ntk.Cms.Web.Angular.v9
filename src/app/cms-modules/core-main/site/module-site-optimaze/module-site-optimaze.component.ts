
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import {
  ChangeDetectorRef, Component, Inject, OnInit,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { TranslateService } from '@ngx-translate/core';
import {
  CoreEnumService, CoreSiteService, ErrorExceptionResult,
  FormInfoModel, ProcessModuleSiteDataOptimazeOutputModel
} from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';


@Component({
  selector: 'app-core-site-module-site-optimaze',
  templateUrl: './module-site-optimaze.component.html',
  styleUrls: ['./module-site-optimaze.component.scss'],
})
export class CoreSiteModuleSiteOptimazeComponent implements OnInit {
  requestLinkSiteId = 0;
  constructorInfoAreaId = this.constructor.name;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CoreSiteModuleSiteOptimazeComponent>,
    public coreEnumService: CoreEnumService,
    public coreSiteService: CoreSiteService,
    private cmsToastrService: CmsToastrService,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
    public translate: TranslateService,
  ) {
    this.publicHelper.processService.cdr = this.cdr;

    if (data) {
      this.requestLinkSiteId = +data.linkSiteId || 0;
    }
  }


  dataModelResult: ErrorExceptionResult<ProcessModuleSiteDataOptimazeOutputModel> = new ErrorExceptionResult<ProcessModuleSiteDataOptimazeOutputModel>();
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  formInfo: FormInfoModel = new FormInfoModel();

  ngOnInit(): void {
    if (this.requestLinkSiteId <= 0) {
      this.cmsToastrService.typeErrorDeleteRowIsNull();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }
    this.formInfo.formTitle = this.translate.instant('TITLE.VIEW_RESULT');
    this.DataGetAll();
  }
  DataGetAll(): void {
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructor.name);
    });

    this.coreSiteService.ServiceModuleDataOptimaze(this.requestLinkSiteId).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.dataModelResult = ret;
        } else {
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
  onStepClick(event: StepperSelectionEvent, stepper: MatStepper): void {
    if (event.previouslySelectedIndex < event.selectedIndex) {
      if (!this.formGroup.valid) {
        this.cmsToastrService.typeErrorFormInvalid();
        setTimeout(() => {
          stepper.selectedIndex = event.previouslySelectedIndex;
          // stepper.previous();
        }, 10);
      }
    }
  }
}
