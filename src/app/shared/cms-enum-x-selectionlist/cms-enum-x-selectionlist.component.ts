import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  ErrorExceptionResult,
  InfoEnumModel,
} from 'ntk-cms-api';


@Component({
  selector: 'app-cms-enum-x-selectionlist',
  templateUrl: './cms-enum-x-selectionlist.component.html',

})
export class CmsEnumXSelectionListComponent implements OnInit {
  static nextId = 0;
  id = ++CmsEnumXSelectionListComponent.nextId;
  constructor(
    public translate: TranslateService,) {

  }
  @Input()
  set model(value: number[]) {
    this.privateModelDate = value;
  }
  @Output() modelChange: EventEmitter<number[]> = new EventEmitter<number[]>();
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


  private privateModelDate: number[];
  get modelDate(): number[] {
    return this.privateModelDate;
  }
  set modelDate(value: number[]) {
    this.privateModelDate = value;
    this.modelChange.emit(value);
  }
}
