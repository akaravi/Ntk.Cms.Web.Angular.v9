import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Actions, initialState, ReducerCmsStore, stateReducer } from './reducer.factory';

@Injectable({
  providedIn: 'root',
})
export class CmsStoreService {
  private state: ReducerCmsStore;
  //private sub: Subject<AppStoreModel> = new Subject<AppStoreModel>();
  private stateSubject: BehaviorSubject<ReducerCmsStore>;
  constructor() {
    this.state = initialState;
    this.stateSubject = new BehaviorSubject(this.state);
    // @ts-ignore
    window.getInfo = () => this.state;
  }
  public getStateSnapshot(): ReducerCmsStore {
    return (this.stateSubject.getValue());
  }
  setState(param: Actions): void {
    Object.assign(this.state, stateReducer(this.state, param));
    //this.sub.next(this.state);
    this.stateSubject.next(this.state);
  }
  getState<R>(mapFn: (value: ReducerCmsStore, index: number) => R): Observable<R> {
    if (typeof mapFn !== 'function') {
      throw new TypeError('argument is not a function. Are you looking for `mapTo()`?');
    }
    return this.stateSubject.asObservable()
      .pipe(map(mapFn))
      .pipe(distinctUntilChanged());
  }
  getStateDirect(): Observable<ReducerCmsStore> {
    return (this.stateSubject.pipe(distinctUntilChanged()));
  }
}
