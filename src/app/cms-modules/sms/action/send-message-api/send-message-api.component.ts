
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  ClauseTypeEnum, CoreEnumService, ErrorExceptionResult,
  FilterDataModel, FilterDataModelSearchTypesEnum, FilterModel, SmsMainApiNumberModel,
  SmsMainApiNumberService, SmsMainApiPathModel,
  SmsMainApiPathService
} from 'ntk-cms-api';
import { Observable, firstValueFrom } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';


@Component({
    selector: 'app-sms-action-send-message-api',
    templateUrl: './send-message-api.component.html',
    standalone: false
})
export class SmsActionSendMessageApiComponent implements OnInit {
  static nextId = 0;
  id = ++SmsActionSendMessageApiComponent.nextId;
  constructorInfoAreaId = this.constructor.name;
  constructor(
    public coreEnumService: CoreEnumService,
    private cmsToastrService: CmsToastrService,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
    public translate: TranslateService,
    public pathService: SmsMainApiPathService,
    public numberService: SmsMainApiNumberService
  ) {
    this.publicHelper.processService.cdr = this.cdr;
  }

  dataPathModelResult: ErrorExceptionResult<SmsMainApiPathModel> = new ErrorExceptionResult<SmsMainApiPathModel>();
  dataNumberModelResult: ErrorExceptionResult<SmsMainApiNumberModel> = new ErrorExceptionResult<SmsMainApiNumberModel>();
  dataPathModelSelect: SmsMainApiPathModel = new SmsMainApiPathModel();
  dataNumberModelSelect: SmsMainApiNumberModel = new SmsMainApiNumberModel();


  formPathControl = new FormControl();
  formNumberControl = new FormControl();
  filteredPathOptions: Observable<SmsMainApiPathModel[]>;
  filteredNumberOptions: Observable<SmsMainApiNumberModel[]>;
  @Input() optionDisabled = false;
  @Input() optionSelectFirstItem = false;
  @Input() optionPlaceholder = '';
  @Output() optionPathChange = new EventEmitter<SmsMainApiPathModel>();
  @Output() optionNumberChange = new EventEmitter<SmsMainApiNumberModel>();
  @Input() optionReload = () => this.onActionButtonReload();
  @Input() set optionSelectPathForce(x: string | SmsMainApiPathModel) {
    this.onActionSelectPathForce(x);
  }
  @Input() set optionSelectNumberForce(x: string | SmsMainApiNumberModel) {
    this.onActionSelectNumberForce(x);
  }

