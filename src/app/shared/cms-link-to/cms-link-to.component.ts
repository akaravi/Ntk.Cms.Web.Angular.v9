import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FormInfoModel, SmsApiSendMessageDtoModel, SmsMainApiNumberModel, SmsMainApiPathModel, SmsMainApiPathService, TokenInfoModel } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-cms-link-to',
    templateUrl: './cms-link-to.component.html',
    styleUrls: ['./cms-link-to.component.scss'],
    standalone: false
})
export class CmsLinkToComponent implements OnInit {
  static nextId = 0;
  id = ++CmsLinkToComponent.nextId;
  constructorInfoAreaId = this.constructor.name;
  constructor(private cmsToastrService: CmsToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CmsLinkToComponent>,
    public smsMainApiPathService: SmsMainApiPathService,
    public http: HttpClient,
    private router: Router,
    public translate: TranslateService,
    private tokenHelper: TokenHelper,
    public publicHelper: PublicHelper,
  ) {
    if (data) {
      this.optionLabel = data.title;
      this.optionurlViewContentQRCodeBase64 = data.urlViewContentQRCodeBase64;
      this.optionurlViewContent = data.urlViewContent;
      this.formInfo.formTitle = data.title;
    }
    this.formInfo.formDescription = "محتوا را اشتراک بگذارید";
  }
  dataModel: SmsApiSendMessageDtoModel = new SmsApiSendMessageDtoModel();

  formInfo: FormInfoModel = new FormInfoModel();

  tokenInfo = new TokenInfoModel();


  @ViewChild('Message') message: ElementRef;
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  @Input() optionLabel = '';
  @Input() optionurlViewContentQRCodeBase64 = '';
  @Input() optionurlViewContent = '';
  QDocModel: any = {};
  cmsApiStoreSubscribe: Subscription;
  ngOnInit(): void {
    this.dataModel.message = `${this.optionLabel}
    ${this.optionurlViewContent}`;

    this.tokenHelper.getTokenInfoState().then((value) => {
      this.tokenInfo = value;
    });
    this.cmsApiStoreSubscribe = this.tokenHelper.getTokenInfoStateOnChange().subscribe({
      next: (ret) => {
        this.tokenInfo = ret;
      }
    });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  onActionSelectApiNumber(model: SmsMainApiNumberModel): void {
    if (model && model.id?.length > 0) {
      this.dataModel.linkFromNumber = model.id;
    }
    else if (model && model.numberChar?.length > 0) {
      this.dataModel.linkFromNumber = model.numberChar;
    }

  }
  onActionMessageLTR() {
    this.message.nativeElement.style.direction = "ltr";
    this.message.nativeElement.style.textAlign = "left";
  }

  onActionMessageRTL() {
    this.message.nativeElement.style.direction = "rtl";
    this.message.nativeElement.style.textAlign = "right";
  }
  sendByShow = false;
  dataModelParentSelected: SmsMainApiPathModel;

  onActionSelectPrivateSiteConfig(model: SmsMainApiPathModel): void {
    this.dataModelParentSelected = model;
    // if (model && model.id.length > 0) {
    //   this.dataModel.linkApiPathId = model.id;
    //   this.dataModel.linkFromNumber = null;
    // }
    if (model && model.id.length > 0) {
      this.dataModel.linkApiPathId = model.id;
      this.sendByShow = false;
      if (model.apiAbilitySendByDirect)
        this.dataModel.sendByQueue = false;
      if (model.apiAbilitySendByQueue)
        this.dataModel.sendByQueue = true;
      if (model.apiAbilitySendByQueue && model.apiAbilitySendByDirect)
        this.sendByShow = true;
    }
  }

  onActionSendUrlToQDoc(): void {
    this.QDocModel.message = this.optionurlViewContent;
    if (!this.QDocModel.username && this.QDocModel.username.length <= 0) {
      const message = 'کد شناسه را از وبسایت https://Qdoc.ir دریافت نمایید';
      this.cmsToastrService.typeWarningSelected(message);
      return;
    }
    this.http.post(environment.cmsServerConfig.configQDocServerPath, this.QDocModel, {
      headers: {},
    })
      .subscribe({
        next: (ret: any) => {
          this.cmsToastrService.typeSuccessMessage(this.translate.instant('MESSAGE.The_order_was_sent_to_the_website'));
        }, error: (err) => {

          this.cmsToastrService.typeErrorMessage('برروز خطا در ارسال دستور', err);

        }
      });
  }

  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    if (!this.dataModel.linkApiPathId || this.dataModel.linkApiPathId.length <= 0) {
      this.cmsToastrService.typeErrorFormInvalid();
    }

    this.formInfo.formSubmitAllow = false;
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });

    this.formInfo.formAlert = '';
    this.formInfo.formError = '';
    this.smsMainApiPathService.ServiceSendMessage(this.dataModel).subscribe({
      next: (ret) => {
        this.formInfo.formSubmitAllow = true;
        // this.dataModelResult = ret;
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

  onActionCopied(): void {
    this.cmsToastrService.typeSuccessCopedToClipboard();
  }
  onActionOpenLink(): void {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([this.optionurlViewContent])
    );
    window.open(this.optionurlViewContent, '_blank');
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });

  }
}
