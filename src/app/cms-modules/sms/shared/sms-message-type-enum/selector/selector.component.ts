
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  ErrorExceptionResult, InfoEnumModel,
  SmsEnumService} from 'ntk-cms-api';
import { Observable, Subscription, firstValueFrom } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';


@Component({
    selector: 'app-sms-message-type-enum-selector',
    templateUrl: './selector.component.html',
    standalone: false
})
export class SmsMessageTypeEnumSelectorComponent implements OnInit, OnDestroy {

  constructorInfoAreaId = this.constructor.name;
  constructor(
    private cmsToastrService: CmsToastrService,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
    public translate: TranslateService,
    private tokenHelper: TokenHelper,
    public enumService: SmsEnumService) {
    this.publicHelper.processService.cdr = this.cdr;
  }
  @Input() set optionSelectForce(x: string | InfoEnumModel) {
    if (x && ((typeof x === 'string' && x.length > 0) || typeof x === typeof InfoEnumModel))
      this.onActionSelectForce(x);
  }
  @Input() set optionTypeUsageId(x: string) {
    this.typeUsageId = x;
    this.loadOptions();
  }
  dataModelResult: ErrorExceptionResult<InfoEnumModel> = new ErrorExceptionResult<InfoEnumModel>();
  dataModelSelect: InfoEnumModel = new InfoEnumModel();
  formControl = new FormControl();
  filteredOptions: Observable<InfoEnumModel[]>;
  @Input() optionDisabled = false;
  @Input() optionSelectFirstItem = false;
  @Input() optionPlaceholder = '';
  @Output() optionChange = new EventEmitter<InfoEnumModel>();
  @Input() optionTypeView = 1;
  @Input() optionAllowUnSelect = false;

  typeUsageId = '';
  @Input() optionReload = () => this.onActionButtonReload();
  cmsApiStoreSubscribe: Subscription;



  ngOnInit(): void {
    this.loadOptions();
    this.cmsApiStoreSubscribe = this.tokenHelper.getTokenInfoStateOnChange().subscribe({
      next: (ret) => {
        this.loadOptions();
      }
    });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
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
  displayFn(model?: InfoEnumModel): string | undefined {
    return model ? model.title : undefined;
  }
  displayOption(model?: InfoEnumModel): string | undefined {
    return model ? model.title : undefined;
  }
  async DataGetAll(text: string | number | any): Promise<InfoEnumModel[]> {

    const pName = this.constructor.name + 'main';
    this.translate.get('MESSAGE.Receiving_information').subscribe((str: string) => {
      this.publicHelper.processService.processStart(pName, str, this.constructorInfoAreaId);
    });

    return await firstValueFrom(this.enumService.ServiceSmsMessageTypeEnum())
      .then(
        (response) => {
          this.dataModelResult = response;
          /*select First Item */
          if (this.optionSelectFirstItem &&
            (!this.dataModelSelect || !this.dataModelSelect.value || this.dataModelSelect.value < 0) &&
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
  onActionSelect(model: InfoEnumModel): void {
    if (this.optionDisabled) {
      return;
    }
    if (this.optionAllowUnSelect && this.dataModelSelect && this.dataModelSelect.value == model.value)
      this.onActionSelectClear()
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

  push(newvalue: InfoEnumModel): Observable<InfoEnumModel[]> {
    return this.filteredOptions.pipe(map(items => {
      if (items.find(x => x.value === newvalue.value)) {
        return items;
      }
      items.push(newvalue);
      return items;
    }));

  }
  onActionSelectForce(id: string | InfoEnumModel): void {
    if (!id || (typeof id === 'string' && id.length === 0)) {
      this.dataModelSelect = new InfoEnumModel();
    }
    if (typeof id === 'number' && id >= 0) {
      if (this.dataModelSelect && this.dataModelSelect.value === id) {
        return;
      }
      if (this.dataModelResult && this.dataModelResult.listItems && this.dataModelResult.listItems.find(x => x.value === id)) {
        const item = this.dataModelResult.listItems.find(x => x.value === id);
        this.dataModelSelect = item;
        this.formControl.setValue(item);
        return;
      }

      return;
    }
    if (typeof id === typeof InfoEnumModel) {
      this.filteredOptions = this.push((id as InfoEnumModel));
      this.dataModelSelect = (id as InfoEnumModel);
      this.formControl.setValue(id);
      return;
    }
    this.formControl.setValue(null);
  }

  onActionButtonReload(): void {
    // if (this.dataModelSelect && this.dataModelSelect.id > 0) {
    //   this.onActionSelect(null);
    // }
    this.dataModelSelect = new InfoEnumModel();
    // this.optionsData.Select = new InfoEnumModel();
    this.loadOptions();
  }
}
