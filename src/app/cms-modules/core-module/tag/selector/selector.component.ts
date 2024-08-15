
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  ClauseTypeEnum, CoreEnumService,
  CoreModuleTagModel,
  CoreModuleTagService, ErrorExceptionResult,
  FilterDataModel, FilterDataModelSearchTypesEnum, FilterModel
} from 'ntk-cms-api';
import { Observable, firstValueFrom } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';




@Component({
  selector: 'app-tag-selector',
  templateUrl: './selector.component.html',
})
export class CoreModuleTagSelectorComponent implements OnInit {
  static nextId = 0;
  id = ++CoreModuleTagSelectorComponent.nextId;
  constructorInfoAreaId = this.constructor.name;
  constructor(
    public coreEnumService: CoreEnumService,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
    private cmsToastrService: CmsToastrService,
    public translate: TranslateService,
    public coreModuleTagService: CoreModuleTagService) {

    this.publicHelper.processService.cdr = this.cdr;

  }
  dataModelResult: ErrorExceptionResult<CoreModuleTagModel> = new ErrorExceptionResult<CoreModuleTagModel>();
  dataModelSelect: CoreModuleTagModel = new CoreModuleTagModel();
  formControl = new FormControl();
  filteredOptions: Observable<CoreModuleTagModel[]>;
  @Input() optionPlaceholder = '';
  @Input() optionSelectFirstItem = false;
  @Input() optionDisabled = false;
  @Input() optionLabel = '';
  @Output() optionChange = new EventEmitter<CoreModuleTagModel>();
  @Input() optionReload = () => this.onActionButtonReload();
  @Input() set optionSelectForce(x: number | CoreModuleTagModel) {
    this.onActionSelectForce(x);
  }



  ngOnInit(): void {
    this.loadOptions();
    if (!this.optionLabel || this.optionLabel.length == 0 && this.optionPlaceholder?.length > 0)
      this.optionLabel = this.optionPlaceholder;
  }
  loadOptions(): void {
    this.filteredOptions = this.formControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(1500),
        distinctUntilChanged(),
        switchMap(val => {
          if (typeof val === 'string' || typeof val === 'number') {
            return this.DataGetAll(val || '');
          }
          return [];
        }),
        // tap(() => this.myControl.setValue(this.options[0]))
      );
  }

  displayFn(model?: CoreModuleTagModel): string | undefined {
    return model ? model.title : undefined;
  }
  displayOption(model?: CoreModuleTagModel): string | undefined {
    return model ? model.title : undefined;
  }
  async DataGetAll(text: string | number | any): Promise<CoreModuleTagModel[]> {
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

    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructor.name);
    });

    return firstValueFrom(this.coreModuleTagService.ServiceGetAll(filterModel))
      .then(
        (response) => {
          this.dataModelResult = response;
          /*select First Item */
          if (this.optionSelectFirstItem &&
            (!this.dataModelSelect || !this.dataModelSelect.id || this.dataModelSelect.id <= 0) &&
            this.dataModelResult.listItems.length > 0) {
            this.optionSelectFirstItem = false;
            setTimeout(() => { this.formControl.setValue(this.dataModelResult.listItems[0]); }, 1000);
            this.onActionSelect(this.dataModelResult.listItems[0]);
          }
          /*select First Item */
          this.publicHelper.processService.processStop(pName);

          return response.listItems;
        });
  }
  onActionSelect(model: CoreModuleTagModel): void {
    this.dataModelSelect = model;
    this.optionChange.emit(this.dataModelSelect);

  }
  onActionSelectClear(): void {
    this.dataModelSelect = null;
    this.formControl.setValue(null);
    this.optionChange.emit(null);
  }
  push(newvalue: CoreModuleTagModel): Observable<CoreModuleTagModel[]> {
    return this.filteredOptions.pipe(map(items => {
      if (items.find(x => x.id === newvalue.id)) {
        return items;
      }
      items.push(newvalue);
      return items;
    }));

  }
  onActionSelectForce(id: number | CoreModuleTagModel): void {
    if (typeof id === 'number' && id > 0) {
      this.coreModuleTagService.ServiceGetOneById(id).subscribe({
        next: (ret) => {
          if (ret.isSuccess) {
            this.filteredOptions = this.push(ret.item);
            this.dataModelSelect = ret.item;
            this.formControl.setValue(ret.item);
          } else {
            this.cmsToastrService.typeErrorMessage(ret.errorMessage);
          }
        }
      });
      return;
    }
    if (typeof id === typeof CoreModuleTagModel) {
      this.filteredOptions = this.push((id as CoreModuleTagModel));
      this.dataModelSelect = (id as CoreModuleTagModel);
      this.formControl.setValue(id);
      return;
    }
    this.formControl.setValue(null);
  }

  onActionButtonReload(): void {
    this.dataModelSelect = new CoreModuleTagModel();
    this.loadOptions();
  }
}
