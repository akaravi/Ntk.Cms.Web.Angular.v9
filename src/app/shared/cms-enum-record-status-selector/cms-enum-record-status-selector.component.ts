import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  ErrorExceptionResult,
  InfoEnumModel,
  RecordStatusEnum
} from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';


@Component({
  selector: 'app-cms-enum-record-status-selector',
  templateUrl: './cms-enum-record-status-selector.component.html',

})
export class CmsEnumRecordStatusSelectorComponent implements OnInit {
  static nextId = 0;
  id = ++CmsEnumRecordStatusSelectorComponent.nextId;
  constructor(
    public translate: TranslateService,
    public publicHelper: PublicHelper,) {
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
