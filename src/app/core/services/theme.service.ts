import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ThemeStoreModel } from '../models/themeStoreModel';
import { CmsStoreService } from '../reducers/cmsStore.service';
import { SET_Theme_STATE } from '../reducers/reducer.factory';
export type ThemeModeType = 'dark' | 'light' | 'system';
export type ThemeDirectionType = 'ltr' | 'rtl';
export type ThemeFontChangeType = 'increase' | 'decrease' | 'default' | 'memory';
const themeModeLSKey = 'theme_mode';
const themeHighLightLSKey = 'theme_highlight';
const themeDirectionSKey = 'theme_direction';
const themeFontSizeSKey = 'theme_font_size';
const themeLanguageSKey = 'theme_language';
const themeMenuPinSKey = 'theme_MenuPin';

@Injectable({
  providedIn: 'root',
})
export class ThemeService implements OnDestroy {
  constructor(private cmsStoreService: CmsStoreService,) {
    const storeSnapshot = this.cmsStoreService.getStateSnapshot();
    if (storeSnapshot.themeStore)
      this.themeStore = storeSnapshot.themeStore;
  }
  cmsApiStoreSubscribe: Subscription;

  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  public onInitAppComponentStateOnChange() {
    this.cmsApiStoreSubscribe = this.cmsStoreService.getState((state) => state.themeStore).subscribe((value) => {
      if (environment.consoleLog)
        console.log("onInitAppComponentStateOnChange:ThemeService");
      if (value)
        this.themeStore = value;
      else
        this.themeStore = new ThemeStoreModel();
    });

    this.updateThemeModeType(this.getThemeModeTypeFromLocalStorage(), true);
    this.updateThemeHighLight(this.getThemeHighLightFromLocalStorage(), true);
    this.updateThemeDirection(this.getThemeDirectionFromLocalStorage(), true);
    this.updateThemeLanguage(this.getThemeLanguageFromLocalStorage(), true);
    this.updateThemeFontSize('memory');
    this.updateThemeMenuPin(this.getThemeMenuPinFromLocalStorage());
  }
  public afterViewInitAppComponent() {
    setTimeout(() => { this.htmlSelectorAddEvent(); }, 200);
  }
  onNavigationStartAppComponent(): void {
    //this.themeStore.dataMenu = ''
    setTimeout(() => {
      this.themeStore.dataMenu = '';
    }, 200);
  }
  onNavigationEndAppComponent(): void {
    setTimeout(() => { this.htmlSelectorAddEvent(); }, 200);
  }
  htmlSelectorAddEvent(): void {
    //Activating Menus
    document.querySelectorAll('.menu').forEach(el => {
      const node = el as HTMLElement;
      node.style.display = 'block'
    });
    //Accordion Rotate
    const accordionBtn = document.querySelectorAll('.accordion-btn');
    if (accordionBtn?.length) {
      accordionBtn.forEach(el => el.addEventListener('click', event => {
        el.querySelector('i:last-child').classList.toggle('fa-rotate-180');
      }));
    }
  }
  themeStore = new ThemeStoreModel()

  private getThemeModeTypeFromLocalStorage(): ThemeModeType {
    if (!localStorage) {
      return 'light';
    }
    const data = localStorage.getItem(themeModeLSKey);
    if (!data) {
      return 'light';
    }

    if (data === 'light') {
      return 'light';
    }

    if (data === 'dark') {
      return 'dark';
    }

    return 'system';
  };
  private getThemeHighLightFromLocalStorage(): string {
    if (!localStorage) {
      return '';
    }
    const data = localStorage.getItem(themeHighLightLSKey);
    if (!data) {
      return '';
    }
    return data;
  }
  private getThemeLanguageFromLocalStorage(): string {
    if (!localStorage) {
      return 'en';
    }
    const data = localStorage.getItem(themeLanguageSKey);
    if (!data) {
      return 'en';
    }
    return data;
  }
  private getThemeFontSizeFromLocalStorage(): number {
    if (!localStorage) {
      return 0;
    }
    const data = localStorage.getItem(themeFontSizeSKey);
    if (!data) {
      return 0;
    }
    return +data;
  }
  private getThemeMenuPinFromLocalStorage(): number[] {
    if (!localStorage) {
      return [];
    }
    const data = localStorage.getItem(themeMenuPinSKey);
    if (!data) {
      return [];
    }
    //JSON.stringify(data);
    var ret: number[] = [];
    ret = JSON.parse(data);
    if (Array.isArray(ret))
      return ret;
    return [];
  }
  private getThemeDirectionFromLocalStorage(): ThemeDirectionType {
    if (!localStorage)
      return 'ltr';
    const data = localStorage.getItem(themeDirectionSKey);
    if (data && data == 'ltr')
      return 'ltr';
    return 'ltr';
  }

