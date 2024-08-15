import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  AccessModel, ApplicationEnumService,
  ApplicationIntroModel,
  ApplicationIntroService, ApplicationSourceModel, CoreEnumService,
  ErrorExceptionResultBase,
  FormInfoModel,
  ManageUserAccessDataTypesEnum
} from 'ntk-cms-api';
import { NodeInterface, TreeModel } from 'ntk-cms-filemanager';
import { EditBaseComponent } from 'src/app/core/cmsComponent/editBaseComponent';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
@Component({
  selector: 'app-aplication-intro-edit',
  templateUrl: './edit.component.html',
})
export class ApplicationIntroEditComponent extends EditBaseComponent<ApplicationIntroService, ApplicationIntroModel, number>
  implements OnInit {
  requestId = 0;
  constructorInfoAreaId = this.constructor.name;
  constructor(
    public contentService: ApplicationIntroService,
    private activatedRoute: ActivatedRoute,
    public publicHelper: PublicHelper,
    public coreEnumService: CoreEnumService,
    public applicationEnumService: ApplicationEnumService,
    private applicationIntroService: ApplicationIntroService,
    private cmsToastrService: CmsToastrService,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
    private router: Router) {
    super(contentService, new ApplicationIntroModel(), publicHelper, translate);
    this.publicHelper.processService.cdr = this.cdr;

    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
    this.requestId = + Number(this.activatedRoute.snapshot.paramMap.get('Id'));
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  formInfo: FormInfoModel = new FormInfoModel();
  dataAccessModel: AccessModel;

  dataModel = new ApplicationIntroModel();
  dataModelResult: ErrorExceptionResultBase = new ErrorExceptionResultBase();


  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  selectFileTypeMainVideo = ['mp4'];
  fileManagerOpenForm = false;
  fileManagerOpenFormVideo = false;
  appLanguage = 'fa';
  fileManagerTree: TreeModel;
  ngOnInit(): void {
    if (this.requestId === 0) {
      this.cmsToastrService.typeErrorAddRowParentIsNull();
      return;
    }
    this.DataGetOne(this.requestId);

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
    this.DataEditContent();
  }
  DataGetOne(requestId: number): void {
    this.formInfo.formSubmitAllow = false;
    this.translate.get('MESSAGE.get_information_from_the_server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.get_information_from_the_server').subscribe((str: string) => { this.publicHelper.processService.processStart(pName, str, this.constructor.name); });
    /*َAccess Field*/
    this.applicationIntroService.setAccessLoad();
    this.applicationIntroService.setAccessDataType(ManageUserAccessDataTypesEnum.Editor);
    this.applicationIntroService
      .ServiceGetOneById(requestId)
      .subscribe({
        next: (ret) => {
          /*َAccess Field*/
          this.dataAccessModel = ret.access;
          this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
          this.dataModelResult = ret;
          this.formInfo.formSubmitAllow = true;
          if (ret.isSuccess) {
            this.dataModel = ret.item;
          } else {
            this.cmsToastrService.typeErrorGetOne(ret.errorMessage);
          }
          this.publicHelper.processService.processStop(pName);
        },
        error: (er) => {
          this.formInfo.formSubmitAllow = true;
          this.cmsToastrService.typeErrorGetOne(er);
          this.publicHelper.processService.processStop(pName, false);
        }
      }
      );
  }
  DataEditContent(): void {
    this.formInfo.formSubmitAllow = false;
    this.translate.get('MESSAGE.sending_information_to_the_server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.sending_information_to_the_server').subscribe((str: string) => { this.publicHelper.processService.processStart(pName, str, this.constructor.name); });
    this.applicationIntroService
      .ServiceEdit(this.dataModel)
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
  onStepClick(event: StepperSelectionEvent, stepper: any): void {
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
  onActionSelectApplication(model: ApplicationSourceModel | null): void {
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
