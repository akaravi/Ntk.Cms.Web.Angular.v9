
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'
import { CmsStoreService } from '../reducers/cmsStore.service';
import { ThemeStoreModel } from '../models/themeStoreModel';

export type ThemeModeType = 'dark' | 'light' | 'system';
//type Mode = 'light' | 'dark' | 'system'
const themeModeLSKey = 'theme_mode';
export class ThemeMode {
  menu: HTMLElement | null = null
  element: HTMLElement | null = null
  public init = () => {
    //this.menu = document.querySelector<HTMLElement>('[data-kt-element="theme-mode-menu"]')
    this.element = document.documentElement

    this.initMode();
  }

  private initMode = (): void => {
    // this.setMode(this.getMode(), this.getMenuMode())
    // if (this.element) {
    //   EventHandlerUtil.trigger(this.element, 'kt.thememode.init')
    // }
  }
  public setMode = (mode: ThemeModeType): void => {
    // Check input values
    if (mode !== 'light' && mode !== 'dark') {
      return
    }

    // Store mode value in storage
    if (localStorage) {
      localStorage.setItem(themeModeLSKey, mode)
    }
  }
  public getMode = (): ThemeModeType => {
    const defaultMode = 'light'
    if (!localStorage) {
      return defaultMode
    }
    const ls = localStorage.getItem(themeModeLSKey)
    if (ls) {
      return ls as ThemeModeType
    }
    if (ls === 'system') {
      return this.getSystemMode()
    }
    return ls as ThemeModeType
  }


  public getSystemMode = (): ThemeModeType => {
    return window.matchMedia('(prefers-color-scheme: dark)') ? 'dark' : 'light'
  }
}


const ThemeModeComponent = new ThemeMode()
const systemMode = ThemeModeComponent.getSystemMode() as 'light' | 'dark';


export { ThemeModeComponent }

@Injectable({
  providedIn: 'root',
})
export class ThemeModeService {
  constructor(private cmsStoreService: CmsStoreService,) {

  }

  public init() {
    this.cmsStoreService.getState().subscribe((value) => {
      if (value.themeStore)
        this.themeStore = value.themeStore;
      if (value.themeStore?.themeMode) {
        setTimeout(() => {
          this.updateModeHtmlDom(value.themeStore.themeMode);
        }, 1000);
      }
    });
    this.updateMode(this.mode.value);
  }
  themeStore = new ThemeStoreModel()
  getThemeModeFromLocalStorage(lsKey: string): ThemeModeType {
    if (!localStorage) {
      return 'light';
    }
    const data = localStorage.getItem(lsKey);
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

  public mode: BehaviorSubject<ThemeModeType> =
    new BehaviorSubject<ThemeModeType>(
      this.getThemeModeFromLocalStorage(themeModeLSKey)
    );

  public updateMode(_mode: ThemeModeType) {
    const updatedMode = _mode === 'system' ? systemMode : _mode;
    this.mode.next(updatedMode);
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
    //todo: تکمیل شود
    //ThemeModeComponent.init();
  }
}
