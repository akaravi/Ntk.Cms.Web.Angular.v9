
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CoreEnumService, CoreUserClaimTypeModel, CoreUserClaimTypeService, ErrorExceptionResult, FilterModel } from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';


@Component({
    selector: 'app-core-userclaimtype-selectionlist',
    templateUrl: './selectionlist.component.html',
    styleUrls: ['./selectionlist.component.scss'],
    standalone: false
})
export class CoreUserClaimTypeSelectionlistComponent implements OnInit {

  constructorInfoAreaId = this.constructor.name;
  constructor(
    public coreEnumService: CoreEnumService,
    public categoryService: CoreUserClaimTypeService,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
    public translate: TranslateService,
    private cmsToastrService: CmsToastrService) {
    this.publicHelper.processService.cdr = this.cdr;

  }
  dataModelResult: ErrorExceptionResult<CoreUserClaimTypeModel> = new ErrorExceptionResult<CoreUserClaimTypeModel>();
  dataModelSelect: CoreUserClaimTypeModel[] = [];
  dataIdsSelect: number[] = [];

  formControl = new FormControl();
  fieldsStatus: Map<number, boolean> = new Map<number, boolean>();

  @Input() optionDisabled = false;
  @Input() optionSelectFirstItem = false;
  @Input() optionPlaceholder = '';
  @Output() optionChange = new EventEmitter<CoreUserClaimTypeModel[]>();
  @Output() optionSelectAdded = new EventEmitter();
  @Output() optionSelectRemoved = new EventEmitter();
  @Input() optionReload = () => this.onActionButtonReload();
  @Input() set optionSelectForce(x: number[] | CoreUserClaimTypeModel[]) {
    this.onActionSelectForce(x);
  }

  ngOnInit(): void {
    this.DataGetAll();
  }

  DataGetAll(): void {
    const filterModel = new FilterModel();
    filterModel.rowPerPage = 50;
    filterModel.accessLoad = true;



    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });

    this.categoryService.ServiceGetAll(filterModel).subscribe({
      next: (ret) => {
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
  onActionSelect(value: CoreUserClaimTypeModel): void {
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


  onActionSelectForce(ids: number[] | CoreUserClaimTypeModel[]): void {
    if (typeof ids === typeof Array(Number)) {
      ids.forEach(element => {
        this.dataIdsSelect.push(element);
      });
    } else if (typeof ids === typeof Array(CoreUserClaimTypeModel)) {
      ids.forEach(element => {
        this.dataIdsSelect.push(element.id);
      });
    }
    this.dataIdsSelect.forEach((el) => this.fieldsStatus.set(el, true));
  }

  onActionButtonReload(): void {
    // this.dataModelSelect = new CoreUserClaimTypeModel();
    this.DataGetAll();
  }
}
