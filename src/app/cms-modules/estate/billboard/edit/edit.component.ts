
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectorRef, Component,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  CoreCurrencyModel, CoreEnumService, DataFieldInfoModel,
  ErrorExceptionResultBase, EstateBillboardModel, EstateBillboardService, EstatePropertyDetailGroupService, FormInfoModel,
  ManageUserAccessDataTypesEnum, SortTypeEnum
} from 'ntk-cms-api';
import { NodeInterface, TreeModel } from 'ntk-cms-filemanager';
import { EditBaseComponent } from 'src/app/core/cmsComponent/editBaseComponent';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { EstatePropertyListComponent } from '../../property/list/list.component';

@Component({
  selector: 'app-estate-billboard-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EstateBillboardEditComponent extends EditBaseComponent<EstateBillboardService, EstateBillboardModel, string>
  implements OnInit {
  requestId = '';
  constructor(
    private router: Router,
    public estatePropertyDetailGroupService: EstatePropertyDetailGroupService,
    public coreEnumService: CoreEnumService,
    public estateBillboardService: EstateBillboardService,
    private cmsToastrService: CmsToastrService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    public translate: TranslateService,
    public http: HttpClient,
  ) {
    super(estateBillboardService, new EstateBillboardModel(), publicHelper);

    this.publicHelper.processService.cdr = this.cdr; this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => { this.loading.message = str; });
    this.requestId = this.activatedRoute.snapshot.paramMap.get('id');

    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  @ViewChild(EstatePropertyListComponent) estatePropertyList: EstatePropertyListComponent;

  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  fileManagerTree: TreeModel;
  appLanguage = 'fa';

  dataModelResult: ErrorExceptionResultBase = new ErrorExceptionResultBase();
  dataModel: EstateBillboardModel = new EstateBillboardModel();
  dataModelCorCurrencySelector = new CoreCurrencyModel();
  formInfo: FormInfoModel = new FormInfoModel();

  fileManagerOpenForm = false;
  optionloadComponent = false;

  loadResult = '';

  ngOnInit(): void {
    this.translate.get('TITLE.Edit').subscribe((str: string) => { this.formInfo.formTitle = str; });
    if (!this.requestId || this.requestId.length === 0) {
      this.cmsToastrService.typeErrorComponentAction();
      this.router.navigate(['/estate/billboard/']);
      return;
    }
    this.DataGetOneContent();

  }


  dataFieldInfoModel: DataFieldInfoModel[];

  DataGetOneContent(): void {

    this.translate.get('MESSAGE.Receiving_Information_From_The_Server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.publicHelper.processService.processStart(pName);

    this.estateBillboardService.setAccessLoad();
    this.estateBillboardService.setAccessDataType(ManageUserAccessDataTypesEnum.Editor);
    this.estateBillboardService.ServiceGetOneById(this.requestId).subscribe({
      next: (ret) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
        this.dataFieldInfoModel = ret.access.fieldsInfo;
        this.dataModel = ret.item;
        if (ret.isSuccess) {
          this.formInfo.formTitle = this.formInfo.formTitle + ' ' + ret.item.title;
          if (this.dataModel.linkPropertyIds && this.dataModel.linkPropertyIds.length > 0)
            this.LinkPropertyIdsInUse = true;
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
    this.translate.get('MESSAGE.sending_information_to_the_server').subscribe((str: string) => { this.publicHelper.processService.processStart(pName, str); });

    this.estateBillboardService.ServiceEdit(this.dataModel).subscribe({
      next: (ret) => {
        this.dataModelResult = ret;
        if (ret.isSuccess) {
          this.translate.get('MESSAGE.registration_completed_successfully').subscribe((str: string) => { this.formInfo.formAlert = str; });
          this.cmsToastrService.typeSuccessEdit();
          this.optionReload();
        } else {
          this.translate.get('ERRORMESSAGE.MESSAGE.typeError').subscribe((str: string) => { this.formInfo.formAlert = str; });
          this.formInfo.formError = ret.errorMessage;
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.publicHelper.processService.processStop(pName);

        this.formInfo.formSubmitAllow = true;
      },
      error: (er) => {
        this.formInfo.formSubmitAllow = true;
        this.cmsToastrService.typeError(er);
        this.publicHelper.processService.processStop(pName, false);
      }
    }
    );
  }
  onActionCopied(): void {
    this.cmsToastrService.typeSuccessCopedToClipboard();
  }

  onActionFileSelected(model: NodeInterface): void {
    this.dataModel.linkMainImageId = model.id;
    this.dataModel.linkMainImageIdSrc = model.downloadLinksrc;

  }
  onActionSelectorSelectUsage(model: string[] | null): void {

    this.dataModel.linkPropertyTypeUsageIds = model;
  }
  onActionSelectorContarctType(model: string[] | null): void {

    this.dataModel.linkContractTypeIds = model;
  }
  onActionSelectorSelectLanduse(model: string[] | null): void {

    this.dataModel.linkPropertyTypeLanduseIds = model;
  }
  onActionSelectorLocation(model: number[] | null): void {

    this.dataModel.linkLocationIds = model;
  }
  onActionSelectorProperty(model: string[] | null): void {
    this.dataModel.linkPropertyIds = model;
    if (this.dataModel.linkPropertyIds && this.dataModel.linkPropertyIds.length > 0) {
      this.LinkPropertyIdsInUse = true;
      this.dataModel.linkPropertyTypeUsageIds = null;
      this.dataModel.linkContractTypeIds = null;
      this.dataModel.linkPropertyTypeLanduseIds = null;
      this.dataModel.linkLocationIds = null;
    }
    else {
      this.LinkPropertyIdsInUse = false;
    }
  }
  LinkPropertyIdsInUse = false;


  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    this.formInfo.formSubmitAllow = false;
    this.DataEditContent();
  }
  onFormCancel(): void {
    this.router.navigate(['/estate/billboard/']);
  }
  optionReload = (): void => {
    this.estatePropertyList.optionloadComponent = true;
    this.estatePropertyList.DataGetAll();
  }
  onFormLoadResult(): void {
    this.loadResult = 'estatePropertyList';
    this.estatePropertyList.optionloadComponent = true;
    this.estatePropertyList.DataGetAll();
  }
  onActionSelectCurrency(model: CoreCurrencyModel): void {
    if (!model || model.id <= 0) {
      // this.cmsToastrService.typeErrorSelected();
      this.dataModelCorCurrencySelector = null;
      this.dataModel.linkCoreCurrencyId = null;
      return;
    }
    this.dataModelCorCurrencySelector = model;
    this.dataModel.linkCoreCurrencyId = model.id;
  }
  onActionSortArrow() {
    if (this.dataModel.resultSortType == SortTypeEnum.Ascending)
      this.dataModel.resultSortType = SortTypeEnum.Descending;
    else if (this.dataModel.resultSortType == SortTypeEnum.Descending)
      this.dataModel.resultSortType = SortTypeEnum.Random;
    else if (this.dataModel.resultSortType == SortTypeEnum.Random)
      this.dataModel.resultSortType = SortTypeEnum.Ascending;
    else
      this.dataModel.resultSortType = SortTypeEnum.Ascending;
  }
}
