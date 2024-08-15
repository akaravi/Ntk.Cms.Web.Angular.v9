
import {
  ChangeDetectorRef, Component, Inject, OnInit,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  CoreEnumService,
  ErrorExceptionResultBase, EstateCategoryZoneModel, EstateCategoryZoneService, EstatePropertyTypeModel, EstatePropertyTypeService, EstatePropertyTypeUsageModel, FilterDataModel, FilterModel, FormInfoModel,
  ManageUserAccessDataTypesEnum
} from 'ntk-cms-api';
import { NodeInterface, TreeModel } from 'ntk-cms-filemanager';
import { EditBaseComponent } from 'src/app/core/cmsComponent/editBaseComponent';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-estate-category-zone-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EstateCategoryZoneEditComponent extends EditBaseComponent<EstateCategoryZoneService, EstateCategoryZoneModel, string>
  implements OnInit {
  requestId = '';
  constructorInfoAreaId = this.constructor.name;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EstateCategoryZoneEditComponent>,
    public coreEnumService: CoreEnumService,
    public estateCategoryZoneService: EstateCategoryZoneService,
    public estatePropertyTypeService: EstatePropertyTypeService,
    private cmsToastrService: CmsToastrService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {
    super(estateCategoryZoneService, new EstateCategoryZoneModel(), publicHelper, translate);

    this.publicHelper.processService.cdr = this.cdr;

    if (data) {
      this.requestId = data.id;
    }
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;


  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  fileManagerTree: TreeModel;
  appLanguage = 'fa';

  dataModelResult: ErrorExceptionResultBase = new ErrorExceptionResultBase();
  dataModel: EstateCategoryZoneModel = new EstateCategoryZoneModel();
  formInfo: FormInfoModel = new FormInfoModel();

  fileManagerOpenForm = false;

  dataEstatePropertyTypeUsageModel: EstatePropertyTypeUsageModel[];
  dataEstatePropertyTypeUsageIds: string[] = [];
  dataEstatePropertyTypeModel: EstatePropertyTypeModel[];

  ngOnInit(): void {
    this.translate.get('TITLE.Edit').subscribe((str: string) => { this.formInfo.formTitle = str; });
    if (!this.requestId || this.requestId.length === 0) {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }
    this.DataGetOneContent();

    this.DataGetAllEstatePropertyUsage();
  }

  onActionFileSelected(model: NodeInterface): void {
    this.dataModel.linkMainImageId = model.id;
    this.dataModel.linkMainImageIdSrc = model.downloadLinksrc;
  }
  DataGetOneContent(): void {

    this.translate.get('MESSAGE.Receiving_Information_From_The_Server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructor.name);
    });

    this.estateCategoryZoneService.setAccessLoad();
    this.estateCategoryZoneService.setAccessDataType(ManageUserAccessDataTypesEnum.Editor);
    this.estateCategoryZoneService.ServiceGetOneById(this.requestId).subscribe({
      next: (ret) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);

        this.dataModel = ret.item;
        if (ret.isSuccess) {
          this.formInfo.formTitle = this.formInfo.formTitle + ' ' + ret.item.title;
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
  DataGetAllEstatePropertyUsage(): void {

    this.translate.get('MESSAGE.Receiving_Information_From_The_Server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructor.name);
    });

    const filteModelContent = new FilterModel();
    const filter = new FilterDataModel();
    filter.propertyName = 'LinkCategoryZoneId';
    filter.value = this.requestId;
    filteModelContent.filters.push(filter);

    this.estatePropertyTypeService.ServiceGetAll(filteModelContent).subscribe({
      next: (ret) => {
        this.dataEstatePropertyTypeModel = ret.listItems;
        const listG: string[] = [];
        this.dataEstatePropertyTypeModel.forEach(element => {
          listG.push(element.linkPropertyTypeUsageId);
        });
        this.dataEstatePropertyTypeUsageIds = listG;
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
    //! for convert color to hex
    this.dataModel.iconColor = this.dataModel.iconColor?.toString();
    this.translate.get('MESSAGE.sending_information_to_the_server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.sending_information_to_the_server').subscribe((str: string) => { this.publicHelper.processService.processStart(pName, str, this.constructor.name); });

    this.estateCategoryZoneService.ServiceEdit(this.dataModel).subscribe({
      next: (ret) => {
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
  onActionSelectorUserCategorySelect(model: EstatePropertyTypeUsageModel[]): void {
    this.dataEstatePropertyTypeUsageModel = model;
  }

  onIconPickerSelect(model: any): void {
    this.dataModel.iconFont = model;
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
  onActionSelectorLocation(model: number[] | null): void {

    this.dataModel.linkLocationIds = model;
  }
}
