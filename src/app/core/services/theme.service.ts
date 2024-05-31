
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ThemeStoreModel } from '../models/themeStoreModel';
import { CmsStoreService } from '../reducers/cmsStore.service';


export type ThemeModeType = 'dark' | 'light' | 'system';
const themeModeLSKey = 'theme_mode';
const themeHighLightLSKey = 'theme_highlight';
@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  constructor(private cmsStoreService: CmsStoreService,) {

  }

  public onInitAppComponent() {
    this.cmsStoreService.getState().subscribe((value) => {
      if (value.themeStore)
        this.themeStore = value.themeStore;
      if (value.themeStore?.themeMode) {
        setTimeout(() => {
          this.updateModeHtmlDom(value.themeStore.themeMode);
        }, 100);
      }

      if (value.themeStore?.highlight) {
        setTimeout(() => {
          this.updateHighLightHtmlDom(value.themeStore.highlight);
        }, 200);
      }

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
  public themeMode: BehaviorSubject<ThemeModeType> =
    new BehaviorSubject<ThemeModeType>(
      this.getThemeModeFromLocalStorage()
    );
  public themeHighLight: BehaviorSubject<string> =
    new BehaviorSubject<string>(
      this.getThemeHighLightFromLocalStorage()
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
  public updateInnerSize() {
    this.themeStore.innerWidth = window.innerWidth;
    this.themeStore.innerHeight = window.innerHeight;
    this.cmsStoreService.setState({ themeStore: this.themeStore });
    console.log('windows Width :', window.innerWidth, 'windows Height :', window.innerHeight);
  }
  private updateModeHtmlDom(updatedMode: ThemeModeType) {
    if (updatedMode == 'dark') {
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
  }
  public updateHighLight(colorStr: string) {
    if (!colorStr || colorStr.length == 0)
      return;
    this.themeHighLight.next(colorStr);
    if (localStorage) {
      localStorage.setItem(themeHighLightLSKey, colorStr);
    }
    this.themeStore.highlight = colorStr;
    this.cmsStoreService.setState({ themeStore: this.themeStore });
  }
  private updateHighLightHtmlDom(colorStr: string) {
    if (!colorStr || colorStr.length == 0)
      return;

    var pageHighlight = document.querySelectorAll('.page-highlight');
    if (pageHighlight.length) { pageHighlight.forEach(function (e) { e.remove(); }); }

    var loadHighlight = document.createElement("link");
    loadHighlight.rel = "stylesheet";
    loadHighlight.className = "page-highlight";
    loadHighlight.type = "text/css";
    loadHighlight.href = 'assets/styles/highlights/highlight_' + colorStr + '.css';
    document.getElementsByTagName("head")[0].appendChild(loadHighlight);
    //document.body.setAttribute('data-highlight', 'highlight-' + colorStr)
  }
  public cleanDataMenu(): void {
    if (this.themeStore?.dataMenu?.length > 0) {
      this.themeStore.dataMenu = '';
      this.cmsStoreService.setState({ themeStore: this.themeStore });
    }
  }
}
