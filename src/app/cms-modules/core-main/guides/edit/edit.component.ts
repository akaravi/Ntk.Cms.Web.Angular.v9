
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import {
  ChangeDetectorRef, Component, Inject, OnInit,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { TranslateService } from '@ngx-translate/core';
import {
  AccessModel, CoreEnumService, CoreGuideModel, CoreGuideService,
  ErrorExceptionResultBase,
  FormInfoModel,
  ManageUserAccessDataTypesEnum
} from 'ntk-cms-api';
import { NodeInterface, TreeModel } from 'ntk-cms-filemanager';
import { EditBaseComponent } from 'src/app/core/cmsComponent/editBaseComponent';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-core-guide-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class CoreGuideEditComponent extends EditBaseComponent<CoreGuideService, CoreGuideModel, number>
  implements OnInit {
  requestId = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CoreGuideEditComponent>,
    public coreEnumService: CoreEnumService,
    public coreGuideService: CoreGuideService,
    private cmsToastrService: CmsToastrService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {
    super(coreGuideService, new CoreGuideModel(), publicHelper);

    this.loading.cdr = this.cdr;
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => { this.loading.message = str; });
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
    if (data) {
      this.requestId = +data.id || 0;
    }

  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;


  appLanguage = 'fa';


  dataModelResult: ErrorExceptionResultBase = new ErrorExceptionResultBase();
  dataModel: CoreGuideModel = new CoreGuideModel();

  formInfo: FormInfoModel = new FormInfoModel();

  dataAccessModel: AccessModel;

  selectFileTypePodcast = ['mp3'];
  selectFileTypeMovie = ['mp4', 'webm'];

  fileManagerTree: TreeModel;

  fileManagerOpenForm = false;
  fileManagerOpenFormPodcastFa = false;
  fileManagerOpenFormMovieFa = false;
  fileManagerOpenFormPodcastEn = false;
  fileManagerOpenFormMovieEn = false;
  fileManagerOpenFormPodcastAr = false;
  fileManagerOpenFormMovieAr = false;
  fileManagerOpenFormPodcastDe = false;
  fileManagerOpenFormMovieDe = false;

  dataCoreGuideIds: number[] = [];

  ngOnInit(): void {
    if (this.requestId > 0) {
      this.translate.get('TITLE.Edit').subscribe((str: string) => { this.formInfo.formTitle = str; });
      this.DataGetOneContent();
    } else {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }


  }


  DataGetOneContent(): void {
    if (this.requestId <= 0) {
      this.cmsToastrService.typeErrorEditRowIsNull();
      return;
    }

    this.translate.get('MESSAGE.Receiving_Information_From_The_Server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.publicHelper.processService.processStart(pName);

    /*َAccess Field*/
    this.coreGuideService.setAccessLoad();
    this.coreGuideService.setAccessDataType(ManageUserAccessDataTypesEnum.Editor);
    this.coreGuideService.ServiceGetOneById(this.requestId).subscribe({
      next: (ret) => {
        /*َAccess Field*/
        this.dataAccessModel = ret.access;
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
        this.dataModel = ret.item;
        if (ret.isSuccess) {
          this.formInfo.formTitle = this.formInfo.formTitle + ' ' + ret.item.titleFa;
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
        this.publicHelper.processService.processStop(pName);
      }
    }
    );
  }

  DataEditContent(): void {
    this.translate.get('MESSAGE.sending_information_to_the_server').subscribe((str: string) => { this.formInfo.formAlert = str; });
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.sending_information_to_the_server').subscribe((str: string) => { this.publicHelper.processService.processStart(pName, str); });

    this.coreGuideService.ServiceEdit(this.dataModel).subscribe({
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
        this.publicHelper.processService.processStop(pName);
      }
    }
    );
  }

  onActionFileSelectedLinkFilePodcastIdFa(model: NodeInterface): void {
    this.dataModel.linkFilePodcastIdFa = model.id;
    this.dataModel.linkFilePodcastIdFaSrc = model.downloadLinksrc;
  }
  onActionFileSelectedLinkFileMovieIdFa(model: NodeInterface): void {
    this.dataModel.linkFileMovieIdFa = model.id;
    this.dataModel.linkFileMovieIdFaSrc = model.downloadLinksrc;
  }
  onActionFileSelectedLinkFilePodcastIdEn(model: NodeInterface): void {
    this.dataModel.linkFilePodcastIdEn = model.id;
    this.dataModel.linkFilePodcastIdEnSrc = model.downloadLinksrc;
  }
  onActionFileSelectedLinkFileMovieIdEn(model: NodeInterface): void {
    this.dataModel.linkFileMovieIdEn = model.id;
    this.dataModel.linkFileMovieIdEnSrc = model.downloadLinksrc;
  }
  onActionFileSelectedLinkFilePodcastIdAr(model: NodeInterface): void {
    this.dataModel.linkFilePodcastIdAr = model.id;
    this.dataModel.linkFilePodcastIdArSrc = model.downloadLinksrc;
  }
  onActionFileSelectedLinkFileMovieIdAr(model: NodeInterface): void {
    this.dataModel.linkFileMovieIdAr = model.id;
    this.dataModel.linkFileMovieIdArSrc = model.downloadLinksrc;
  }
  onActionFileSelectedLinkFilePodcastIdDe(model: NodeInterface): void {
    this.dataModel.linkFilePodcastIdDe = model.id;
    this.dataModel.linkFilePodcastIdDeSrc = model.downloadLinksrc;
  }
  onActionFileSelectedLinkFileMovieIdDe(model: NodeInterface): void {
    this.dataModel.linkFileMovieIdDe = model.id;
    this.dataModel.linkFileMovieIdDeSrc = model.downloadLinksrc;
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

  onActionSelectorSelect(model: CoreGuideModel): void {
    this.dataModel.linkParentId = null;
    if (model && model.id > 0) {
      this.dataModel.linkParentId = model.id;
    }
  }



}
