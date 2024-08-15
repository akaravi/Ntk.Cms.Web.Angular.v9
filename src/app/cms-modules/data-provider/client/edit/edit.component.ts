
import {
  ChangeDetectorRef, Component, Inject, OnInit,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  CoreEnumService,
  DataProviderClientModel,
  DataProviderClientService, DataProviderPlanClientModel,
  DataProviderPlanClientService, DataProviderPlanModel,
  ErrorExceptionResultBase, FilterDataModel, FilterModel, FormInfoModel,
  ManageUserAccessDataTypesEnum
} from 'ntk-cms-api';
import { TreeModel } from 'ntk-cms-filemanager';
import { Subscription } from 'rxjs';
import { EditBaseComponent } from 'src/app/core/cmsComponent/editBaseComponent';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';

@Component({
  selector: 'app-data-provider-client-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class DataProviderClientEditComponent extends EditBaseComponent<DataProviderClientService, DataProviderClientModel, number>
  implements OnInit {
  requestId = 0;
  constructorInfoAreaId = this.constructor.name;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DataProviderClientEditComponent>,
    public coreEnumService: CoreEnumService,
    public dataProviderClientService: DataProviderClientService,
    private cmsToastrService: CmsToastrService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private cmsConfirmationDialogService: CmsConfirmationDialogService,
    private dataProviderPlanClientService: DataProviderPlanClientService,
    public translate: TranslateService,
    private tokenHelper: TokenHelper
  ) {
    super(dataProviderClientService, new DataProviderClientModel(), publicHelper, translate);

    this.publicHelper.processService.cdr = this.cdr;
    if (data) {
      this.requestId = +data.id || 0;
    }

    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();

    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
    });

    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe({
      next: (ret) => {
        this.tokenInfo = ret;
      }
    });
  }
  cmsApiStoreSubscribe: Subscription;

  @ViewChild('vform', { static: false }) formGroup: FormGroup;


  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];


  fileManagerTree: TreeModel;
  appLanguage = 'fa';


  dataModelResult: ErrorExceptionResultBase = new ErrorExceptionResultBase();
  dataModel: DataProviderClientModel = new DataProviderClientModel();

  formInfo: FormInfoModel = new FormInfoModel();


  fileManagerOpenForm = false;

  ngOnInit(): void {
    if (this.requestId > 0) {
      this.formInfo.formTitle = this.translate.instant('TITLE.Edit_Categories');
      this.DataGetOneContent();
    } else {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }

  }

  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  DataGetOneContent(): void {
    if (this.requestId <= 0) {
      this.cmsToastrService.typeErrorEditRowIsNull();
      return;
    }

    this.translate.get('MESSAGE.Receiving_Information_From_The_Server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructor.name);
    });
    this.dataProviderClientService.setAccessLoad();
    this.dataProviderClientService.setAccessDataType(ManageUserAccessDataTypesEnum.Editor);
    this.dataProviderClientService.ServiceGetOneById(this.requestId).subscribe({
      next: (ret) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);

        this.dataModel = ret.item;
        if (ret.isSuccess) {
          this.formInfo.formTitle = this.formInfo.formTitle + ' ' + ret.item.title;
          this.formInfo.formAlert = '';
          this.DataGetAllPlanClient();
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

    this.dataProviderClientService.ServiceEdit(this.dataModel).subscribe({
      next: (ret) => {
        this.formInfo.formSubmitAllow = true;
        this.dataModelResult = ret;
        if (ret.isSuccess) {
          this.translate.get('MESSAGE.registration_completed_successfully').subscribe((str: string) => { this.formInfo.formAlert = str; });
          this.cmsToastrService.typeSuccessEdit();
          this.dialogRef.close({ dialogChangedDate: true });

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
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
  DataGetAllPlanClient(): void {

    if (this.requestId <= 0) {
      this.cmsToastrService.typeErrorEditRowIsNull();
      return;
    }

    this.formInfo.formAlert = this.translate.instant('MESSAGE.Getting_access_category_from_the_server');
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructor.name);
    });

    const filteModelContent = new FilterModel();
    const filter = new FilterDataModel();
    filter.propertyName = 'LinkClientId';
    filter.value = this.requestId;
    filteModelContent.filters.push(filter);

    this.dataProviderPlanClientService.ServiceGetAll(filteModelContent).subscribe({
      next: (ret) => {
        this.dataCoreCpMainMenuCmsUserGroupModel = ret.listItems;
        const listG: number[] = [];
        this.dataCoreCpMainMenuCmsUserGroupModel.forEach(element => {
          listG.push(element.linkPlanId);
        });
        this.dataCoreCpMainMenuIds = listG;
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
  dataCoreCpMainMenuModel: DataProviderPlanModel[];
  dataCoreCpMainMenuIds: number[] = [];
  dataCoreCpMainMenuCmsUserGroupModel: DataProviderPlanClientModel[];

  onActionSelectorPlanSelect(model: DataProviderPlanModel[]): void {
    this.dataCoreCpMainMenuModel = model;
  }
  onActionSelectorPlanSelectAdded(model: DataProviderPlanModel): void {
    if (!this.tokenInfo.userAccessAdminAllowToProfessionalData) {
      /** */
      const listG: number[] = [];
      this.dataCoreCpMainMenuIds.forEach(element => {
        if (element != model.id)
          listG.push(element);
      });
      setTimeout(() => this.dataCoreCpMainMenuIds = listG, 1000);
      /** */



      var title = "";
      var message = "";
      this.translate.get(['MESSAGE.Please_Confirm', 'MESSAGE.Would_you_like_to_buy_this_content']).subscribe((str: string) => {
        title = str['MESSAGE.Please_Confirm'];
        message = str['MESSAGE.Would_you_like_to_buy_this_content'] + '?';
      });
      this.cmsConfirmationDialogService.confirm(title, message)
        .then((confirmed) => {
          if (confirmed) {
            const pName = this.constructor.name + 'main';
            //منتقل شود به صفحه خرید
            this.router.navigate(['/data-provider/client-charge/', model.id]);
            this.dialogRef.close({ dialogChangedDate: false });
          }
        }
        )
      return;

    }
    const entity = new DataProviderPlanClientModel();
    entity.linkPlanId = model.id;
    entity.linkClientId = this.dataModel.id;

    this.dataProviderPlanClientService.ServiceAdd(entity).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.translate.get('MESSAGE.registration_in_this_group_was_successful').subscribe((str: string) => { this.formInfo.formAlert = str; });
          this.cmsToastrService.typeSuccessEdit();
          // this.dialogRef.close({ dialogChangedDate: true });
        } else {
          this.translate.get('ERRORMESSAGE.MESSAGE.typeError').subscribe((str: string) => { this.formInfo.formAlert = str; });
          this.formInfo.formError = ret.errorMessage;
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
          /** */
          const listG: number[] = [];
          this.dataCoreCpMainMenuIds.forEach(element => {
            if (element != model.id)
              listG.push(element);
          });
          setTimeout(() => this.dataCoreCpMainMenuIds = listG, 1000);
          /** */
        }
      },
      error: (er) => {
        this.formInfo.formSubmitAllow = true;
        this.cmsToastrService.typeError(er);
      }
    }
    );
  }
  onActionSelectorPlanSelectRemoved(model: DataProviderPlanModel): void {

    if (!this.tokenInfo.userAccessAdminAllowToProfessionalData) {
      /** */
      const listG: number[] = [];
      this.dataCoreCpMainMenuIds.forEach(element => {
        listG.push(element);
      });
      if (listG.indexOf(model.id) < 0)
        listG.push(model.id);
      setTimeout(() => this.dataCoreCpMainMenuIds = listG, 1000);
      /** */
      this.cmsToastrService.typeErrorAccessDelete();

      return;
    }
    const entity = new DataProviderPlanClientModel();
    entity.linkPlanId = model.id;
    entity.linkClientId = this.dataModel.id;

    this.dataProviderPlanClientService.ServiceDeleteEntity(entity).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.translate.get('MESSAGE.Deletion_from_this_group_Was_Successful').subscribe((str: string) => { this.formInfo.formAlert = str; });
          this.cmsToastrService.typeSuccessEdit();
        } else {

          /** */
          const listG: number[] = [];
          this.dataCoreCpMainMenuIds.forEach(element => {
            listG.push(element);
          });
          if (listG.indexOf(model.id) < 0)
            listG.push(model.id);

          setTimeout(() => this.dataCoreCpMainMenuIds = listG, 1000);
          /** */

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
}
