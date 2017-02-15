import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { ConnectorModule } from './connector/connector.module';

import { AppComponent } from './app.component';

import { WindowService } from './window/window.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ConnectorModule
  ],
  providers: [
    {provide: WindowService, useValue: window}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