  public getSystemMode = (): ThemeModeType => {
    return window.matchMedia('(prefers-color-scheme: dark)') ? 'dark' : 'light'
  }
  public updateThemeModeType(_mode: ThemeModeType, firstRun = false) {
    if (!_mode)
      _mode = 'system';
    const updatedMode = _mode === 'system' ? this.getSystemMode() : _mode;
    if (!firstRun && this.themeStore.themeMode == updatedMode)
      return;
    if (localStorage)
      localStorage.setItem(themeModeLSKey, updatedMode);

    this.themeStore.themeMode = updatedMode;
    this.cmsStoreService.setState({ type: SET_Theme_STATE, payload: this.themeStore });
    setTimeout(() => {
      /**theme-dark */
      if (this.themeStore.themeMode == 'dark') {
        document.documentElement.querySelectorAll('.theme-light').forEach((element) => {
          element.classList.remove('theme-light');
          element.classList.add('theme-dark');
        });
      } else {
        document.documentElement.querySelectorAll('.theme-dark').forEach((element) => {
          element.classList.remove('theme-dark');
          element.classList.add('theme-light');
        });
      }
      /**theme-dark */
    }, 10);
  }

  public updateThemeHighLight(colorStr: string, firstRun = false) {
    if (!colorStr || colorStr.length == 0)
      colorStr = 'blue';
    if (!firstRun && this.themeStore.themeHighlight == colorStr)
      return;
    if (localStorage)
      localStorage.setItem(themeHighLightLSKey, colorStr);

    this.themeStore.themeHighlight = colorStr;
    this.cmsStoreService.setState({ type: SET_Theme_STATE, payload: this.themeStore });
    setTimeout(() => {
      /* HighLigh*/
      if (this.themeStore.themeHighlight.length > 0) {
        var pageHighlight = document.querySelectorAll('.page-highlight');
        if (pageHighlight.length) {
          pageHighlight.forEach(function (e) { e.remove(); });
        }
        var loadHighlight = document.createElement("link");
        loadHighlight.rel = "stylesheet";
        loadHighlight.className = "page-highlight";
        loadHighlight.type = "text/css";
        loadHighlight.href = 'assets/styles/highlights/highlight_' + this.themeStore.themeHighlight + '.css';
        document.getElementsByTagName("head")[0].appendChild(loadHighlight);
        //document.body.setAttribute('data-highlight', 'highlight-' + colorStr)
      }
      /* HighLigh*/
    }, 10);
  }
  public updateThemeDirection(model: ThemeDirectionType, firstRun = false) {
    if (!model)
      model = 'ltr';
    if (!firstRun && this.themeStore.themeDirection == model)
      return;
    if (localStorage)
      localStorage.setItem(themeDirectionSKey, model);
    this.themeStore.themeDirection = model;
    this.cmsStoreService.setState({ type: SET_Theme_STATE, payload: this.themeStore });
    setTimeout(() => {
      /**theme-rtl */
      if (this.themeStore.themeDirection == 'ltr') {
        document.documentElement.querySelectorAll('.theme-rtl').forEach((element) => {
          element.classList.remove('theme-rtl');
          element.classList.add('theme-ltr');
        });
      } else {
        document.documentElement.querySelectorAll('.theme-ltr').forEach((element) => {
          element.classList.remove('theme-ltr');
          element.classList.add('theme-rtl');
        });
      }
      /**theme-rtl */
    }, 10);
  }
  public updateThemeLanguage(model: string, firstRun = false) {
    if (!model)
      return;
    if (!firstRun && this.themeStore.themeLanguage == model)
      return;
    if (localStorage)
      localStorage.setItem(themeLanguageSKey, model);
    this.themeStore.themeLanguage = model;
    this.cmsStoreService.setState({ type: SET_Theme_STATE, payload: this.themeStore });
  }
  private fontSize: number = 16; // اندازه پیشفرض فونت
  getFontSize(): string {
    return `${this.fontSize}px`;
  }
  public updateThemeFontSize(model: ThemeFontChangeType) {
    var diffNum = 0;
    if (model == 'increase') {
      diffNum = 1;
    }
    else if (model == 'decrease') {
      diffNum = -1;
    }
    else if (model == 'default') {
      diffNum = -1 * this.themeStore.themeFontSize;
    } else if (model = 'memory') {
      diffNum = this.getThemeFontSizeFromLocalStorage();
    }
    this.themeStore.themeFontSize = this.themeStore.themeFontSize + diffNum;
    this.cmsStoreService.setState({ type: SET_Theme_STATE, payload: this.themeStore });
    if (localStorage)
      localStorage.setItem(themeFontSizeSKey, this.themeStore.themeFontSize + '');
    setTimeout(() => {
      /**theme-font-changer */
      this.fontSize += diffNum; // افزایش اندازه فونت
      document.documentElement.style.setProperty('--font-size', this.getFontSize());
      /**theme-font-changer */
    }, 10);

  }
  ThemeMenuPin: boolean[] = [];
  public updateThemeMenuPin(model: number[]): void {
    if (!model)
      return;
    this.themeStore.themeMenuPin = model;
    this.ThemeMenuPin = [];
    this.themeStore.themeMenuPin.forEach(el => {
      this.ThemeMenuPin[el] = true;
    });
    this.cmsStoreService.setState({ type: SET_Theme_STATE, payload: this.themeStore });
  }
  public updateThemeMenuPinToggel(model: number): void {
    if (!model)
      return;
    var index = this.themeStore.themeMenuPin.indexOf(model);
    if (index >= 0) {
      this.themeStore.themeMenuPin.splice(index, 1);
      this.ThemeMenuPin[model] = false;
    }
    else {
      this.themeStore.themeMenuPin.push(model);
      this.ThemeMenuPin[model] = true;
    }
    if (localStorage)
      localStorage.setItem(themeMenuPinSKey, JSON.stringify(this.themeStore.themeMenuPin));
    this.cmsStoreService.setState({ type: SET_Theme_STATE, payload: this.themeStore });
  }
  public updateThemeMenuPinAdd(model: number): void {
    if (!model)
      return;
    this.themeStore.themeMenuPin.push(model);
    this.ThemeMenuPin[model] = true;
    if (localStorage)
      localStorage.setItem(themeMenuPinSKey, JSON.stringify(this.themeStore.themeMenuPin));
    this.cmsStoreService.setState({ type: SET_Theme_STATE, payload: this.themeStore });
  }
  public updateThemeMenuPinRemove(model: number): void {
    if (!model)
      return;
    var index = this.themeStore.themeMenuPin.indexOf(model);
    if (index >= 0)
      this.themeStore.themeMenuPin.splice(index, 1);
    this.ThemeMenuPin[model] = false;
    if (localStorage)
      localStorage.setItem(themeMenuPinSKey, JSON.stringify(this.themeStore.themeMenuPin));
    this.cmsStoreService.setState({ type: SET_Theme_STATE, payload: this.themeStore });
  }













