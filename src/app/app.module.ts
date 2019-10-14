import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GfxModule } from './gfx/gfx.module';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([{
      path: '',
      component: HomeComponent,
    }]),
    GfxModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
