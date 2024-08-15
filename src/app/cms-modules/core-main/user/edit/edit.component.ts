
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import {
  ChangeDetectorRef, Component, OnDestroy, OnInit,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  AccessModel, CoreEnumService, CoreSiteModel, CoreUserModel, CoreUserService,
  ErrorExceptionResultBase,
  FormInfoModel,
  ManageUserAccessDataTypesEnum
} from 'ntk-cms-api';
import { NodeInterface, TreeModel } from 'ntk-cms-filemanager';
import { Subscription } from 'rxjs';
import { EditBaseComponent } from 'src/app/core/cmsComponent/editBaseComponent';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { CoreUserChangePasswordComponent } from '../changePassword/changePassword.component';

@Component({
  selector: 'app-core-user-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class CoreUserEditComponent extends EditBaseComponent<CoreUserService, CoreUserModel, number>
  implements OnInit, OnDestroy {
  constructorInfoAreaId = this.constructor.name;
  constructor(
    private activatedRoute: ActivatedRoute,
    public coreEnumService: CoreEnumService,
    public coreUserService: CoreUserService,
    private cmsToastrService: CmsToastrService,
    public publicHelper: PublicHelper,
    private tokenHelper: TokenHelper,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    public translate: TranslateService,
  ) {
    super(coreUserService, new CoreUserModel(), publicHelper, translate);
    this.publicHelper.processService.cdr = this.cdr;

    this.requestId = + Number(this.activatedRoute.snapshot.paramMap.get('Id'));
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
    });

    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((value) => {
      this.tokenInfo = value;
      this.DataGetOneContent();
    });
  }
  // tokenInfo: TokenInfoModel;
  cmsApiStoreSubscribe: Subscription;

  requestId = 0;
  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];

  fileManagerTree: TreeModel;
  appLanguage = 'fa';


  dataModelResult: ErrorExceptionResultBase = new ErrorExceptionResultBase();
  dataModel: CoreUserModel = new CoreUserModel();
  @ViewChild('vform', { static: false }) formGroup: FormGroup;

  formInfo: FormInfoModel = new FormInfoModel();

  dataAccessModel: AccessModel;


  fileManagerOpenForm = false;

  onActionFileSelected(model: NodeInterface): void {
    this.dataModel.linkMainImageId = model.id;
    this.dataModel.linkMainImageIdSrc = model.downloadLinksrc;
  }

  ngOnInit(): void {
    if (this.requestId === 0) {
      this.requestId = this.tokenInfo.userId;
    }
    if (this.requestId === 0) {
      this.cmsToastrService.typeErrorAddRowParentIsNull();
      return;
    }

    this.translate.get('TITLE.Edit').subscribe((str: string) => { this.formInfo.formTitle = str; });
    this.DataGetOneContent();

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

    /*َAccess Field*/
    this.coreUserService.setAccessLoad();
    this.coreUserService.setAccessDataType(ManageUserAccessDataTypesEnum.Editor);
    this.coreUserService.ServiceGetOneById(this.requestId).subscribe({
      next: (ret) => {
        /*َAccess Field*/
        this.dataAccessModel = ret.access;
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);

        this.dataModel = ret.item;
        if (ret.isSuccess) {
          this.formInfo.formTitle = this.formInfo.formTitle + ' ' + ret.item.username;
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
    this.translate.get('MESSAGE.sending_information_to_the_server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.sending_information_to_the_server').subscribe((str: string) => { this.publicHelper.processService.processStart(pName, str, this.constructor.name); });


    this.coreUserService.ServiceEdit(this.dataModel).subscribe({
      next: (ret) => {
        this.formInfo.formSubmitAllow = true;
        this.dataModelResult = ret;
        if (ret.isSuccess) {
          this.translate.get('MESSAGE.registration_completed_successfully').subscribe((str: string) => { this.formInfo.formAlert = str; });
          this.cmsToastrService.typeSuccessEdit();
          if (this.dataModel.id === this.tokenInfo.userId) {
            this.tokenHelper.getCurrentToken();
          }
        } else {
          this.translate.get('ERRORMESSAGE.MESSAGE.typeError').subscribe((str: string) => { this.formInfo.formAlert = str; });
          this.formInfo.formError = ret.errorMessage;
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.publicHelper.processService.processStop(pName);
      },
      error: (er) => {
        this.formInfo.formSubmitAllow = true;
        this.cmsToastrService.typeError(er);
        this.publicHelper.processService.processStop(pName, false);
      }
    }
    );
  }
  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    this.formInfo.formSubmitAllow = false;
    this.DataEditContent();
  }
  onActionBackToParent(): void {
    this.router.navigate(['/core/user/']);
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
  onActionSelectorLinkResellerSiteIdSelect(model: CoreSiteModel | null): void {
    this.dataModel.linkResellerSiteId = null;
    if (!model || model.id <= 0) {
      return;
    }
    this.dataModel.linkResellerSiteId = model.id;
  }
  onActionSelectorLinkResellerUserIdSelect(model: CoreUserModel | null): void {
    this.dataModel.linkResellerUserId = null;
    if (!model || model.id <= 0) {
      return;
    }
    this.dataModel.linkResellerUserId = model.id;
  }
  onActionButtonChangePassword(): void {
    if (this.tokenInfo.userId != this.dataModel.id &&
      (
        this.dataAccessModel == null ||
        !this.dataAccessModel.accessEditRow
      )) {
      this.cmsToastrService.typeErrorAccessEdit();
      return;
    }
    const dialogRef = this.dialog.open(CoreUserChangePasswordComponent, {
      //height: '90%',
      data: { linkUserId: this.dataModel.id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {

      }
    });
  }

}


