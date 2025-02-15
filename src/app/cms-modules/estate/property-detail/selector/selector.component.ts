
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  ClauseTypeEnum, CoreEnumService, ErrorExceptionResult, EstatePropertyDetailModel,
  EstatePropertyDetailService, FilterDataModel, FilterDataModelSearchTypesEnum, FilterModel
} from 'ntk-cms-api';
import { Observable, firstValueFrom } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
    selector: 'app-estate-property-detail-selector',
    templateUrl: './selector.component.html',
    standalone: false
})
export class EstatePropertyDetailSelectorComponent implements OnInit {
  static nextId = 0;
  id = ++EstatePropertyDetailSelectorComponent.nextId;
  constructorInfoAreaId = this.constructor.name;
  constructor(
    public coreEnumService: CoreEnumService,
    private cmsToastrService: CmsToastrService,
    public translate: TranslateService,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
    public categoryService: EstatePropertyDetailService) {
    this.publicHelper.processService.cdr = this.cdr;
  }
  dataModelResult: ErrorExceptionResult<EstatePropertyDetailModel> = new ErrorExceptionResult<EstatePropertyDetailModel>();
  dataModelSelect: EstatePropertyDetailModel = new EstatePropertyDetailModel();
  formControl = new FormControl();
  filteredOptions: Observable<EstatePropertyDetailModel[]>;
  @Input() optionDisabled = false;
  @Input() optionSelectFirstItem = false;
  @Input() optionPlaceholder = '';
  @Input() optionLabel = '';

  @Output() optionChange = new EventEmitter<EstatePropertyDetailModel>();
  @Input() optionReload = () => this.onActionButtonReload();
  @Input() set optionSelectForce(x: string | EstatePropertyDetailModel) {
    this.onActionSelectForce(x);
  }




  ngOnInit(): void {
    this.loadOptions();
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

  displayFn(model?: EstatePropertyDetailModel): string | undefined {
    return model ? model.title : undefined;
  }
  displayOption(model?: EstatePropertyDetailModel): string | undefined {
    return model ? model.title : undefined;
  }
  async DataGetAll(text: string | number | any): Promise<EstatePropertyDetailModel[]> {
    const filterModel = new FilterModel();
    filterModel.rowPerPage = 20;
    filterModel.accessLoad = true;

    if (typeof text === 'string' && text.length > 0) {
      let filter = new FilterDataModel();
      filter.propertyName = 'Name';
      filter.value = text;
      filter.searchType = FilterDataModelSearchTypesEnum.Contains;
      filterModel.filters.push(filter);
      /* */
      filter = new FilterDataModel();
      filter.propertyName = 'Id';
      filter.value = text;
      filter.searchType = FilterDataModelSearchTypesEnum.Equal;
      filter.clauseType = ClauseTypeEnum.Or;
      filterModel.filters.push(filter);
    }

    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });

    return await firstValueFrom(this.categoryService.ServiceGetAll(filterModel))
      .then(
        (response) => {
          this.dataModelResult = response;
          /*select First Item */
          if (this.optionSelectFirstItem &&
            (!this.dataModelSelect || !this.dataModelSelect.id || this.dataModelSelect.id.length === 0) &&
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
  onActionSelect(model: EstatePropertyDetailModel): void {
    if (this.optionDisabled) {
      return;
    }
    this.dataModelSelect = model;
    this.optionChange.emit(this.dataModelSelect);
  }
  onActionSelectClear(): void {
    if (this.optionDisabled) {
      return;
    }
    this.dataModelSelect = null;
    this.formControl.setValue(null);
    this.optionChange.emit(null);
  }

  push(newvalue: EstatePropertyDetailModel): Observable<EstatePropertyDetailModel[]> {
    return this.filteredOptions.pipe(map(items => {
      if (items.find(x => x.id === newvalue.id)) {
        return items;
      }
      items.push(newvalue);
      return items;
    }));

  }
  onActionSelectForce(id: string | EstatePropertyDetailModel): void {
    if (typeof id === 'string' && id.length > 0) {
      if (this.dataModelSelect && this.dataModelSelect.id === id) {
        return;
      }
      if (this.dataModelResult && this.dataModelResult.listItems && this.dataModelResult.listItems.find(x => x.id === id)) {
        const item = this.dataModelResult.listItems.find(x => x.id === id);
        this.dataModelSelect = item;
        this.formControl.setValue(item);
        return;
      }
      this.categoryService.ServiceGetOneById(id).subscribe({
        next: (ret) => {
          if (ret.isSuccess) {
            this.filteredOptions = this.push(ret.item);
            this.dataModelSelect = ret.item;
            this.formControl.setValue(ret.item);
            this.optionChange.emit(ret.item);
          } else {
            this.cmsToastrService.typeErrorMessage(ret.errorMessage);
          }
        }
      });
      return;
    }
    if (typeof id === typeof EstatePropertyDetailModel) {
      this.filteredOptions = this.push((id as EstatePropertyDetailModel));
      this.dataModelSelect = (id as EstatePropertyDetailModel);
      this.formControl.setValue(id);
      return;
    }
    this.formControl.setValue(null);
  }

  onActionButtonReload(): void {
    // if (this.dataModelSelect && this.dataModelSelect.id > 0) {
    //   this.onActionSelect(null);
    // }
    this.dataModelSelect = new EstatePropertyDetailModel();
    // this.optionsData.Select = new EstatePropertyDetailModel();
    this.loadOptions();
  }
}
