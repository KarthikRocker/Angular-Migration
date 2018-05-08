import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr);

import { AppComponent } from './app.component';
import { registerLocaleData } from '@angular/common';
import { MyCurrencyFormatterDirective } from './currencyFormatter.directive';
import { MyCurrencyInputControlModule } from './my-currency-input-control/my-currency-input-control.module';

@NgModule({
  declarations: [
    AppComponent,
    MyCurrencyFormatterDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    MyCurrencyInputControlModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