  public updateMainPagePreloaderShow(v: boolean) {
    this.themeStore.mainPagePreloaderShow = v;
    this.cmsStoreService.setState({ type: SET_Theme_STATE, payload: this.themeStore });
    if (environment.consoleLog)
      console.log('mainPagePreloaderShow :', this.themeStore.mainPagePreloaderShow);
  }
  public updateInnerSize() {
    this.themeStore.innerWidth = window.innerWidth;
    this.themeStore.innerHeight = window.innerHeight;
    this.cmsStoreService.setState({ type: SET_Theme_STATE, payload: this.themeStore });
    if (environment.consoleLog)
      console.log('windows Width :', window.innerWidth, 'windows Height :', window.innerHeight);
  }

  public onActionScrollTopPage(v: boolean, d = 0) {
    if (v == false) {
      this.themeStore.actionScrollTopPage = v;
      this.cmsStoreService.setState({ type: SET_Theme_STATE, payload: this.themeStore });
      if (environment.consoleLog)
        console.log('windows actionGoTop :', this.themeStore.actionScrollTopPage);
      return;
    }
    if (d > 0) {
      setTimeout(() => {
        this.themeStore.actionScrollTopPage = v;
        this.cmsStoreService.setState({ type: SET_Theme_STATE, payload: this.themeStore });
        if (environment.consoleLog)
          console.log('windows actionGoTop :', this.themeStore.actionScrollTopPage);
      }, 1000);
    }
    else {
      this.themeStore.actionScrollTopPage = v;
      this.cmsStoreService.setState({ type: SET_Theme_STATE, payload: this.themeStore });
      if (environment.consoleLog)
        console.log('windows actionGoTop :', this.themeStore.actionScrollTopPage);
    }

  }

  public onActionScrollTopList(v: boolean, d = 0) {
    if (v == false) {
      this.themeStore.actionScrollTopList = v;
      this.cmsStoreService.setState({ type: SET_Theme_STATE, payload: this.themeStore });
      if (environment.consoleLog)
        console.log('windows actionGoTop :', this.themeStore.actionScrollTopList);
      return;
    }
    if (d > 0) {
      setTimeout(() => {
        this.themeStore.actionScrollTopList = v;
        this.cmsStoreService.setState({ type: SET_Theme_STATE, payload: this.themeStore });
        if (environment.consoleLog)
          console.log('windows actionGoTop :', this.themeStore.actionScrollTopList);
      }, 1000);
    }
    else {
      this.themeStore.actionScrollTopList = v;
      this.cmsStoreService.setState({ type: SET_Theme_STATE, payload: this.themeStore });
      if (environment.consoleLog)
        console.log('windows actionGoTop :', this.themeStore.actionScrollTopList);
    }

  }


  public cleanDataMenu(): void {
    if (this.themeStore?.dataMenu?.length > 0) {
      this.themeStore.dataMenu = '';
      this.cmsStoreService.setState({ type: SET_Theme_STATE, payload: this.themeStore });
    }
  }

}
