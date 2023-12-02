import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  ClauseTypeEnum, InfoEnumModel,
  CoreCurrencyService, CoreEnumService, ErrorExceptionResult,
  FilterDataModel, FilterDataModelSearchTypesEnum, FilterModel, ManageUserAccessDataTypesEnum, RecordStatusEnum
} from 'ntk-cms-api';
import { firstValueFrom, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';


@Component({
  selector: 'app-cms-record-status-selector',
  templateUrl: './cms-record-status-selector.component.html',

})
export class CmsRecordStatusSelectorComponent implements OnInit {
  static nextId = 0;
  id = ++CmsRecordStatusSelectorComponent.nextId;
  constructor(
    public translate: TranslateService,
    private publicHelper: PublicHelper,) {

  }
  @Input()
  set model(value: RecordStatusEnum) {
    this.privateModelDate = value;
  }
  @Output() modelChange: EventEmitter<RecordStatusEnum> = new EventEmitter<RecordStatusEnum>();
  dataModelResult: ErrorExceptionResult<InfoEnumModel> = new ErrorExceptionResult<InfoEnumModel>();

  @Input() optionDisabled = false;
  @Input() optionSelectFirstItem = false;
  @Input() optionLabel = '';
  @Input() optionRequired = false;

  ngOnInit(): void {
    this.loadOptions();
  }
  async loadOptions(): Promise<void> {
    this.dataModelResult = await this.publicHelper.getEnumRecordStatus();
  }


  private privateModelDate: RecordStatusEnum;
  get modelDate(): RecordStatusEnum {
    return this.privateModelDate;
  }
  set modelDate(value: RecordStatusEnum) {
    this.privateModelDate = value;
    this.modelChange.emit(value);
  }
}
