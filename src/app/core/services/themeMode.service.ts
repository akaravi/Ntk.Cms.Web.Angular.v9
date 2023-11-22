
import { Injectable, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs'
import { CmsStoreService } from '../reducers/cmsStore.service';
import { ThemeStoreModel } from '../models/themeStoreModel';


export type ThemeModeType = 'dark' | 'light' | 'system';
const themeModeLSKey = 'theme_mode';
const themeHighLightLSKey = 'theme_highlight';
@Injectable({
  providedIn: 'root',
})
export class ThemeModeService {
  constructor(private cmsStoreService: CmsStoreService,) {

  }

  public onInit() {
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
  public afterViewInit() {
    //Activating Menus
    document.querySelectorAll('.menu').forEach(el => {
      const node = el as HTMLElement;
      node.style.display = 'block'
    });
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
    //debugger;
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
}
