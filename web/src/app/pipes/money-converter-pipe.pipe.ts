import { Pipe, PipeTransform } from '@angular/core';
import Decimal from 'decimal.js';

@Pipe({
  name: 'moneyConverterPipe'
})
export class MoneyConverterPipePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    let val = new Decimal(value);
    if (val > new Decimal(1000000)) {
      val.div(1000000);
    }
    return val.toString();
  }

}
