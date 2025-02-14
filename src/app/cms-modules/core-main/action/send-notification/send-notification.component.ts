import {
  ChangeDetectorRef, Component, ElementRef, OnInit,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import {
  CmsNotificationSendDtoModel,
  CoreEnumService, CoreTokenConnectionModel, CoreTokenConnectionService, ErrorExceptionResult, FormInfoModel, SmsMainApiPathModel, SmsMainMessageCategoryModel,
  SmsMainMessageContentModel,
  TokenInfoModel
} from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
export class DateByClock {
  date: Date;
  clock: string;
}

@Component({
    selector: 'app-core-main-action-send-notification',
    templateUrl: './send-notification.component.html',
    styleUrls: ['./send-notification.component.scss'],
    standalone: false
})
export class CoreMainActionSendNotificationComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor(
    public coreEnumService: CoreEnumService,
    public coreTokenConnectionService: CoreTokenConnectionService,
    private activatedRoute: ActivatedRoute,
    private cmsToastrService: CmsToastrService,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
    public translate: TranslateService,
    private tokenHelper: TokenHelper
  ) {
    this.publicHelper.processService.cdr = this.cdr;


    this.tokenHelper.getTokenInfoState().then((value) => {
      this.tokenInfo = value;
    });
  }
  tokenInfo = new TokenInfoModel();

  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  @ViewChild('Message') message: ElementRef;



  dataModelParentSelected: SmsMainApiPathModel = new SmsMainApiPathModel();
  dataModel: CmsNotificationSendDtoModel = new CmsNotificationSendDtoModel();
  dataModelResult: ErrorExceptionResult<CoreTokenConnectionModel> = new ErrorExceptionResult<CoreTokenConnectionModel>();
  formInfo: FormInfoModel = new FormInfoModel();
  clipboardText = '';





  ngOnInit(): void {

  }


  readClipboardFromDevTools() {
    return new Promise((resolve, reject) => {
      const _asyncCopyFn = (async () => {
        try {
          const value = await navigator.clipboard.readText();
          //console.log(`${value} is read!`);
          resolve(value);
        } catch (e) {
          reject(e);
        }
        window.removeEventListener("focus", _asyncCopyFn);
      });

      window.addEventListener("focus", _asyncCopyFn);
      console.log("Hit <Tab> to give focus back to document (or we will face a DOMException);");
    });
  }

  onActionMessageLTR() {
    this.message.nativeElement.style.direction = "ltr";
    this.message.nativeElement.style.textAlign = "left";
  }

  onActionMessageRTL() {
    this.message.nativeElement.style.direction = "rtl";
    this.message.nativeElement.style.textAlign = "right";
  }

  dataMessageCategoryModel: SmsMainMessageCategoryModel = new SmsMainMessageCategoryModel();
  onActionSelectMessageCategory(model: SmsMainMessageCategoryModel): void {
    if (model && model.id.length > 0) {
      this.dataMessageCategoryModel = model;
    }
    else {
      this.dataMessageCategoryModel = new SmsMainMessageCategoryModel();
    }
  }
  dataMessageContentModel: SmsMainMessageContentModel = new SmsMainMessageContentModel();
  onActionSelectMessageContent(model: SmsMainMessageContentModel): void {
    if (model && model.id.length > 0) {
      this.dataMessageContentModel = model;
    }
    else {
      this.dataMessageContentModel = new SmsMainMessageContentModel();
    }
  }



  onActionMessageContentAdd() {
    if (this.dataMessageContentModel?.messageBody?.length > 0) {
      if (this.dataModel.content.length > 0)
        this.dataModel.content = this.dataModel.content + ' ' + this.dataMessageContentModel.messageBody
    }
    else {
      this.dataModel.content = this.dataMessageContentModel.messageBody
    }
  }
  onActionMessageContentNew() {
    if (this.dataMessageContentModel?.messageBody?.length > 0) {
      this.dataModel.content = this.dataMessageContentModel.messageBody
    }
  }

  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }

    this.formInfo.formSubmitAllow = false;
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });

    this.formInfo.formAlert = '';
    this.formInfo.formError = '';
    this.coreTokenConnectionService.ServiceSendNotification(this.dataModel).subscribe({
      next: (ret) => {
        this.formInfo.formSubmitAllow = true;
        this.dataModelResult = ret;
        if (ret.isSuccess) {
          this.formInfo.formAlert = this.translate.instant('MESSAGE.Submit_request_was_successfully_registered');
          this.cmsToastrService.typeSuccessMessage(this.translate.instant('MESSAGE.Send_request_was_successfully_registered'));
        } else {
          this.translate.get('ERRORMESSAGE.MESSAGE.typeError').subscribe((str: string) => { this.formInfo.formAlert = str; });
          this.formInfo.formError = ret.errorMessage;
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.publicHelper.processService.processStop(pName);
      },
      error: (e) => {
        this.formInfo.formSubmitAllow = true;
        this.cmsToastrService.typeError(e);
        this.publicHelper.processService.processStop(pName, false);

      },
      complete: () => {
        console.info;
      }
    }

    );
  }

  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
}
