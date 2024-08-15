
import {
  ChangeDetectorRef, Component, Input, OnInit
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  CoreEnumService, CoreModuleSaleSerialModel, CoreModuleSaleSerialService, DataFieldInfoModel, ErrorExceptionResult
} from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-core-modulesaleserial-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class CoreModuleSaleSerialHeaderComponent implements OnInit {
  constructorInfoAreaId = this.constructor.name;
  constructor(
    public coreEnumService: CoreEnumService,
    public coreModuleSaleSerialService: CoreModuleSaleSerialService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    private cmsToastrService: CmsToastrService,
    public translate: TranslateService,
  ) {
    this.publicHelper.processService.cdr = this.cdr;

  }
  @Input() optionId = 0;


  dataModelResult: ErrorExceptionResult<CoreModuleSaleSerialModel> = new ErrorExceptionResult<CoreModuleSaleSerialModel>();
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();





  ngOnInit(): void {
    if (this.optionId > 0) {
      this.DataGetOneContent();
    }

  }

  DataGetOneContent(): void {
    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });

    this.coreModuleSaleSerialService.setAccessLoad();
    this.coreModuleSaleSerialService.ServiceGetOneById(this.optionId).subscribe({
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
