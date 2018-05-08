import { Pipe, PipeTransform } from "@angular/core";
import { CurrencyPipe } from '@angular/common';
import { isNullOrUndefined } from "util";

const PADDING = "000000";
const FRACTION_VALUE: string = "00";
const EMPTY_STRING: string = "";
const DOT: string = ".";

@Pipe({ name: "myCurrency" })
export class MyCurrencyPipe implements PipeTransform {

    private readonly DECIMAL_SEPARATOR: string;
    private readonly THOUSANDS_SEPARATOR: string;
    private readonly MAX_PRECISION: number;

    constructor(private currencyPipe: CurrencyPipe) {
        // TODO comes from configuration settings
        this.DECIMAL_SEPARATOR = ",";
        this.THOUSANDS_SEPARATOR = " ";
        this.MAX_PRECISION = 2;
    }

    transform(value: number | string, fractionSize: number = this.MAX_PRECISION): string {
        var validValue = value.toString().replace(this.DECIMAL_SEPARATOR, DOT).replace(/\s/g, EMPTY_STRING).trim();
        return isNullOrUndefined(validValue) || validValue == EMPTY_STRING || validValue == "." ? "0,00" : this.currencyPipe.transform(parseFloat(validValue), ' ', 'symbol', '1.2-2', 'fr').trim();
    }

    parse(value: string, fractionSize: number = this.MAX_PRECISION): string {
        let [integer, fraction = EMPTY_STRING] = (value || EMPTY_STRING).split(this.DECIMAL_SEPARATOR);

        integer = integer.replace(new RegExp(this.THOUSANDS_SEPARATOR, "g"), EMPTY_STRING);
        integer = integer == EMPTY_STRING ? "0" : integer;
        fraction = parseInt(fraction, 10) > 0 && fractionSize > 0
            ? this.DECIMAL_SEPARATOR + (fraction + PADDING).substring(0, fractionSize)
            : this.DECIMAL_SEPARATOR + FRACTION_VALUE;

        return (integer + fraction).replace(/\s/g, EMPTY_STRING);
    }
}