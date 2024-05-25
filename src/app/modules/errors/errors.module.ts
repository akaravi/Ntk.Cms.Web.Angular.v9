import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ComponentsModule } from 'src/app/components/components.module';
import { ErrorsComponent } from '../errors/errors.component';
import { Error404Component } from './error404/error404.component';
import { Error500Component } from './error500/error500.component';
import { ErrorsRoutingModule } from './errors.routing';


@NgModule({
  declarations: [
    ErrorsComponent,
    Error404Component,
    Error500Component
  ],
  imports: [
    CommonModule,
    ErrorsRoutingModule,
    ComponentsModule
  ]
})
export class ErrorsModule { }
