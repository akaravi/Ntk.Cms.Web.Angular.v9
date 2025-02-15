import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  ErrorExceptionResult,
  InfoEnumModel,
} from 'ntk-cms-api';


@Component({
    selector: 'app-cms-enum-x-selector',
    templateUrl: './cms-enum-x-selector.component.html',
    standalone: false
})
export class CmsEnumXSelectorComponent implements OnInit {
  static nextId = 0;
  id = ++CmsEnumXSelectorComponent.nextId;
  constructor(
    public translate: TranslateService,) {
  }
  @Input()
  set model(value: any) {
    this.privateModelDate = value;
  }
  @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();
  dataModelResult: ErrorExceptionResult<InfoEnumModel> = new ErrorExceptionResult<InfoEnumModel>();

  @Input() optionDisabled = false;
  @Input() optionSelectFirstItem = false;
  @Input() optionLabel = '';
  @Input() optionRequired = false;
  @Input() optionDataListResult = new ErrorExceptionResult<InfoEnumModel>();
  ngOnInit(): void {
    //this.loadOptions();
  }
  async loadOptions(): Promise<void> {
    //this.dataModelResult = await this.publicHelper.getEnumRecordStatus();
  }


  private privateModelDate: any;
  get modelDate(): any {
    return this.privateModelDate;
  }
  set modelDate(value: any) {
    this.privateModelDate = value;
    this.modelChange.emit(value);
  }
}
