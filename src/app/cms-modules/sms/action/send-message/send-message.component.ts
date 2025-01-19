import {
  ChangeDetectorRef, Component, ElementRef, OnInit,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CronOptionModel, TranslateUiService } from 'ngx-ntk-cron-editor';
import {
  CoreEnumService, ErrorExceptionResult, FormInfoModel, SmsApiSendMessageDtoModel,
  SmsApiSendResultModel, SmsMainApiNumberModel, SmsMainApiPathModel, SmsMainApiPathService, SmsMainMessageCategoryModel,
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
  selector: 'app-sms-action-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.scss'],
})
export class SmsActionSendMessageComponent implements OnInit {
  requestLinkApiPathId = '';
  constructorInfoAreaId = this.constructor.name;
  constructor(
    public coreEnumService: CoreEnumService,
    public smsMainApiPathService: SmsMainApiPathService,
    private activatedRoute: ActivatedRoute,
    private cmsToastrService: CmsToastrService,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
    public translate: TranslateService,
    private router: Router,
    private tokenHelper: TokenHelper,
    private translateUiService: TranslateUiService,
  ) {
    this.publicHelper.processService.cdr = this.cdr;


    this.requestLinkApiPathId = this.activatedRoute.snapshot.paramMap.get('LinkApiPathId');
    if (this.requestLinkApiPathId?.length > 0) {
      this.dataModel.linkApiPathId = this.requestLinkApiPathId;
    }
    this.dataModel.scheduleCron = "";

    if (this.router && this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras.state != null) {
      this.receiverNumber = this.router.getCurrentNavigation().extras.state.ReceiverNumber;
      this.senderNumber = this.router.getCurrentNavigation().extras.state.SenderNumber;
      this.linkApiPathId = this.router.getCurrentNavigation().extras.state.LinkApiPathId;
      this.linkNumberId = this.router.getCurrentNavigation().extras.state.LinkNumberId;
    }
    this.tokenHelper.getTokenInfoState().then((value) => {
      this.tokenInfo = value;
      this.language = this.tokenInfo.language;
    });

    let dateTime = new Date();
    this.timezoneOffset = dateTime.getTimezoneOffset();
  }
  timezoneOffset = 0;
  tokenInfo = new TokenInfoModel();
  language = 'en';
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  @ViewChild('Message') message: ElementRef;

  receiverNumber: string = '';
  senderNumber: string = '';
  linkApiPathId: string = '';
  linkNumberId: string = '';


  dataModelParentSelected: SmsMainApiPathModel = new SmsMainApiPathModel();
  dataModel: SmsApiSendMessageDtoModel = new SmsApiSendMessageDtoModel();
  dataModelResult: ErrorExceptionResult<SmsApiSendResultModel> = new ErrorExceptionResult<SmsApiSendResultModel>();
  dataModelDateByClockStart: DateByClock = new DateByClock();
  dataModelDateByClockExpire: DateByClock = new DateByClock();
  formInfo: FormInfoModel = new FormInfoModel();
  clipboardText = '';


  // Hangfire 1.7+ compatible expression: '3 2 12 1/1 ?'
  // Quartz compatible expression: '4 3 2 12 1/1 ? *'
  //public cronExpression = '0 12 1W 1/1 ?';
  public isCronDisabled = false;
  public cronOptions: CronOptionModel = {
    formInputClass: 'form-control cron-editor-input',
    formSelectClass: 'form-control cron-editor-select',
    formRadioClass: 'cron-editor-radio',
    formCheckboxClass: 'cron-editor-checkbox',

    defaultTime: '10:00:00',
    use24HourTime: true,

    hideMinutesTab: false,
    hideHourlyTab: false,
    hideDailyTab: false,
    hideWeeklyTab: false,
    hideMonthlyTab: false,
    hideYearlyTab: false,
    hideAdvancedTab: false,

    hideSeconds: true,
    removeSeconds: true,
    removeYears: true
  };



  ngOnInit(): void {
    //this.readClipboardFromDevTools().then((r) => this.clipboardText = r as string);
    this.onActionScheduleSendNow();

    if (this.linkApiPathId && this.linkApiPathId?.length > 0)
      this.dataModel.linkApiPathId = this.linkApiPathId;
    if (this.receiverNumber && this.receiverNumber?.length > 0)
      this.dataModel.toNumbers = this.receiverNumber;
    if (this.senderNumber && this.senderNumber?.length > 0)
      this.dataModel.linkFromNumber = this.senderNumber;
  }

