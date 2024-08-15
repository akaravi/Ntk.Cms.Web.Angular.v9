import { Injectable } from '@angular/core';

import { CoreSiteService, FilterModel } from 'ntk-cms-api';
import { Observable } from 'rxjs';

@Injectable()
export class CoreSiteResolver {

    filterModel = new FilterModel();

    constructorInfoAreaId = this.constructor.name;
    constructor(private coreSiteService: CoreSiteService) {
    }

    resolve(): Observable<any> {
        return this.coreSiteService.ServiceGetAll(this.filterModel);
    }
}
