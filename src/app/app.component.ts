import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'My First Angular App!';
  amount: number = 0;
  formattedAmount: string;
  constructor(){
  }

  // transformAmount(element: HTMLElement) {
  //   this.formattedAmount = this.currencyPipe.transform(this.amount, ' ', 'symbol', '4.2-2', 'fr').trim();
  //   element.nodeValue = this.formattedAmount;
  // }
}