  onActionScheduleSendNow() {
    const now = new Date();
    this.dataModel.scheduleSendStart = now;
    this.dataModelDateByClockStart.clock = now.getHours() + ':' + now.getMinutes();
    this.dataModelDateByClockStart.date = now;



    this.dataModel.scheduleSendExpire = now;
    this.dataModelDateByClockExpire.clock = now.getHours() + ':' + now.getMinutes();
    this.dataModelDateByClockExpire.date = now;
  }
  onActionScheduleSendCheck() {
    /**Start */
    var now = new Date();
    if (!this.dataModelDateByClockStart.date)
      this.dataModelDateByClockStart.date = now;
    if (!this.dataModelDateByClockStart.clock)
      this.dataModelDateByClockStart.clock = now.getHours() + ':' + now.getMinutes();

    this.dataModelDateByClockStart.date = new Date(this.dataModelDateByClockStart.date);
    this.dataModelDateByClockStart.date.setHours(+this.dataModelDateByClockStart.clock.split(':')[0] | 0, +this.dataModelDateByClockStart.clock.split(':')[1] | 0)

    this.dataModel.scheduleSendStart = this.dataModelDateByClockStart.date;
    if (this.dataModel.scheduleSendStart > this.dataModel.scheduleSendExpire)
      now = this.dataModel.scheduleSendStart;
    /**Expire */

    now.setMinutes(now.getMinutes() + 60 * 3);
    if (!this.dataModelDateByClockExpire.date || this.dataModel.scheduleSendStart > this.dataModel.scheduleSendExpire)
      this.dataModelDateByClockExpire.date = now;
    if (!this.dataModelDateByClockExpire.clock || this.dataModel.scheduleSendStart > this.dataModel.scheduleSendExpire)
      this.dataModelDateByClockExpire.clock = now.getHours() + ':' + now.getMinutes();

    this.dataModelDateByClockExpire.date = new Date(this.dataModelDateByClockExpire.date);
    this.dataModelDateByClockExpire.date.setHours(+this.dataModelDateByClockExpire.clock.split(':')[0] | 0, +this.dataModelDateByClockExpire.clock.split(':')[1] | 0)

    this.dataModel.scheduleSendExpire = this.dataModelDateByClockExpire.date;

    if (this.dataModel.scheduleSendStart > this.dataModel.scheduleSendExpire) {
      now = this.dataModel.scheduleSendStart;
      now.setMinutes(now.getMinutes() + 60 * 3);
      this.dataModelDateByClockExpire.date = now;
      this.dataModelDateByClockExpire.clock = now.getHours() + ':' + now.getMinutes();
      this.dataModelDateByClockExpire.date = new Date(this.dataModelDateByClockExpire.date);
      this.dataModelDateByClockExpire.date.setHours(+this.dataModelDateByClockExpire.clock.split(':')[0] | 0, +this.dataModelDateByClockExpire.clock.split(':')[1] | 0);
      this.dataModel.scheduleSendExpire = this.dataModelDateByClockExpire.date;
      this.cmsToastrService.typeWarningMessage(this.translate.instant('MESSAGE.Warning_ClockStart_Bigger_Than_ClockExpire'));
    }
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
  onActionSelectPrivateSiteConfig(model: SmsMainApiPathModel): void {
    this.dataModel.linkApiPathId = this.requestLinkApiPathId;
    this.dataModelParentSelected = model;
    if (model && model.id.length > 0) {
      this.dataModel.linkApiPathId = model.id;
      this.dataModel.linkFromNumber = null;

    }
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


  onActionSelectApiNumber(model: SmsMainApiNumberModel): void {
    if (model && model.id.length > 0) {
      this.dataModel.linkFromNumber = model.id;
    }
  }
  onActionMessageContentAdd() {
    if (this.dataMessageContentModel?.messageBody?.length > 0) {
      if (this.dataModel.message.length > 0)
        this.dataModel.message = this.dataModel.message + ' ' + this.dataMessageContentModel.messageBody
    }
    else {
      this.dataModel.message = this.dataMessageContentModel.messageBody
    }
  }
  onActionMessageContentNew() {
    if (this.dataMessageContentModel?.messageBody?.length > 0) {
      this.dataModel.message = this.dataMessageContentModel.messageBody
    }
  }

  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    if (!this.dataModel.linkApiPathId || this.dataModel.linkApiPathId.length <= 0) {
      this.cmsToastrService.typeErrorFormInvalid();
    }
    this.onActionScheduleSendCheck();

    this.formInfo.formSubmitAllow = false;
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });

    this.formInfo.formAlert = '';
    this.formInfo.formError = '';
    // this.dataModel.scheduleSendStart.setMinutes(this.dataModel.scheduleSendStart.getMinutes() + this.timezoneOffset);
    // this.dataModel.scheduleSendExpire.setMinutes(this.dataModel.scheduleSendExpire.getMinutes() + this.timezoneOffset);
    //this.dataModel.scheduleSendStart=new Date(this.dataModel.scheduleSendStart.getTime() + this.timezoneOffset*60*1000);
    //this.dataModel.scheduleSendExpire=new Date(this.dataModel.scheduleSendExpire.getTime() + this.timezoneOffset*60*1000);

    this.smsMainApiPathService.ServiceSendMessage(this.dataModel).subscribe({
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

  onActionContactCategorySelectChecked(model: string): void {
    if (!model || model.length <= 0) {
      this.translate.get('MESSAGE.category_of_information_is_not_clear').subscribe((str: string) => { this.cmsToastrService.typeErrorSelected(str); });
      return;
    }
    if (!this.dataModel.toContactCategories)
      this.dataModel.toContactCategories = [];
    if (!this.dataModel.toContactContents)
      this.dataModel.toContactContents = [];
    this.publicHelper.listAddIfNotExist(this.dataModel.toContactCategories, model, 0);
    if (this.dataModel.toContactCategories.length > 0 || this.dataModel.toContactContents.length > 0) {
      this.dataModel.toNumbers = '';
    }
  }
  onActionContactCategorySelectDisChecked(model: string): void {
    if (!model || model.length <= 0) {
      this.translate.get('MESSAGE.category_of_information_is_not_clear').subscribe((str: string) => { this.cmsToastrService.typeErrorSelected(str); });
      return;
    }
    if (!this.dataModel.toContactCategories)
      this.dataModel.toContactCategories = [];
    if (!this.dataModel.toContactContents)
      this.dataModel.toContactContents = [];
    this.publicHelper.listRemoveIfExist(this.dataModel.toContactCategories, model);
    if (this.dataModel.toContactCategories.length > 0 || this.dataModel.toContactContents.length > 0) {
      this.dataModel.toNumbers = '';
    }
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
