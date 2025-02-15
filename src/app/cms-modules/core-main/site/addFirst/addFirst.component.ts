
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  AuthRenewTokenModel,

  CoreAuthService,
  CoreSiteAddFirstSiteDtoModel,
  CoreSiteCategoryModel,
  CoreSiteService,
  DataFieldInfoModel,
  ErrorExceptionResult,
  FilterModel,
  FormInfoModel
} from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from '../../../../core/services/cmsToastr.service';

@Component({
    selector: 'app-core-site-add-first',
    templateUrl: './addFirst.component.html',
    styleUrls: ['./addFirst.component.scss'],
    standalone: false
})
export class CoreSiteAddFirstComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor(
    private cmsToastrService: CmsToastrService,
    private coreSiteService: CoreSiteService,
    public translate: TranslateService,
    public publicHelper: PublicHelper,
    private coreAuthService: CoreAuthService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {
    this.publicHelper.processService.cdr = this.cdr;

    this.formInfo.formTitle = this.translate.instant('TITLE.Create_your_first_system');


    /** read storage */
    this.siteTypeId = + localStorage.getItem('siteTypeId');
    if (this.siteTypeId > 0) {
      this.dataModel.linkSiteCategoryId = this.siteTypeId;
    }
    /** read storage */
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  alphaExp = /^[a-zA-Z0-9]+$/;
  siteTypeId = 0;

  dataModel = new CoreSiteAddFirstSiteDtoModel();
  filterModel = new FilterModel();
  dataModelResultDomains = new ErrorExceptionResult<string>();

  formInfo: FormInfoModel = new FormInfoModel();
  modelDateSiteCategory = new CoreSiteCategoryModel();
  validateDomain = true;
  ngOnInit(): void {
    this.DataGetAccess();
  }
  checkValidateDomain() {
    if (!this.dataModel.subDomain && this.dataModel.subDomain.length == 0) {
      this.validateDomain = false;
      return;
    }
    this.dataModel.subDomain = this.publicHelper.parseNumberArabic(this.dataModel.subDomain);
    this.validateDomain = this.alphaExp.test(this.dataModel.subDomain);
  }

  DataGetAccess(): void {
    const pName = this.constructor.name + '.DataGetAccess';
    this.translate.get('MESSAGE.get_access').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });
    this.coreSiteService
      .ServiceViewModel()
      .subscribe({
        next: (ret) => {
          if (ret.isSuccess) {
            // this.dataAccessModel = next.access;
            this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
          } else {
            this.cmsToastrService.typeErrorGetAccess(ret.errorMessage);
          }
          this.publicHelper.processService.processStop(pName);
        },
        error: (er) => {
          this.cmsToastrService.typeErrorGetAccess(er);
          this.publicHelper.processService.processStop(pName, false);
        }
      }
      );
  }

  GetDomainList(): void {
    const pName = this.constructor.name + '.GetDomainList';
    this.translate.get('MESSAGE.Get_list_of_authorized_domains').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });
    this.coreSiteService.ServiceGetRegDomains(this.dataModel.linkSiteCategoryId).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.dataModelResultDomains = ret;
          if (ret.listItems.length > 0) {
            this.dataModel.domain = ret.listItems[0];
          }
          if (!this.dataModel.subDomain || this.dataModel.subDomain?.length === 0) {
            this.dataModel.subDomain = 'myname';
          }
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

  protocolSelect(): void {
  }

  domain(item): void {
    this.dataModel.domain = item;
  }

  onFormSubmit(): void {
    if (this.dataModel.linkSiteCategoryId <= 0) {
      this.cmsToastrService.typeErrorMessage(this.translate.instant('MESSAGE.System_type_not_selected'));
      return;
    }
    if (!this.dataModel.title || this.dataModel.title.length === 0) {
      this.cmsToastrService.typeErrorMessage(this.translate.instant('MESSAGE.As_the_system_is_not_selected'));

      return;
    }
    if (!this.dataModel.domain || this.dataModel.domain.length === 0) {

      this.cmsToastrService.typeErrorMessage(this.translate.instant('MESSAGE.System_domain_not_selected'));

      return;
    }
    if (!this.dataModel.subDomain || this.dataModel.subDomain.length === 0) {
      this.cmsToastrService.typeErrorMessage(this.translate.instant('MESSAGE.System_parent_domain_not_selected'));


      return;
    }

    this.formInfo.formSubmitAllow = false;
    const pName = this.constructor.name + '.onFormSubmit';
    this.translate.get('MESSAGE.Registering_your_first_system_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });
    this.coreSiteService.ServiceAddFirstSite(this.dataModel).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.cmsToastrService.typeSuccessAddFirstSite();
          this.clickSelectSite(ret.item.id);
        } else {
          this.formInfo.formSubmitAllow = true;
          this.cmsToastrService.typeErrorAdd(ret.errorMessage);
        }
        this.publicHelper.processService.processStop(pName);
      },
      error: (er) => {
        this.cmsToastrService.typeError(er);
        this.formInfo.formSubmitAllow = true;
        this.publicHelper.processService.processStop(pName);
      }
    }
    );
  }

  clickSelectSite(Id: number): void {
    const pName = this.constructor.name + '.clickSelectSite';
    this.translate.get('MESSAGE.Request_new_access').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });
    let authModel: AuthRenewTokenModel;
    authModel = new AuthRenewTokenModel();
    authModel.siteId = Id;
    this.coreAuthService.ServiceRenewToken(authModel).subscribe({
      next: (res) => {
        this.publicHelper.processService.processStop(pName);
        if (res.isSuccess) {
          setTimeout(() => this.router.navigate(['/dashboard/']), 2000);
        }
      },
      error: (er) => {
        this.cmsToastrService.typeError(er);
        this.publicHelper.processService.processStop(pName, false);
      }
    }
    );
  }
  onActionSelectorSelect(model: CoreSiteCategoryModel | null): void {
    if (!model || model.id <= 0) {
      this.cmsToastrService.typeErrorMessage(
        this.translate.instant('MESSAGE.Specify_the_system_type'),
        this.translate.instant('MESSAGE.Information_system_type_is_not_clear')
      );
      return;
    }
    this.modelDateSiteCategory = model;
    this.dataModel.linkSiteCategoryId = model.id;
    this.GetDomainList();
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
      if (!this.dataModel.linkSiteCategoryId || this.dataModel.linkSiteCategoryId <= 0) {

        this.cmsToastrService.typeErrorMessage(this.translate.instant('MESSAGE.System_type_not_selected'));
        setTimeout(() => {
          stepper.selectedIndex = event.previouslySelectedIndex;
          // stepper.previous();
        }, 10);
      }
    }
  }
}
