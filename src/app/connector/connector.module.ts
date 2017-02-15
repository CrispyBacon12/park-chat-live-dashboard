import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ConnectorComponent } from './connector.component';
import { ConnectorControlComponent } from './connector-control/connector-control.component';

import { FacebookService } from './facebook/facebook.service';
import { CommentComponent } from './comment/comment.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    ConnectorComponent
  ],
  declarations: [
    ConnectorComponent,
    ConnectorControlComponent,
    CommentComponent
  ],
  providers: [
    FacebookService
  ]
})
export class ConnectorModule { }

export interface Image {
  src: string;
  alt: string;
  size: {
    height: number;
    width: number;
  }
}