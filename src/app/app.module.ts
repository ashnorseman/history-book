/**
 * App module
 */

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { UIModule } from '@signify/interact-ui';
import { ToolkitModule } from 'wintersun-toolkit';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShiJingComponent } from './pages/shi-jing/shi-jing.component';
import { ZuoZhuanComponent } from './pages/zuo-zhuan/zuo-zhuan.component';
import { TextComponent } from './text/text.component';
import { TimelineComponent } from './timeline/timeline.component';

@NgModule({
  declarations: [AppComponent, TimelineComponent, TextComponent, ZuoZhuanComponent, ShiJingComponent],
  imports: [BrowserModule, AppRoutingModule, ToolkitModule, UIModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
