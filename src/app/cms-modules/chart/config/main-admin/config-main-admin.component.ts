
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  AccessModel, ChartConfigurationService,
  ChartModuleConfigAdminMainValuesModel,
  ChartModuleConfigSiteAccessValuesModel,
  ChartModuleConfigSiteValuesModel, CoreEnumService,
  DataFieldInfoModel,
  FormInfoModel, TokenInfoModel
} from 'ntk-cms-api';
import { TreeModel } from 'ntk-cms-filemanager';
import { Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { PoinModel } from 'src/app/core/models/pointModel';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';


@Component({
  selector: 'app-chart-config-mainadmin',
  templateUrl: './config-main-admin.component.html',
})
export class ChartConfigMainAdminComponent implements OnInit, OnDestroy {
  requestLinkSiteId = 0;
  constructor(
    private configService: ChartConfigurationService,
    private activatedRoute: ActivatedRoute,
    private tokenHelper: TokenHelper,
    public publicHelper: PublicHelper,
    public coreEnumService: CoreEnumService,
    private cmsToastrService: CmsToastrService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => { this.loading.message = str; });
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
  }
  dataConfigSiteValuesDefaultModel = new ChartModuleConfigSiteValuesModel();
  dataConfigSiteAccessValuesDefaultModel = new ChartModuleConfigSiteAccessValuesModel();
  dataConfigAdminMainModel = new ChartModuleConfigAdminMainValuesModel();
  tokenInfo = new TokenInfoModel();

  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  loading = new ProgressSpinnerModel();
  formInfo: FormInfoModel = new FormInfoModel();
  dataAccessModel: AccessModel;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  fileManagerOpenForm = false;
  appLanguage = 'fa';

  fileManagerTree: TreeModel;
  mapMarker: any;
  mapOptonCenter = new PoinModel();

  cmsApiStoreSubscribe: Subscription;

  ngOnInit(): void {
    this.requestLinkSiteId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkSiteId'));

    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
      this.onLoadDate();
    });

    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe({
      next: (ret) => {
        this.tokenInfo = ret;
        this.onLoadDate();
      }
    });

    this.onLoadDate();
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }

  onLoadDate(): void {
    if (!this.requestLinkSiteId || this.requestLinkSiteId === 0) {
      this.requestLinkSiteId = this.tokenInfo.siteId;
    }
    if (this.tokenInfo.userAccessAdminAllowToProfessionalData) {
      this.GetServiceSiteConfigDefault();
      this.GetServiceSiteAccessDefault();
      this.GetServiceAdminMain();
    }

  }
  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      this.cmsToastrService.typeErrorFormInvalid();
      return;
    }
    if (this.tokenInfo.userAccessAdminAllowToProfessionalData) {
      this.SetServiceSiteConfigDefaultSave();
      this.SetServiceSiteAccessDefaultSave();
      this.SetServiceAdminMainSave();
    }

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
    this.router.navigate(['/core/site/']);
  }

  GetServiceSiteConfigDefault(): void {
    this.formInfo.formSubmitAllow = false;
    this.translate.get('MESSAGE.get_information_from_the_server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';

    const pName = this.constructor.name + 'ServiceSiteConfigDefault';
    this.translate.get('MESSAGE.get_the_module_default_settings').subscribe((str: string) => { this.loading.Start(pName, str); });
    this.configService
      .ServiceSiteConfigDefault()
      .subscribe({
        next: (ret) => {
          this.formInfo.formSubmitAllow = true;
          if (ret.isSuccess) {
            this.dataConfigSiteValuesDefaultModel = ret.item;
          } else {
            this.cmsToastrService.typeErrorGetOne(ret.errorMessage);
          }
          this.loading.Stop(pName);
        },
        error: (er) => {
          this.formInfo.formSubmitAllow = true;
          this.cmsToastrService.typeErrorGetOne(er);
          this.loading.Stop(pName);
        }
      }
      );
  }
  SetServiceSiteConfigDefaultSave(): void {
    this.formInfo.formSubmitAllow = false;
    this.translate.get('MESSAGE.Saving_Information_On_The_Server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';


    const pName = this.constructor.name + 'ServiceSiteConfigDefault';
    this.translate.get('MESSAGE.Save_module_default_setting').subscribe((str: string) => { this.loading.Start(pName, str); });
    this.configService
      .ServiceSiteConfigDefaultSave(this.dataConfigSiteValuesDefaultModel)
      .subscribe({
        next: (ret) => {
          if (ret.isSuccess) {
            this.dataConfigSiteValuesDefaultModel = ret.item;
          } else {
            this.cmsToastrService.typeErrorGetOne(ret.errorMessage);
          }
          this.formInfo.formSubmitAllow = true;
          this.loading.Stop(pName);
        },
        error: (er) => {
          this.formInfo.formSubmitAllow = true;
          this.cmsToastrService.typeErrorGetOne(er);
          this.loading.Stop(pName);
        }
      }
      );
  }

  GetServiceSiteAccessDefault(): void {
    this.formInfo.formSubmitAllow = false;
    this.translate.get('MESSAGE.get_information_from_the_server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';

    const pName = this.constructor.name + 'ServiceSiteAccessDefault';
    this.translate.get('MESSAGE.get_the_module_default_access').subscribe((str: string) => { this.loading.Start(pName, str); });
    this.configService
      .ServiceSiteAccessDefault()
      .subscribe({
        next: (ret) => {
          this.formInfo.formSubmitAllow = true;
          if (ret.isSuccess) {
            this.dataConfigSiteAccessValuesDefaultModel = ret.item;
          } else {
            this.cmsToastrService.typeErrorGetOne(ret.errorMessage);
          }
          this.loading.Stop(pName);
        },
        error: (er) => {
          this.formInfo.formSubmitAllow = true;
          this.cmsToastrService.typeErrorGetOne(er);
          this.loading.Stop(pName);
        }
      }
      );
  }
  SetServiceSiteAccessDefaultSave(): void {
    this.formInfo.formSubmitAllow = false;
    this.translate.get('MESSAGE.Saving_Information_On_The_Server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';

    const pName = this.constructor.name + 'ServiceSiteAccessDefaultSave';
    this.translate.get('MESSAGE.Save_the_module_default_access').subscribe((str: string) => { this.loading.Start(pName, str); });
    this.configService
      .ServiceSiteAccessDefaultSave(this.dataConfigSiteAccessValuesDefaultModel)
      .subscribe({
        next: (ret) => {
          this.formInfo.formSubmitAllow = true;
          if (ret.isSuccess) {
            this.dataConfigSiteAccessValuesDefaultModel = ret.item;
          } else {
            this.cmsToastrService.typeErrorGetOne(ret.errorMessage);
          }
          this.loading.Stop(pName);
        },
        error: (er) => {
          this.formInfo.formSubmitAllow = true;
          this.cmsToastrService.typeErrorGetOne(er);
          this.loading.Stop(pName);
        }
      }
      );
  }
  GetServiceAdminMain(): void {
    this.formInfo.formSubmitAllow = false;
    this.translate.get('MESSAGE.get_information_from_the_server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';

    const pName = this.constructor.name + 'ServiceAdminMain';
    this.translate.get('MESSAGE.get_module_setting').subscribe((str: string) => { this.loading.Start(pName, str); });
    this.configService
      .ServiceAdminMain()
      .subscribe({
        next: (ret) => {
          this.formInfo.formSubmitAllow = true;
          if (ret.isSuccess) {
            this.dataConfigAdminMainModel = ret.item;
          } else {
            this.cmsToastrService.typeErrorGetOne(ret.errorMessage);
          }
          this.loading.Stop(pName);
        },
        error: (er) => {
          this.formInfo.formSubmitAllow = true;
          this.cmsToastrService.typeErrorGetOne(er);
          this.loading.Stop(pName);
        }
      }
      );
  }
  SetServiceAdminMainSave(): void {
    this.formInfo.formSubmitAllow = false;
    this.translate.get('MESSAGE.Saving_Information_On_The_Server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';

    const pName = this.constructor.name + 'ServiceAdminMain';
    this.translate.get('MESSAGE.Save_module_setting').subscribe((str: string) => { this.loading.Start(pName, str); });
    this.configService
      .ServiceAdminMainSave(this.dataConfigAdminMainModel)
      .subscribe({
        next: (ret) => {
          this.formInfo.formSubmitAllow = true;
          if (ret.isSuccess) {
            this.dataConfigAdminMainModel = ret.item;
          } else {
            this.cmsToastrService.typeErrorGetOne(ret.errorMessage);
          }
          this.loading.Stop(pName);
        },
        error: (er) => {
          this.formInfo.formSubmitAllow = true;
          this.cmsToastrService.typeErrorGetOne(er);
          this.loading.Stop(pName);
        }
      }
      );
  }
}
