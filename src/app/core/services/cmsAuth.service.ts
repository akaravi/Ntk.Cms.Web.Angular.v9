import { Injectable, OnDestroy } from '@angular/core';
import { TokenInfoModel } from 'ntk-cms-api';
import { BehaviorSubject, Observable, Subscription, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CmsAuthService implements OnDestroy {
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  // public fields
  currentUser$: Observable<TokenInfoModel> = new Observable<TokenInfoModel>();
  currentUserSubject: BehaviorSubject<TokenInfoModel> = new BehaviorSubject<TokenInfoModel>(new TokenInfoModel());
  isLoading$: Observable<boolean> = new Observable<boolean>();
  isLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  get currentUserValue(): TokenInfoModel {
    return this.currentUserSubject.value;
  }
  constructor() {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<TokenInfoModel>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
    // const subscr = this.getUserByToken().subscribe();
    // this.unsubscribe.push(subscr);
  }
  private authLocalStorageToken = `${environment.appVersion}-${environment.authKey}`;

  getUserByToken(): any {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.token) {
      return of(undefined);
    }
    this.isLoadingSubject.next(true);
  }
  private getAuthFromLocalStorage(): TokenInfoModel {
    try {
      const authData = JSON.parse(
        localStorage.getItem(this.authLocalStorageToken)
      );
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
