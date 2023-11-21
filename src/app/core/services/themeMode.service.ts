
import { Injectable, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs'
import { CmsStoreService } from '../reducers/cmsStore.service';
import { ThemeStoreModel } from '../models/themeStoreModel';

export type ThemeModeType = 'dark' | 'light' | 'system';
const themeModeLSKey = 'theme_mode';
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
    });
    this.updateMode(this.mode.value);
  }
  public afterViewInit() {
    //Activating Menus
    document.querySelectorAll('.menu').forEach(el => {
      const node = el as HTMLElement;
      node.style.display = 'block'
    })

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

  public mode: BehaviorSubject<ThemeModeType> =
    new BehaviorSubject<ThemeModeType>(
      this.getThemeModeFromLocalStorage()
    );

  public getSystemMode = (): ThemeModeType => {
    return window.matchMedia('(prefers-color-scheme: dark)') ? 'dark' : 'light'
  }
  public updateMode(_mode: ThemeModeType) {
    const updatedMode = _mode === 'system' ? this.getSystemMode() : _mode;
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

  }

}
