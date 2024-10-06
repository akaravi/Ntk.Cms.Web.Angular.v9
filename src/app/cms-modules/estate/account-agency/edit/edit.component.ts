
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import {
  ChangeDetectorRef, Component, Inject, OnInit,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import * as Leaflet from 'leaflet';
import { Map as leafletMap } from 'leaflet';
import {
  CoreEnumService, CoreLocationModel, CoreUserModel, DataFieldInfoModel,
  ErrorExceptionResultBase,
  EstateAccountAgencyExpertModel,
  EstateAccountAgencyExpertService,
  EstateAccountAgencyModel, EstateAccountAgencyService,
  EstateAccountExpertModel, EstateAccountExpertService, FilterDataModel, FilterModel, FormInfoModel,
  ManageUserAccessDataTypesEnum
} from 'ntk-cms-api';
import { NodeInterface, TreeModel } from 'ntk-cms-filemanager';
import { EditBaseComponent } from 'src/app/core/cmsComponent/editBaseComponent';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { PoinModel } from 'src/app/core/models/pointModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';


@Component({
  selector: 'app-estate-account-agency-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EstateAccountAgencyEditComponent extends EditBaseComponent<EstateAccountAgencyService, EstateAccountAgencyModel, string>
  implements OnInit {
  requestId = '';
  constructorInfoAreaId = this.constructor.name;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EstateAccountAgencyEditComponent>,
    public coreEnumService: CoreEnumService,
    public estateAccountAgencyService: EstateAccountAgencyService,
    private estateAccountExpertService: EstateAccountExpertService,
    private cmsToastrService: CmsToastrService,
    private estateAccountAgencyExpertService: EstateAccountAgencyExpertService,
    public publicHelper: PublicHelper,
    public tokenHelper: TokenHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {
    super(estateAccountAgencyService, new EstateAccountAgencyModel(), publicHelper, translate);

    this.publicHelper.processService.cdr = this.cdr;
    if (data) {
      this.requestId = data.id;
    }
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
    this.tokenHelper.CheckIsAdmin();
    this.DataGetAccess();

    this.tokenHelper.getTokenInfoState().then((value) => {
      this.tokenInfo = value;
    });
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;

  fieldsInfoAgencyUser: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  fileManagerTree: TreeModel;
  appLanguage = 'fa';


  dataModelResult: ErrorExceptionResultBase = new ErrorExceptionResultBase();
  dataModel: EstateAccountAgencyModel = new EstateAccountAgencyModel();
  dataEstateAccountAgencyExpertModel: EstateAccountAgencyExpertModel = new EstateAccountAgencyExpertModel();
  formInfo: FormInfoModel = new FormInfoModel();

  fileManagerOpenForm = false;


  optionTabledataSource = new MatTableDataSource<EstateAccountAgencyExpertModel>();
  optionTabledisplayedColumns = ['LinkEstateExpertId', 'LinkEstateAccountAgencyId', 'AccessShareUserToAgency', 'AccessShareAgencyToUser', 'Action'];

  /** map */
  viewMap = false;
  private mapModel: leafletMap;
  mapMarker: any;
  private mapMarkerPoints: Array<PoinModel> = [];
  mapOptonCenter = new PoinModel();

  ngOnInit(): void {
    this.translate.get('TITLE.Edit').subscribe((str: string) => { this.formInfo.formTitle = str; });
    if (!this.requestId || this.requestId.length === 0) {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }
    this.DataGetOneContent();

    this.DataGetAllGroup();
  }



  DataGetOneContent(): void {

    this.translate.get('MESSAGE.Receiving_Information_From_The_Server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });

    this.estateAccountAgencyService.setAccessLoad();
    this.estateAccountAgencyService.setAccessDataType(ManageUserAccessDataTypesEnum.Editor);
    this.estateAccountAgencyService.ServiceGetOneById(this.requestId).subscribe({
      next: (ret) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
        this.dataModel = ret.item;
        if (ret.isSuccess) {
          this.formInfo.formTitle = this.formInfo.formTitle + ' ' + ret.item.title;
          this.formInfo.formAlert = '';
          const lat = this.dataModel.geolocationlatitude;
          const lon = this.dataModel.geolocationlongitude;
          if (lat > 0 && lon > 0) {
            this.mapMarkerPoints = [];
            this.mapMarkerPoints.push({ lat, lon });
            this.receiveMap();
          }
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
    this.translate.get('MESSAGE.sending_information_to_the_server').subscribe((str: string) => { this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId); });

    this.estateAccountAgencyService.ServiceEdit(this.dataModel).subscribe({
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
  receiveMap(model: leafletMap = this.mapModel): void {
    if (!model) {
      return;
    }
    this.mapModel = model;

    if (this.mapMarkerPoints && this.mapMarkerPoints.length > 0) {
      this.mapMarkerPoints.forEach(item => {
        this.mapMarker = Leaflet.marker([item.lat, item.lon]).addTo(this.mapModel);
      });
      this.mapOptonCenter = this.mapMarkerPoints[0];
      this.mapMarkerPoints = [];
    }

    this.mapModel.on('click', (e) => {
      // @ts-ignore
      const lat = e.latlng.lat;
      // @ts-ignore
      const lon = e.latlng.lng;
      if (this.mapMarker !== undefined) {
        this.mapModel.removeLayer(this.mapMarker);
      }
      if (lat === this.dataModel.geolocationlatitude && lon === this.dataModel.geolocationlongitude) {
        this.dataModel.geolocationlatitude = null;
        this.dataModel.geolocationlongitude = null;
        return;
      }
      this.mapMarker = Leaflet.marker([lat, lon]).addTo(this.mapModel);
      this.dataModel.geolocationlatitude = lat;
      this.dataModel.geolocationlongitude = lon;
    });

  }

  receiveZoom(zoom: number): void {
  }
  onActionFileSelected(model: NodeInterface): void {
    this.dataModel.linkMainImageId = model.id;
    this.dataModel.linkMainImageIdSrc = model.downloadLinksrc;

  }
  onActionSelectorUser(model: CoreUserModel | null): void {
    this.dataModel.linkCmsUserId = null;
    if (model && model.id > 0) {
      this.dataModel.linkCmsUserId = model.id;
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
  dataEstateAccountExpertModel: EstateAccountAgencyExpertModel[] = [];
  DataGetAllGroup(): void {

    if (this.requestId.length <= 0) {
      this.cmsToastrService.typeErrorEditRowIsNull();
      return;
    }

    this.formInfo.formAlert = this.translate.instant('MESSAGE.Getting_access_category_from_the_server');
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });

    const filteModelContent = new FilterModel();
    const filter = new FilterDataModel();
    filter.propertyName = 'linkEstateAccountAgencyId';
    filter.value = this.requestId;
    filteModelContent.filters.push(filter);

    this.estateAccountAgencyExpertService.ServiceGetAll(filteModelContent).subscribe({
      next: (ret) => {
        this.dataEstateAccountExpertModel = ret.listItems;
        this.optionTabledataSource.data = this.dataEstateAccountExpertModel;

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


  onActionDataGetAddGroup(): void {
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });
    this.estateAccountAgencyExpertService.ServiceAdd(this.dataEstateAccountAgencyExpertModel).subscribe({
      next: (ret) => {

        if (ret.isSuccess) {
          this.formInfo.formAlert = '';
          this.optionTabledataSource.data = ret.listItems;
          this.DataGetAllGroup();
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
    });

  }
  onActionDataGetDeleteGroup(model: EstateAccountAgencyExpertModel): void {
    const pName = this.constructor.name + 'onActionDataGetDeleteGroup';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });
    this.estateAccountAgencyExpertService.ServiceDeleteEntity(model).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.cmsToastrService.typeSuccessRemove();
          this.DataGetAllGroup();
        } else {
          this.cmsToastrService.typeErrorRemove();
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

  onActionSelectorAccountUser(model: EstateAccountExpertModel | null): void {
    this.dataEstateAccountAgencyExpertModel.linkEstateExpertId = null;
    this.dataEstateAccountAgencyExpertModel.linkEstateAccountAgencyId = this.requestId;
    if (model && model.id.length > 0) {
      this.dataEstateAccountAgencyExpertModel.linkEstateExpertId = model.id;
    }
  }
  onActionSelectorLocation(model: CoreLocationModel | null): void {
    this.dataModel.linkLocationId = null;
    if (model && model.id > 0) {
      this.dataModel.linkLocationId = model.id;
    }
  }
  onActionSelectorLocationWorkArea(model: number[] | null): void {
    this.dataModel.linkLocationWorkAreaIds = model;
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
}
