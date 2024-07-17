import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cms-qdoc',
  templateUrl: './cms-qdoc.component.html',
})
export class CmsQDocComponent implements OnInit {
  static nextId = 0;
  id = ++CmsQDocComponent.nextId;
  constructor(
    private cmsToastrService: CmsToastrService,
    public http: HttpClient,
    public translate: TranslateService,
  ) { }
  @Input() optionUrl = '';
  QDocModel: any = {};
  otpConfig = {
    allowNumbersOnly: true,
    length: 5,
    isPasswordInput: false,
    disableAutoFocus: true,
    placeholder: '',
    inputStyles: {
      'width': '50px',
      'height': '50px',
      'margin': '5px',
    }
  }
  ngOnInit(): void {
  }
  onActionSendUrlToQDoc(): void {
    this.QDocModel.message = this.optionUrl;
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
        },
        error: (err) => {
          //
          this.cmsToastrService.typeErrorMessage('برروز خطا در ارسال دستور', err);
          //
        }
      });

  }
  onOtpChange(otp) {
    this.QDocModel.username = otp;
  }
}
