import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  AccessModel, ApplicationEnumService,
  ApplicationSourceModel,
  ApplicationSourceService,
  ApplicationSourceSiteCategoryModel,
  ApplicationSourceSiteCategoryService,
  CoreEnumService,
  CoreSiteCategoryModel,
  ErrorExceptionResult,
  ErrorExceptionResultBase,
  FilterDataModel,
  FilterModel,
  FormInfoModel, InfoEnumModel, ManageUserAccessDataTypesEnum
} from 'ntk-cms-api';
import { NodeInterface, TreeModel } from 'ntk-cms-filemanager';
import { EditBaseComponent } from 'src/app/core/cmsComponent/editBaseComponent';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
    selector: 'app-aplication-source-edit',
    templateUrl: './edit.component.html',
    standalone: false
})
export class ApplicationSourceEditComponent extends EditBaseComponent<ApplicationSourceService, ApplicationSourceModel, number>
  implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor(
    public contentService: ApplicationSourceService,
    private activatedRoute: ActivatedRoute,
    public publicHelper: PublicHelper,
    public coreEnumService: CoreEnumService,
    public applicationEnumService: ApplicationEnumService,
    private applicationSourceService: ApplicationSourceService,
    private applicationSourceSiteCategoryService: ApplicationSourceSiteCategoryService,
    private cmsToastrService: CmsToastrService,
    public translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private router: Router) {
    super(contentService, new ApplicationSourceModel(), publicHelper, translate);

    this.publicHelper.processService.cdr = this.cdr;

    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
  }
  requestId = 0;

  @ViewChild('vform', { static: false }) formGroup: FormGroup;

  formInfo: FormInfoModel = new FormInfoModel();
  dataAccessModel: AccessModel;

  dataModel = new ApplicationSourceModel();
  dataModelResult: ErrorExceptionResultBase = new ErrorExceptionResultBase();

  dataModelEnumOsTypeResult: ErrorExceptionResult<InfoEnumModel> = new ErrorExceptionResult<InfoEnumModel>();
  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  fileManagerOpenForm = false;
  appLanguage = 'fa';

  fileManagerTree: TreeModel;

  dataCoreSiteCategoryModel: CoreSiteCategoryModel[];
  dataCoreSiteCategoryIds: number[] = [];
  dataApplicationSourceSiteCategoryModel: ApplicationSourceSiteCategoryModel[];
  ngOnInit(): void {
    this.requestId = + Number(this.activatedRoute.snapshot.paramMap.get('Id'));
    if (this.requestId === 0) {
      this.cmsToastrService.typeErrorAddRowParentIsNull();
      return;
    }
    this.DataGetOne(this.requestId);
    this.DataGetAllSourceSiteCategory();

    this.getEnumOsType();
  }

  getEnumOsType(): void {
    this.coreEnumService.ServiceOperatingSystemTypeEnum().subscribe((res) => {
      this.dataModelEnumOsTypeResult = res;
    });
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
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });

    /*َAccess Field*/
    this.applicationSourceService.setAccessLoad();
    this.applicationSourceService.setAccessDataType(ManageUserAccessDataTypesEnum.Editor);
    this.applicationSourceService
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
            this.checkIsNull(this.dataModel);
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
  DataGetAllSourceSiteCategory(): void {
    this.translate.get('MESSAGE.Receiving_Information_From_The_Server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });

    const filteModelContent = new FilterModel();
    const filter = new FilterDataModel();
    filter.propertyName = 'LinkSourceId';
    filter.value = this.requestId;
    filteModelContent.filters.push(filter);

    this.applicationSourceSiteCategoryService.ServiceGetAll(filteModelContent).subscribe({
      next: (ret) => {
        this.dataApplicationSourceSiteCategoryModel = ret.listItems;
        const listG: number[] = [];
        this.dataApplicationSourceSiteCategoryModel.forEach(element => {
          listG.push(element.linkSiteCagegoryId);
        });
        this.dataCoreSiteCategoryIds = listG;
        if (ret.isSuccess) {
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
  DataEditContent(): void {
    this.formInfo.formSubmitAllow = false;
    this.translate.get('MESSAGE.sending_information_to_the_server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.sending_information_to_the_server').subscribe((str: string) => { this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId); });


    this.applicationSourceService
      .ServiceEdit(this.dataModel)
      .subscribe({
        next: (ret) => {
          this.formInfo.formSubmitAllow = !ret.isSuccess;
          this.dataModelResult = ret;
          if (ret.isSuccess) {
            this.translate.get('MESSAGE.registration_completed_successfully').subscribe((str: string) => { this.formInfo.formAlert = str; });
            this.cmsToastrService.typeSuccessEdit();
            setTimeout(() => this.router.navigate(['/application/source/']), 1000);
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


  onActionSelectorUserCategorySelect(model: CoreSiteCategoryModel[]): void {
    this.dataCoreSiteCategoryModel = model;
  }
  onActionSelectorUserCategorySelectAdded(model: CoreSiteCategoryModel): void {
    const entity = new ApplicationSourceSiteCategoryModel();
    entity.linkSiteCagegoryId = model.id;
    entity.linkSourceId = this.dataModel.id;

    this.applicationSourceSiteCategoryService.ServiceAdd(entity).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.translate.get('MESSAGE.registration_in_this_group_was_successful').subscribe((str: string) => { this.formInfo.formAlert = str; });
          this.cmsToastrService.typeSuccessEdit();
          // this.dialogRef.close({ dialogChangedDate: true });
        } else {
          this.translate.get('ERRORMESSAGE.MESSAGE.typeError').subscribe((str: string) => { this.formInfo.formAlert = str; });
          this.formInfo.formError = ret.errorMessage;
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
      },
      error: (er) => {
        this.formInfo.formSubmitAllow = true;
        this.cmsToastrService.typeError(er);
      }
    }
    );
  }
  onActionSelectorUserCategorySelectRemoved(model: CoreSiteCategoryModel): void {
    const entity = new ApplicationSourceSiteCategoryModel();
    entity.linkSiteCagegoryId = model.id;
    entity.linkSourceId = this.dataModel.id;

    this.applicationSourceSiteCategoryService.ServiceDeleteEntity(entity).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.translate.get('MESSAGE.Deletion_from_this_group_Was_Successful').subscribe((str: string) => { this.formInfo.formAlert = str; });
          this.cmsToastrService.typeSuccessEdit();
        } else {
          this.translate.get('ERRORMESSAGE.MESSAGE.typeError').subscribe((str: string) => { this.formInfo.formAlert = str; });
          this.formInfo.formError = ret.errorMessage;
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
      },
      error: (er) => {
        this.formInfo.formSubmitAllow = true;
        this.cmsToastrService.typeError(er);
      }
    }
    );
  }
  checkIsNull(dataModel: ApplicationSourceModel): void {
    if (this.dataModel.defaultConfigBuilderAdminJsonValues == 'null')
      this.dataModel.defaultConfigBuilderAdminJsonValues = '';
    if (this.dataModel.defaultConfigRuntimeAdminJsonValues == 'null')
      this.dataModel.defaultConfigRuntimeAdminJsonValues = '';
    if (this.dataModel.defaultConfigBuilderSiteJsonValues == 'null')
      this.dataModel.defaultConfigBuilderSiteJsonValues = '';
    if (this.dataModel.defaultConfigRuntimeSiteJsonValues == 'null')
      this.dataModel.defaultConfigRuntimeSiteJsonValues = '';
  }
  onStepClick(event: StepperSelectionEvent, stepper: MatStepper): void {
    if (event.previouslySelectedIndex < event.selectedIndex) {

    }
  }
  onActionBackToParent(): void {
    this.router.navigate(['/application/source/']);
  }
  onActionFileSelectedLinkMainImageId(model: NodeInterface): void {
    this.dataModel.linkMainImageId = model.id;
    this.dataModel.linkMainImageIdSrc = model.downloadLinksrc;
  }
}
