// src/app/pipes/price-formatter.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priceFormatter'
})
export class PriceFormatterPipe implements PipeTransform {
  transform(value: number, currencySymbol: string = '$', decimalPlaces: number = 2): string {
    const formattedPrice = value.toFixed(decimalPlaces);
    return `${currencySymbol}${formattedPrice}`;
  }
}