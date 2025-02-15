
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CoreEnumService, ErrorExceptionResult, EstateAccountAgencyFilterModel, EstateAccountAgencyModel, EstateAccountAgencyService } from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';


@Component({
    selector: 'app-estate-account-agency-selectionlist',
    templateUrl: './selectionlist.component.html',
    standalone: false
})
export class EstateAccountAgencySelectionlistComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor(
    public coreEnumService: CoreEnumService,
    public categoryService: EstateAccountAgencyService,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
    public translate: TranslateService,
    private cmsToastrService: CmsToastrService) {
    this.publicHelper.processService.cdr = this.cdr;

  }
  dataModelResult: ErrorExceptionResult<EstateAccountAgencyModel> = new ErrorExceptionResult<EstateAccountAgencyModel>();
  dataModelSelect: EstateAccountAgencyModel[] = [];
  dataIdsSelect: string[] = [];

  formControl = new FormControl();
  fieldsStatus: Map<string, boolean> = new Map<string, boolean>();

  @Input() optionDisabled = false;
  @Input() optionSelectFirstItem = false;
  @Input() optionPlaceholder = '';
  @Output() optionChange = new EventEmitter<EstateAccountAgencyModel[]>();
  @Output() optionSelectAdded = new EventEmitter();
  @Output() optionSelectRemoved = new EventEmitter();
  @Input() optionReload = () => this.onActionButtonReload();
  @Input() set optionSelectForce(x: string[] | EstateAccountAgencyModel[]) {
    this.onActionSelectForce(x);
  }

  ngOnInit(): void {
    this.DataGetAll();
  }

  DataGetAll(): void {

    const filterModel = new EstateAccountAgencyFilterModel();
    filterModel.rowPerPage = 50;
    filterModel.accessLoad = true;



    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });

    this.categoryService.ServiceGetAll(filterModel).subscribe({
      next: (ret) => {
        // this.fieldsStatus = new Map<string, boolean>();
        if (ret.isSuccess) {
          this.dataModelResult = ret;
          this.dataModelResult.listItems.forEach((el) => this.fieldsStatus.set(el.id, false));
          this.dataIdsSelect.forEach((el) => this.fieldsStatus.set(el, true));
          this.dataModelResult.listItems.forEach((el) => {
            if (this.fieldsStatus.get(el.id)) {
              this.dataModelSelect.push(el);
            }
          });
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
  onActionSelect(value: EstateAccountAgencyModel): void {
    if (this.fieldsStatus.get(value.id)) {
      this.fieldsStatus.set(value.id, false);
      this.optionSelectRemoved.emit(value);
      this.dataModelSelect.splice(this.dataModelSelect.indexOf(value), 1);
    } else {
      this.fieldsStatus.set(value.id, true);
      this.optionSelectAdded.emit(value);
      this.dataModelSelect.push(value);
    }
    this.optionChange.emit(this.dataModelSelect);
  }


  onActionSelectForce(ids: string[] | EstateAccountAgencyModel[]): void {
    if (typeof ids === typeof Array(String)) {
      ids.forEach(element => {
        this.dataIdsSelect.push(element);
      });
    } else if (typeof ids === typeof Array(EstateAccountAgencyModel)) {
      ids.forEach(element => {
        this.dataIdsSelect.push(element.id);
      });
    }
    this.dataIdsSelect.forEach((el) => this.fieldsStatus.set(el, true));
  }

  onActionButtonReload(): void {
    // this.dataModelSelect = new EstateAccountAgencyModel();
    this.DataGetAll();
  }
}
