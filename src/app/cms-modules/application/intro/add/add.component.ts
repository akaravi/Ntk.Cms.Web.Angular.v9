
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  AccessModel, ApplicationAppModel, ApplicationEnumService,
  ApplicationIntroModel,
  ApplicationIntroService,
  CoreEnumService,
  DataFieldInfoModel, ErrorExceptionResult,
  FormInfoModel
} from 'ntk-cms-api';
import { NodeInterface, TreeModel } from 'ntk-cms-filemanager';
import { AddBaseComponent } from 'src/app/core/cmsComponent/addBaseComponent';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
@Component({
  selector: 'app-aplication-app-add',
  templateUrl: './add.component.html',
})
export class ApplicationIntroAddComponent extends AddBaseComponent<ApplicationIntroService, ApplicationIntroModel, number> implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    public coreEnumService: CoreEnumService,
    public applicationEnumService: ApplicationEnumService,
    private applicationIntroService: ApplicationIntroService,
    private cmsToastrService: CmsToastrService,
    public translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    public publicHelper: PublicHelper,) {
    super(applicationIntroService, new ApplicationIntroModel(), publicHelper);
    this.publicHelper.processService.cdr = this.cdr;
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => { this.loading.message = str; });
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
  }
  requestLinkApplicationId = 0;
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  formInfo: FormInfoModel = new FormInfoModel();
  dataAccessModel: AccessModel;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  dataModel = new ApplicationIntroModel();
  dataModelResult: ErrorExceptionResult<ApplicationIntroModel> = new ErrorExceptionResult<ApplicationIntroModel>();


  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  selectFileTypeMainVideo = ['mp4'];
  fileManagerOpenForm = false;
  fileManagerOpenFormVideo = false;
  appLanguage = 'fa';
  fileManagerTree: TreeModel;
  ngOnInit(): void {
    this.requestLinkApplicationId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkApplicationId'));
    if (this.requestLinkApplicationId === 0) {
      this.cmsToastrService.typeErrorAddRowParentIsNull();
      return;
    }
    this.dataModel.linkApplicationId = this.requestLinkApplicationId;
    this.DataGetAccess();

  }

  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      this.cmsToastrService.typeErrorFormInvalid();
      return;
    }
    if (this.dataModel.linkApplicationId <= 0) {
      this.cmsToastrService.typeErrorEdit(this.translate.instant('MESSAGE.Specify_the_application'));
      return;
    }
    this.DataAddContent();
  }

  DataAddContent(): void {
    this.formInfo.formSubmitAllow = false;
    this.translate.get('MESSAGE.sending_information_to_the_server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'applicationIntroService.ServiceAdd';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructor.name);
    });
    this.applicationIntroService.ServiceAdd(this.dataModel)
      .subscribe({
        next: (ret) => {
          this.formInfo.formSubmitAllow = !ret.isSuccess;
          this.dataModelResult = ret;
          if (ret.isSuccess) {
            this.translate.get('MESSAGE.registration_completed_successfully').subscribe((str: string) => { this.formInfo.formAlert = str; });
            this.cmsToastrService.typeSuccessEdit();
            setTimeout(() => this.router.navigate(['/application/intro/']), 1000);
          } else {
            this.cmsToastrService.typeErrorEdit(ret.errorMessage);
          }
          this.publicHelper.processService.processStop(pName);
        },
        error: (er) => {
          this.formInfo.formSubmitAllow = true;
          this.cmsToastrService.typeError(er);;
          this.publicHelper.processService.processStop(pName);
        }
      }
      );
  }
  onStepClick(event: StepperSelectionEvent, stepper: MatStepper): void {
    if (event.previouslySelectedIndex < event.selectedIndex) {
    }
  }
  onActionBackToParent(): void {
    this.router.navigate(['/application/app/']);
  }
  onActionFileSelectedLinkMainImageId(model: NodeInterface): void {
    this.dataModel.linkMainImageId = model.id;
    this.dataModel.linkMainImageIdSrc = model.downloadLinksrc;
  }
  onActionFileSelectedLinkMainVideoId(model: NodeInterface): void {
    this.dataModel.linkMainVideoId = model.id;
    this.dataModel.linkMainVideoIdSrc = model.downloadLinksrc;
  }
  onActionSelectApplication(model: ApplicationAppModel | null): void {
    if (!model || model.id <= 0) {
      this.cmsToastrService.typeErrorMessage(
        this.translate.instant('MESSAGE.Specify_the_application'),
        this.translate.instant('MESSAGE.Application_information_is_not_clear')
      );
      return;
    }
    this.dataModel.linkApplicationId = model.id;
  }
}