  ngOnInit(): void {
    this.loadOptions();
  }
  loadOptions(): void {
    this.filteredPathOptions = this.formPathControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(1500),
        distinctUntilChanged(),
        switchMap(val => {
          if (typeof val === 'string') {
            return this.DataPathGetAll(val || '');
          }
          return [];
        }),
        // tap(() => this.myControl.setValue(this.options[0]))
      );
    this.filteredNumberOptions = this.formNumberControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(1500),
        distinctUntilChanged(),
        switchMap(val => {
          if (typeof val === 'string') {
            return this.DataNumberGetAll(val || '');
          }
          return [];
        }),
        // tap(() => this.myControl.setValue(this.options[0]))
      );
  }

  displayPathFn(model?: SmsMainApiPathModel): string | undefined {
    return model ? (model.title) : undefined;
  }
  displayNumberFn(model?: SmsMainApiNumberModel): string | undefined {
    return model ? (model.numberChar) : undefined;
  }
  displayPathOption(model?: SmsMainApiPathModel): string | undefined {
    return model ? (model.title) : undefined;
  }
  displayNumberOption(model?: SmsMainApiNumberModel): string | undefined {
    return model ? (model.numberChar) : undefined;
  }
  async DataPathGetAll(text: string | number | any): Promise<SmsMainApiPathModel[]> {
    const filterModel = new FilterModel();
    filterModel.rowPerPage = 20;
    filterModel.accessLoad = true;
    let filter = new FilterDataModel();
    filter.propertyName = 'Title';
    filter.value = text;
    filter.searchType = FilterDataModelSearchTypesEnum.Contains;
    filter.clauseType = ClauseTypeEnum.Or;
    filterModel.filters.push(filter);
    if (text && typeof +text === 'number' && +text > 0) {
      filter = new FilterDataModel();
      filter.propertyName = 'Id';
      filter.value = text;
      filter.searchType = FilterDataModelSearchTypesEnum.Equal;
      filter.clauseType = ClauseTypeEnum.Or;
      filterModel.filters.push(filter);
    }
    this.publicHelper.processService.processStart('DataPathGetAll');
    return await firstValueFrom(this.pathService.ServiceGetAll(filterModel))
      .then(
        (response) => {
          this.dataPathModelResult = response;
          /*select First Item */
          if (this.optionSelectFirstItem &&
            (!this.dataPathModelSelect || !this.dataPathModelSelect.id || this.dataPathModelSelect.id.length <= 0) &&
            this.dataPathModelResult.listItems.length > 0) {
            this.optionSelectFirstItem = false;
            setTimeout(() => { this.formPathControl.setValue(this.dataPathModelResult.listItems[0]); }, 1000);
            this.onActionSelectPath(this.dataPathModelResult.listItems[0]);
          }
          /*select First Item */
          this.publicHelper.processService.processStop('DataPathGetAll');
          return response.listItems;
        });
  }
  async DataNumberGetAll(text: string | number | any): Promise<SmsMainApiNumberModel[]> {
    const filterModel = new FilterModel();
    filterModel.rowPerPage = 20;
    filterModel.accessLoad = true;
    let filter = new FilterDataModel();
    filter.propertyName = 'Title';
    filter.value = text;
    filter.searchType = FilterDataModelSearchTypesEnum.Contains;
    filter.clauseType = ClauseTypeEnum.Or;
    filterModel.filters.push(filter);
    if (text && typeof +text === 'number' && +text > 0) {
      filter = new FilterDataModel();
      filter.propertyName = 'Id';
      filter.value = text;
      filter.searchType = FilterDataModelSearchTypesEnum.Equal;
      filter.clauseType = ClauseTypeEnum.Or;
      filterModel.filters.push(filter);
    }
    this.publicHelper.processService.processStart('DataNumberGetAll');
    return await firstValueFrom(this.numberService.ServiceGetAll(filterModel))
      .then(
        (response) => {
          this.dataNumberModelResult = response;
          /*select First Item */
          if (this.optionSelectFirstItem &&
            (!this.dataNumberModelSelect || !this.dataNumberModelSelect.id || this.dataNumberModelSelect.id.length <= 0) &&
            this.dataNumberModelResult.listItems.length > 0) {
            this.optionSelectFirstItem = false;
            setTimeout(() => { this.formNumberControl.setValue(this.dataNumberModelResult.listItems[0]); }, 1000);
            this.onActionSelectNumber(this.dataNumberModelResult.listItems[0]);
          }
          /*select First Item */
          this.publicHelper.processService.processStop('DataNumberGetAll');
          return response.listItems;
        });
  }
  onActionSelectPath(model: SmsMainApiPathModel): void {
    if (this.optionDisabled) {
      return;
    }
    this.dataPathModelSelect = model;
    this.optionPathChange.emit(this.dataPathModelSelect);
  }
  onActionSelectNumber(model: SmsMainApiNumberModel): void {
    if (this.optionDisabled) {
      return;
    }
    this.dataNumberModelSelect = model;
    this.optionNumberChange.emit(this.dataNumberModelSelect);
  }
  onActionSelectClearPath(): void {
    if (this.optionDisabled) {
      return;
    }
    this.formPathControl.setValue(null);
    this.optionPathChange.emit(null);
  }
  onActionSelectClearNumber(): void {
    if (this.optionDisabled) {
      return;
    }
    this.formNumberControl.setValue(null);
    this.optionNumberChange.emit(null);
  }
  pushPath(newvalue: SmsMainApiPathModel): Observable<SmsMainApiPathModel[]> {
    return this.filteredPathOptions.pipe(map(items => {
      if (items.find(x => x.id === newvalue.id)) {
        return items;
      }
      items.push(newvalue);
      return items;
    }));
  }
  pushNumber(newvalue: SmsMainApiNumberModel): Observable<SmsMainApiNumberModel[]> {
    return this.filteredNumberOptions.pipe(map(items => {
      if (items.find(x => x.id === newvalue.id)) {
        return items;
      }
      items.push(newvalue);
      return items;
    }));
  }
  onActionSelectPathForce(id: string | SmsMainApiPathModel): void {
    if (typeof id === 'string' && id.length > 0) {
      if (this.dataPathModelSelect && this.dataPathModelSelect.id === id) {
        return;
      }
      if (this.dataPathModelResult && this.dataPathModelResult.listItems && this.dataPathModelResult.listItems.find(x => x.id === id)) {
        const item = this.dataPathModelResult.listItems.find(x => x.id === id);
        this.dataPathModelSelect = item;
        this.formPathControl.setValue(item);
        return;
      }
      this.pathService.ServiceGetOneById(id).subscribe({
        next: (ret) => {
          if (ret.isSuccess) {
            this.filteredPathOptions = this.pushPath(ret.item);
            this.dataPathModelSelect = ret.item;
            this.formPathControl.setValue(ret.item);
            this.optionPathChange.emit(ret.item);
          } else {
            this.cmsToastrService.typeErrorMessage(ret.errorMessage);
          }
        }
      });
      return;
    }
    if (typeof id === typeof SmsMainApiPathModel) {
      this.filteredPathOptions = this.pushPath((id as SmsMainApiPathModel));
      this.dataPathModelSelect = (id as SmsMainApiPathModel);
      this.formPathControl.setValue(id);
      return;
    }
    this.formPathControl.setValue(null);
  }
  onActionSelectNumberForce(id: string | SmsMainApiNumberModel): void {
    if (typeof id === 'string' && id.length > 0) {
      if (this.dataNumberModelSelect && this.dataNumberModelSelect.id === id) {
        return;
      }
      if (this.dataNumberModelResult && this.dataNumberModelResult.listItems && this.dataNumberModelResult.listItems.find(x => x.id === id)) {
        const item = this.dataNumberModelResult.listItems.find(x => x.id === id);
        this.dataNumberModelSelect = item;
        this.formNumberControl.setValue(item);
        return;
      }
      this.numberService.ServiceGetOneById(id).subscribe({
        next: (ret) => {
          if (ret.isSuccess) {
            this.filteredNumberOptions = this.pushNumber(ret.item);
            this.dataNumberModelSelect = ret.item;
            this.formNumberControl.setValue(ret.item);
            this.optionNumberChange.emit(ret.item);
          } else {
            this.cmsToastrService.typeErrorMessage(ret.errorMessage);
          }
        }
      });
      return;
    }
    if (typeof id === typeof SmsMainApiNumberModel) {
      this.filteredNumberOptions = this.pushNumber((id as SmsMainApiNumberModel));
      this.dataNumberModelSelect = (id as SmsMainApiNumberModel);
      this.formNumberControl.setValue(id);
      return;
    }
    this.formNumberControl.setValue(null);
  }
  onActionButtonReload(): void {
    this.dataPathModelSelect = new SmsMainApiPathModel();
    this.dataNumberModelSelect = new SmsMainApiNumberModel();
    this.DataPathGetAll(null);
    //this.DataNumberGetAll(null);
  }
}
