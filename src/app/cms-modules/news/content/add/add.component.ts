
import { ENTER } from '@angular/cdk/keycodes';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as Leaflet from 'leaflet';
import { Map as leafletMap } from 'leaflet';
import {
  CoreEnumService, CoreLocationModel, DataFieldInfoModel, ErrorExceptionResult,
  FormInfoModel,
  NewsCategoryModel, NewsContentModel, NewsContentOtherInfoModel, NewsContentOtherInfoService, NewsContentService, NewsContentSimilarModel, NewsContentSimilarService, NewsContentTagModel, NewsContentTagService
} from 'ntk-cms-api';
import { NodeInterface, TreeModel } from 'ntk-cms-filemanager';
import { firstValueFrom, of } from 'rxjs';
import { AddBaseComponent } from 'src/app/core/cmsComponent/addBaseComponent';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { PoinModel } from 'src/app/core/models/pointModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
@Component({
    selector: 'app-news-content-add',
    templateUrl: './add.component.html',
    styleUrls: ['./add.component.scss'
    ],
    standalone: false
})
export class NewsContentAddComponent extends AddBaseComponent<NewsContentService, NewsContentModel, number> implements OnInit {
  requestCategoryId = 0;
  constructorInfoAreaId = this.constructor.name;
  constructor(
    private activatedRoute: ActivatedRoute,
    public publicHelper: PublicHelper,
    public coreEnumService: CoreEnumService,
    public contentService: NewsContentService,
    private contentSimilarService: NewsContentSimilarService,
    private contentOtherInfoService: NewsContentOtherInfoService,
    private cmsToastrService: CmsToastrService,
    private router: Router,
    private contentTagService: NewsContentTagService,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {
    super(contentService, new NewsContentModel(), publicHelper, translate);
    this.publicHelper.processService.cdr = this.cdr;
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  mapOptonCenter = new PoinModel();
  formInfo: FormInfoModel = new FormInfoModel();
  dataModel = new NewsContentModel();
  dataModelResult: ErrorExceptionResult<NewsContentModel> = new ErrorExceptionResult<NewsContentModel>();

  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  selectFileTypePodcast = ['mp3'];
  selectFileTypeMovie = ['mp4', 'webm'];
  mapMarker: any;
  fileManagerOpenForm = false;
  fileManagerOpenFormPodcast = false;
  fileManagerOpenFormMovie = false;
  fileManagerTree: TreeModel;
  keywordDataModel = [];
  tagDataModel = [];
  similarDataModel = new Array<NewsContentModel>();
  otherInfoDataModel = new Array<NewsContentOtherInfoModel>();
  contentSimilarSelected: NewsContentModel = new NewsContentModel();
  contentOtherInfoSelected: NewsContentOtherInfoModel = new NewsContentOtherInfoModel();
  otherInfoTabledisplayedColumns = ['Title', 'TypeId', 'Action'];
  similarTabledisplayedColumns = ['LinkMainImageIdSrc', 'Id', 'RecordStatus', 'Title', 'Action'];
  similarTabledataSource = new MatTableDataSource<NewsContentModel>();
  otherInfoTabledataSource = new MatTableDataSource<NewsContentOtherInfoModel>();
  appLanguage = 'fa';
  viewMap = false;
  private mapModel: leafletMap;
  ngOnInit(): void {
    this.requestCategoryId = + Number(this.activatedRoute.snapshot.paramMap.get('CategoryId'));
    if (this.requestCategoryId === 0) {
      this.cmsToastrService.typeErrorAddRowParentIsNull();
      return;
    }
    this.dataModel.linkCategoryId = this.requestCategoryId;
    this.DataGetAccess();

  }


  onActionTagChange(model: any): void {
    this.tagDataModel = model;
  }
  onActionFileSelectedLinkMainImageId(model: NodeInterface): void {
    this.dataModel.linkMainImageId = model.id;
    this.dataModel.linkMainImageIdSrc = model.downloadLinksrc;
  }
  onActionFileSelectedLinkFilePodcastId(model: NodeInterface): void {
    this.dataModel.linkFilePodcastId = model.id;
    this.dataModel.linkFilePodcastIdSrc = model.downloadLinksrc;
  }
  onActionFileSelectedLinkFileMovieId(model: NodeInterface): void {
    this.dataModel.linkFileMovieId = model.id;
    this.dataModel.linkFileMovieIdSrc = model.downloadLinksrc;
  }

  receiveMap(model: leafletMap = this.mapModel): void {
    if (!model) {
      return;
    }
    this.mapModel = model;
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
  onFormSubmit(): void {
    if (this.dataModel.linkCategoryId <= 0) {
      this.cmsToastrService.typeErrorAddRowParentIsNull();
      return;
    }
    if (!this.formGroup.valid) {
      this.cmsToastrService.typeErrorFormInvalid();
      return;
    }
    this.dataModel.keyword = '';
    if (this.keywordDataModel && this.keywordDataModel.length > 0) {
      const listKeyword = [];
      this.keywordDataModel.forEach(element => {
        if (element.display) {
          listKeyword.push(element.display);
        } else {
          listKeyword.push(element);
        }
      });
      if (listKeyword && listKeyword.length > 0) {
        this.dataModel.keyword = listKeyword.join(',');
      }
    }
    this.DataAddContent();
  }
  DataAddContent(): void {
    this.formInfo.formSubmitAllow = false;
    this.translate.get('MESSAGE.sending_information_to_the_server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });
    this.contentService
      .ServiceAdd(this.dataModel)
      .subscribe({
        next: async (ret) => {
          this.publicHelper.processService.processStop(pName);
          this.formInfo.formSubmitAllow = !ret.isSuccess;
          this.dataModelResult = ret;
          if (ret.isSuccess) {
            this.translate.get('MESSAGE.registration_completed_successfully').subscribe((str: string) => { this.formInfo.formAlert = str; });
            this.cmsToastrService.typeSuccessAdd();
            await this.DataActionAfterAddContentSuccessfulTag(this.dataModelResult.item);
            await this.DataActionAfterAddContentSuccessfulSimilar(this.dataModelResult.item);
            await this.DataActionAfterAddContentSuccessfulOtherInfo(this.dataModelResult.item);
            setTimeout(() => this.router.navigate(['/news/content/']), 1000);
          } else {
            this.cmsToastrService.typeErrorAdd(ret.errorMessage);
          }
          this.publicHelper.processService.processStop(pName);
        },
        error: (err) => {
          this.publicHelper.processService.processStop(pName);
          this.formInfo.formSubmitAllow = true;
          this.cmsToastrService.typeErrorAdd(err);
        }
      }
      );
  }
  DataActionAfterAddContentSuccessfulTag(model: NewsContentModel): Promise<any> {
    if (!this.tagDataModel || this.tagDataModel.length === 0) {
      return null;
    }
    const dataListAdd = new Array<NewsContentTagModel>();
    this.tagDataModel.forEach(x => {
      const row = new NewsContentTagModel();
      row.linkContentId = model.id;
      row.linkTagId = x.id;
      dataListAdd.push(row);
    });
    return firstValueFrom(this.contentTagService.ServiceAddBatch(dataListAdd)).then(
      (response) => {
        if (response.isSuccess) {
          this.cmsToastrService.typeSuccessAddTag();
        } else {
          this.cmsToastrService.typeErrorAddTag();
        }
        console.log(response.listItems);
        return of(response);
      });
  }
  DataActionAfterAddContentSuccessfulOtherInfo(model: NewsContentModel): Promise<any> {
    if (!this.otherInfoDataModel || this.otherInfoDataModel.length === 0) {
      return null;
    }
    this.otherInfoDataModel.forEach(x => {
      x.linkContentId = model.id;
    });
    const pName = this.constructor.name + 'contentOtherInfoService.ServiceAddBatch';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });
    return firstValueFrom(this.contentOtherInfoService.ServiceAddBatch(this.otherInfoDataModel)).then(
      (ret) => {
        if (ret.isSuccess) {
          this.cmsToastrService.typeSuccessAddOtherInfo();
        } else {
          this.cmsToastrService.typeErrorAddOtherInfo();
        }
        return of(ret);
      },
      (err) => {
        this.publicHelper.processService.processStop(pName);

        this.formInfo.formSubmitAllow = true;
        this.cmsToastrService.typeErrorAdd(err);
      }
    );
  }
  async DataActionAfterAddContentSuccessfulSimilar(model: NewsContentModel): Promise<any> {
    if (!this.similarDataModel || this.similarDataModel.length === 0) {
      return null;
    }
    const dataList: NewsContentSimilarModel[] = [];
    this.similarDataModel.forEach(x => {
      const row = new NewsContentSimilarModel();
      row.linkSourceId = model.id;
      row.linkDestinationId = x.id;
      dataList.push(row);
    });
    const pName = this.constructor.name + 'contentSimilarService.ServiceAddBatch';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });
    return firstValueFrom(this.contentSimilarService.ServiceAddBatch(dataList)).then(

      (ret) => {
        if (ret.isSuccess) {
          this.cmsToastrService.typeSuccessAddSimilar();
        } else {
          this.cmsToastrService.typeErrorAddSimilar();
        }
        return of(ret);
      },
      (err) => {
        this.publicHelper.processService.processStop(pName);
        this.formInfo.formSubmitAllow = true;
        this.cmsToastrService.typeErrorAdd(err);

      }
    );
  }
  onActionSelectorSelect(model: NewsCategoryModel | null): void {
    if (!model || model.id <= 0) {
      this.translate.get('MESSAGE.category_of_information_is_not_clear').subscribe((str: string) => { this.cmsToastrService.typeErrorSelected(str); });
      return;
    }
    this.dataModel.linkCategoryId = model.id;
  }
  onActionContentSimilarSelect(model: NewsContentModel | null): void {
    if (!model || model.id <= 0) {
      return;
    }
    this.contentSimilarSelected = model;
  }
  onActionContentSimilarAddToLIst(): void {
    if (!this.contentSimilarSelected || this.contentSimilarSelected.id <= 0) {
      return;
    }
    if (this.similarDataModel.find(x => x.id === this.contentSimilarSelected.id)) {
      this.cmsToastrService.typeErrorAddDuplicate();
      return;
    }
    this.similarDataModel.push(this.contentSimilarSelected);
    this.similarTabledataSource.data = this.similarDataModel;
  }
  onActionContentSimilarRemoveFromLIst(model: NewsContentModel | null): void {
    if (!model || model.id <= 0) {
      return;
    }
    if (!this.similarDataModel || this.similarDataModel.length === 0) {
      return;
    }
    const retOut = new Array<NewsContentModel>();
    this.similarDataModel.forEach(x => {
      if (x.id !== model.id) {
        retOut.push(x);
      }
    });
    this.similarDataModel = retOut;
    this.similarTabledataSource.data = this.similarDataModel;
  }
  onActionContentOtherInfoAddToLIst(): void {
    if (!this.contentOtherInfoSelected) {
      return;
    }
    if (this.otherInfoDataModel.find(x => x.title === this.contentOtherInfoSelected.title)) {
      this.cmsToastrService.typeErrorAddDuplicate();
      return;
    }
    this.otherInfoDataModel.push(this.contentOtherInfoSelected);
    this.contentOtherInfoSelected = new NewsContentOtherInfoModel();
    this.otherInfoTabledataSource.data = this.otherInfoDataModel;
  }
  onActionContentOtherInfoRemoveFromLIst(index: number): void {
    if (index < 0) {
      return;
    }
    if (!this.otherInfoDataModel || this.otherInfoDataModel.length === 0) {
      return;
    }
    this.otherInfoDataModel.splice(index, 1);
    this.otherInfoTabledataSource.data = this.otherInfoDataModel;
  }
  onActionContentOtherInfoEditFromLIst(index: number): void {
    if (index < 0) {
      return;
    }
    if (!this.otherInfoDataModel || this.otherInfoDataModel.length === 0) {
      return;
    }
    this.contentOtherInfoSelected = this.otherInfoDataModel[index];
    this.otherInfoDataModel.splice(index, 1);
    this.otherInfoTabledataSource.data = this.otherInfoDataModel;
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
  onActionBackToParent(): void {
    this.router.navigate(['/news/content/']);
  }


  onActionSelectorLocation(model: CoreLocationModel | null): void {
    if (!model || !model.id || model.id <= 0) {
      this.translate.get('MESSAGE.Information_area_deleted').subscribe((str: string) => { this.cmsToastrService.typeWarningSelected(str); });
      this.dataModel.linkLocationId = null;
      return;
    }
    this.dataModel.linkLocationId = model.id;
  }

  /**
* tag
*/
  addOnBlurTag = true;
  readonly separatorKeysCodes = [ENTER] as const;
  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Add our item
    if (value) {
      this.keywordDataModel.push(value);
    }
    // Clear the input value
    event.chipInput!.clear();
  }

  removeTag(item: string): void {
    const index = this.keywordDataModel.indexOf(item);

    if (index >= 0) {
      this.keywordDataModel.splice(index, 1);
    }
  }
  /**
   * tag
   */
}
