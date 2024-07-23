
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ThemeStoreModel } from '../models/themeStoreModel';
import { CmsStoreService } from '../reducers/cmsStore.service';

export type ThemeModeType = 'dark' | 'light' | 'system';
export type ThemeDirectionType = 'ltr' | 'rtl';
const themeModeLSKey = 'theme_mode';
const themeHighLightLSKey = 'theme_highlight';
const themeDirectionSKey = 'theme_direction';
const themeLanguageSKey = 'theme_language';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  constructor(private cmsStoreService: CmsStoreService,) {
    const storeSnapshot = this.cmsStoreService.getStateSnapshot();
    if (storeSnapshot.themeStore)
      this.themeStore = storeSnapshot.themeStore;
  }

  public onInitAppComponent() {
    this.cmsStoreService.getState().subscribe((value) => {
      if (value.themeStore)
        this.themeStore = value.themeStore;
      if (value.themeStore?.themeMode) {
        setTimeout(() => {
          this.updateModeHtmlDom(value.themeStore);
        }, 10);
      }
      // if (value.themeStore?.themeHighlight) {
      //   setTimeout(() => {
      //     this.updateHighLightHtmlDom(value.themeStore.themeHighlight);
      //   }, 10);
      // }

    });
    this.updateMode(this.themeMode.value);
    this.updateHighLight(this.themeHighLight.value);

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
  getThemeModeFromLocalStorage(): ThemeModeType {
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
  getThemeHighLightFromLocalStorage(): string {
    if (!localStorage) {
      return '';
    }
    const data = localStorage.getItem(themeHighLightLSKey);
    if (!data) {
      return '';
    }
    return data;
  }
  getThemeLanguageFromLocalStorage(): string {
    if (!localStorage) {
      return 'en';
    }
    const data = localStorage.getItem(themeLanguageSKey);
    if (!data) {
      return 'en';
    }
    return data;
  }

  getThemeDirectionFromLocalStorage(): ThemeDirectionType {
    if (!localStorage)
      return 'ltr';
    const data = localStorage.getItem(themeDirectionSKey);
    if (data && data == 'ltr')
      return 'ltr';
    return 'ltr';
  }
  public themeMode: BehaviorSubject<ThemeModeType> =
    new BehaviorSubject<ThemeModeType>(
      this.getThemeModeFromLocalStorage()
    );
  public themeHighLight: BehaviorSubject<string> =
    new BehaviorSubject<string>(
      this.getThemeHighLightFromLocalStorage()
    );
  public themeLanguage: BehaviorSubject<string> =
    new BehaviorSubject<string>(
      this.getThemeLanguageFromLocalStorage()
    );

  public themeDirection: BehaviorSubject<ThemeDirectionType> =
    new BehaviorSubject<ThemeDirectionType>(
      this.getThemeDirectionFromLocalStorage()
    );
  public getSystemMode = (): ThemeModeType => {
    return window.matchMedia('(prefers-color-scheme: dark)') ? 'dark' : 'light'
  }
  public updateMode(_mode: ThemeModeType) {
    const updatedMode = _mode === 'system' ? this.getSystemMode() : _mode;
    this.themeMode.next(updatedMode);
    if (localStorage) {
      localStorage.setItem(themeModeLSKey, updatedMode);
    }
    this.themeStore.themeMode = updatedMode;
    this.cmsStoreService.setState({ themeStore: this.themeStore });
  }
  public updateMainPagePreloaderShow(v: boolean) {
    this.themeStore.mainPagePreloaderShow = v;
    this.cmsStoreService.setState({ themeStore: this.themeStore });
    if (environment.consoleLog)
      console.log('mainPagePreloaderShow :', this.themeStore.mainPagePreloaderShow);
  }
  public updateInnerSize() {
    this.themeStore.innerWidth = window.innerWidth;
    this.themeStore.innerHeight = window.innerHeight;
    this.cmsStoreService.setState({ themeStore: this.themeStore });
    if (environment.consoleLog)
      console.log('windows Width :', window.innerWidth, 'windows Height :', window.innerHeight);
  }
  private updateModeHtmlDom(model: ThemeStoreModel) {
    /**theme-dark */
    if (model?.themeMode == 'dark') {
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
    /**theme-rtl */
    if (model?.themeDirection == 'ltr') {
      document.documentElement.querySelectorAll('.theme-rtl').forEach((element) => {
        element.classList.remove('theme-rtl');
        element.classList.add('theme-ltr');
      });
      // document.getElementsByTagName('html')[0].setAttribute('dir', 'ltr');
      // document.getElementsByTagName('html')[0].setAttribute('direction', 'ltr');
      // document.getElementsByTagName('html')[0].setAttribute('style', 'direction: ltr');
    } else {
      document.documentElement.querySelectorAll('.theme-ltr').forEach((element) => {
        element.classList.remove('theme-ltr');
        element.classList.add('theme-rtl');
      });
      // document.getElementsByTagName('html')[0].setAttribute('dir', 'rtl');
      // document.getElementsByTagName('html')[0].setAttribute('direction', 'rtl');
      // document.getElementsByTagName('html')[0].setAttribute('style', 'direction: rtl');
    }
    /**theme-rtl */
    /* HighLigh*/
    if (model?.themeHighlight.length > 0) {
      var pageHighlight = document.querySelectorAll('.page-highlight');
      if (pageHighlight.length) {
        pageHighlight.forEach(function (e) { e.remove(); });
      }
      var loadHighlight = document.createElement("link");
      loadHighlight.rel = "stylesheet";
      loadHighlight.className = "page-highlight";
      loadHighlight.type = "text/css";
      loadHighlight.href = 'assets/styles/highlights/highlight_' + model.themeHighlight + '.css';
      document.getElementsByTagName("head")[0].appendChild(loadHighlight);
      //document.body.setAttribute('data-highlight', 'highlight-' + colorStr)
    }
    /* HighLigh*/
  }
  public onActionScrollTopPage(v: boolean, d = 0) {
    if (v == false) {
      this.themeStore.actionScrollTopPage = v;
      this.cmsStoreService.setState({ themeStore: this.themeStore });
      if (environment.consoleLog)
        console.log('windows actionGoTop :', this.themeStore.actionScrollTopPage);
      return;
    }
    if (d > 0) {
      setTimeout(() => {
        this.themeStore.actionScrollTopPage = v;
        this.cmsStoreService.setState({ themeStore: this.themeStore });
        if (environment.consoleLog)
          console.log('windows actionGoTop :', this.themeStore.actionScrollTopPage);
      }, 1000);
    }
    else {
      this.themeStore.actionScrollTopPage = v;
      this.cmsStoreService.setState({ themeStore: this.themeStore });
      if (environment.consoleLog)
        console.log('windows actionGoTop :', this.themeStore.actionScrollTopPage);
    }

  }

  public onActionScrollTopList(v: boolean, d = 0) {
    if (v == false) {
      this.themeStore.actionScrollTopList = v;
      this.cmsStoreService.setState({ themeStore: this.themeStore });
      if (environment.consoleLog)
        console.log('windows actionGoTop :', this.themeStore.actionScrollTopList);
      return;
    }
    if (d > 0) {
      setTimeout(() => {
        this.themeStore.actionScrollTopList = v;
        this.cmsStoreService.setState({ themeStore: this.themeStore });
        if (environment.consoleLog)
          console.log('windows actionGoTop :', this.themeStore.actionScrollTopList);
      }, 1000);
    }
    else {
      this.themeStore.actionScrollTopList = v;
      this.cmsStoreService.setState({ themeStore: this.themeStore });
      if (environment.consoleLog)
        console.log('windows actionGoTop :', this.themeStore.actionScrollTopList);
    }

  }
  public updateHighLight(colorStr: string) {
    if (!colorStr || colorStr.length == 0)
      return;
    this.themeHighLight.next(colorStr);
    if (localStorage) {
      localStorage.setItem(themeHighLightLSKey, colorStr);
    }
    this.themeStore.themeHighlight = colorStr;
    this.cmsStoreService.setState({ themeStore: this.themeStore });
  }
  public updateDirection(model: ThemeDirectionType) {
    if (!model)
      return;
    this.themeHighLight.next(model);
    if (localStorage) {
      localStorage.setItem(themeDirectionSKey, model);
    }
    this.themeStore.themeDirection = model;
    this.cmsStoreService.setState({ themeStore: this.themeStore });
  }
  public updateLanguage(model: string) {
    if (!model)
      return;
    this.themeLanguage.next(model);
    if (localStorage) {
      localStorage.setItem(themeLanguageSKey, model);
    }
    this.themeStore.themeLanguage = model;
    this.cmsStoreService.setState({ themeStore: this.themeStore });
  }

  public cleanDataMenu(): void {
    if (this.themeStore?.dataMenu?.length > 0) {
      this.themeStore.dataMenu = '';
      this.cmsStoreService.setState({ themeStore: this.themeStore });
    }
  }

}
