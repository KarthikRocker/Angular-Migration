import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MyCurrencyInputControlComponent } from './my-currency-input-control.component';
import { MyCurrencyPipe } from './my-currency.pipe';
import { OnlyNumberDirective } from './only-number.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    MyCurrencyInputControlComponent,
    MyCurrencyPipe,
    OnlyNumberDirective
  ],
  providers: [MyCurrencyPipe, CurrencyPipe],
  exports: [MyCurrencyInputControlComponent]
})
export class MyCurrencyInputControlModule { }
