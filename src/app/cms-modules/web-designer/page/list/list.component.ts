import { Component } from '@angular/core';
import { WebDesignerMainPageListGridComponent } from '../list-grid/list-grid.component';
@Component({
    selector: 'app-webdesigner-page-list',
    templateUrl: './list.component.html',
    standalone: false
})
export class WebDesignerMainPageListComponent extends WebDesignerMainPageListGridComponent {
}
