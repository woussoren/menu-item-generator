import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app.routing.module';
import {SlideMenuModule} from 'primeng/slidemenu';
import {ButtonModule} from 'primeng/button';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { NavigationComponent } from './navigation/navigation.component';

@NgModule({
  imports:      [ BrowserModule, BrowserAnimationsModule, FormsModule, SlideMenuModule, AppRoutingModule, ButtonModule ],
  declarations: [ AppComponent, HelloComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
