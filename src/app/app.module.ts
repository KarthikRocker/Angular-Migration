import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe } from '@angular/common';

import { AppComponent } from './app.component';
import { CurrencyFormatterDirective } from './currencyFormatter.directive';

@NgModule({
  declarations: [
    AppComponent,
    CurrencyFormatterDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
