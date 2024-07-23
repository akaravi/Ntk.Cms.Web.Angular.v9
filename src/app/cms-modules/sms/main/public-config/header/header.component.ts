
import {
  ChangeDetectorRef, Component, Input, OnInit
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  CoreEnumService, DataFieldInfoModel, ErrorExceptionResult,
  SmsMainApiPathPublicConfigModel, SmsMainApiPathPublicConfigService
} from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-sms-publicconfig-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class SmsMainApiPathPublicConfigHeaderComponent implements OnInit {
  constructor(
    public coreEnumService: CoreEnumService,
    public smsMainApiPathPublicConfigService: SmsMainApiPathPublicConfigService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
    private cmsToastrService: CmsToastrService,
  ) {
    this.publicHelper.processService.cdr = this.cdr;
  }
  @Input() optionId = '';

  dataModelResult: ErrorExceptionResult<SmsMainApiPathPublicConfigModel> = new ErrorExceptionResult<SmsMainApiPathPublicConfigModel>();
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();





  ngOnInit(): void {
    if (this.optionId.length > 0) {
      this.DataGetOneContent();
    }

  }

  DataGetOneContent(): void {
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructor.name);
    });

    this.smsMainApiPathPublicConfigService.setAccessLoad();
    this.smsMainApiPathPublicConfigService.ServiceGetOneById(this.optionId).subscribe({
      next: (ret) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
        if (ret.isSuccess) {
          this.dataModelResult = ret;
        } else {
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
}
