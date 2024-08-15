// Localization is based on '@ngx-translate/core';
// Please be familiar with official documentations first => https://github.com/ngx-translate/core

import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, firstValueFrom } from 'rxjs';

export interface Locale {
  lang: string;
  data: any;
}

const LOCALIZATION_LOCAL_STORAGE_KEY = 'language';

// @Injectable({
//   providedIn: 'root',
// })
@Injectable()
export class CmsTranslationService {
  // Private properties
  private langIds: any = [];

  constructor(public translate: TranslateService) {
    const langToSet = localStorage.getItem(LOCALIZATION_LOCAL_STORAGE_KEY) || this.translate.getDefaultLang()
    translate.addLangs([langToSet]);
    translate.setDefaultLang(langToSet);

  }
  instantDefault(key: string | Array<string>, interpolateParams?: Object): string | any {
    return this.translate.instant(key);
  }

  instant(key: string | Array<string>, interpolateParams?: Object): string | any {
    return this.translate.instant(key);
  }

  get(key: string | Array<string>, interpolateParams?: Object): Observable<string | any> {
    return this.translate.get(key);
  }


  loadTranslations(...args: Locale[]): void {
    const locales = [...args];

    locales.forEach((locale) => {
      // use setTranslation() with the third argument set to true
      // to append translations instead of replacing them
      this.translate.setTranslation(locale.lang, locale.data, true);

      this.langIds.push(locale.lang);
    });

    // add new languages to the list
    this.translate.addLangs(this.langIds);
  }

  setLanguage(lang: string): void {
    if (lang && lang.length > 0) {
      const langToSet = localStorage.getItem(LOCALIZATION_LOCAL_STORAGE_KEY) || this.translate?.getDefaultLang() || 'fa';
      firstValueFrom(this.translate.use(langToSet));
      if (langToSet !== lang)
        firstValueFrom(this.translate.use(lang));
      localStorage.setItem(LOCALIZATION_LOCAL_STORAGE_KEY, lang);
    }
  }

  /**
   * Returns selected language
   */
  getSelectedLanguage(): string {
    return (
      localStorage.getItem(LOCALIZATION_LOCAL_STORAGE_KEY) ||
      this.translate.getDefaultLang()
    );
  }
}
function resolve(text: string): void {
  throw new Error('Function not implemented.');
}

