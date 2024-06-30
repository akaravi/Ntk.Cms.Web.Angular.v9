
import {
  ChangeDetectorRef, Component, Inject, OnInit,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  CoreEnumService, CoreGuideModel, CoreGuideService, DataFieldInfoModel, ErrorExceptionResult,
  FormInfoModel
} from 'ntk-cms-api';
import { NodeInterface, TreeModel } from 'ntk-cms-filemanager';
import { AddBaseComponent } from 'src/app/core/cmsComponent/addBaseComponent';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-core-guide-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class CoreGuideAddComponent extends AddBaseComponent<CoreGuideService, CoreGuideModel, number> implements OnInit {
  requestParentId = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CoreGuideAddComponent>,
    public coreEnumService: CoreEnumService,
    public coreGuideService: CoreGuideService,
    private cmsToastrService: CmsToastrService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {
    super(coreGuideService, new CoreGuideModel(), publicHelper);
    this.publicHelper.processService.cdr = this.cdr;
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => { this.loading.message = str; });
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
    if (data) {
      this.requestParentId = +data.parentId || 0;
    }
    if (this.requestParentId > 0) {
      this.dataModel.linkParentId = this.requestParentId;
    }
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();


  dataModelResult: ErrorExceptionResult<CoreGuideModel> = new ErrorExceptionResult<CoreGuideModel>();
  dataModel: CoreGuideModel = new CoreGuideModel();


  formInfo: FormInfoModel = new FormInfoModel();


  selectFileTypePodcast = ['mp3'];
  selectFileTypeMovie = ['mp4', 'webm'];

  fileManagerTree: TreeModel;

  appLanguage = 'fa';
  fileManagerOpenForm = false;
  fileManagerOpenFormPodcastFa = false;
  fileManagerOpenFormMovieFa = false;
  fileManagerOpenFormPodcastEn = false;
  fileManagerOpenFormMovieEn = false;
  fileManagerOpenFormPodcastAr = false;
  fileManagerOpenFormMovieAr = false;
  fileManagerOpenFormPodcastDe = false;
  fileManagerOpenFormMovieDe = false;



  ngOnInit(): void {
    this.translate.get('TITLE.ADD').subscribe((str: string) => { this.formInfo.formTitle = str; });

    this.DataGetAccess();

  }





  DataAddContent(): void {
    this.translate.get('MESSAGE.sending_information_to_the_server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.publicHelper.processService.processStart(pName);

    this.coreGuideService.ServiceAdd(this.dataModel).subscribe({
      next: (ret) => {
        this.formInfo.formSubmitAllow = true;
        this.dataModelResult = ret;
        if (ret.isSuccess) {
          this.translate.get('MESSAGE.registration_completed_successfully').subscribe((str: string) => { this.formInfo.formAlert = str; });
          this.cmsToastrService.typeSuccessAdd();
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
        this.publicHelper.processService.processStop(pName,false);
      }
    }
    );
  }
  onActionSelectorSelect(model: CoreGuideModel): void {
    this.dataModel.linkParentId = null;
    if (model && model.id > 0) {
      this.dataModel.linkParentId = model.id;
    }
  }
  onActionFileSelectedlinkFilePodcastIdFa(model: NodeInterface): void {
    this.dataModel.linkFilePodcastIdFa = model.id;
    this.dataModel.linkFilePodcastIdFaSrc = model.downloadLinksrc;
  }
  onActionFileSelectedlinkFileMovieIdFa(model: NodeInterface): void {
    this.dataModel.linkFileMovieIdFa = model.id;
    this.dataModel.linkFileMovieIdFaSrc = model.downloadLinksrc;
  }
  onActionFileSelectedlinkFilePodcastIdEn(model: NodeInterface): void {
    this.dataModel.linkFilePodcastIdEn = model.id;
    this.dataModel.linkFilePodcastIdEnSrc = model.downloadLinksrc;
  }
  onActionFileSelectedlinkFileMovieIdEn(model: NodeInterface): void {
    this.dataModel.linkFileMovieIdEn = model.id;
    this.dataModel.linkFileMovieIdEnSrc = model.downloadLinksrc;
  }
  onActionFileSelectedlinkFilePodcastIdAr(model: NodeInterface): void {
    this.dataModel.linkFilePodcastIdAr = model.id;
    this.dataModel.linkFilePodcastIdArSrc = model.downloadLinksrc;
  }
  onActionFileSelectedlinkFileMovieIdAr(model: NodeInterface): void {
    this.dataModel.linkFileMovieIdAr = model.id;
    this.dataModel.linkFileMovieIdArSrc = model.downloadLinksrc;
  }
  onActionFileSelectedlinkFilePodcastIdDe(model: NodeInterface): void {
    this.dataModel.linkFilePodcastIdDe = model.id;
    this.dataModel.linkFilePodcastIdDeSrc = model.downloadLinksrc;
  }
  onActionFileSelectedlinkFileMovieIdDe(model: NodeInterface): void {
    this.dataModel.linkFileMovieIdDe = model.id;
    this.dataModel.linkFileMovieIdDeSrc = model.downloadLinksrc;
  }
  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    this.formInfo.formSubmitAllow = false;

    this.DataAddContent();


  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}
