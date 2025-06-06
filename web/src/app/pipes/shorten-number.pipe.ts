import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortenNumber'
})
export class ShortenNumberPipe implements PipeTransform {

    transform(value: string, currencySymbol: string = '₽'): string {

        let suffix = '';
        const newValue = parseInt(value);
        let shortened = newValue;

        if (newValue >= 1_000_000_000) {
            shortened = newValue / 1_000_000_000;
            suffix = ' млрд.';
        } else if (newValue >= 1_000_000) {
            shortened = newValue / 1_000_000;
            suffix = ' млн.';
        } else if (newValue >= 1_000) {
            shortened = newValue / 1_000;
            suffix = ' тыс.';
        }

        const formatted = shortened % 1 === 0 ? shortened.toFixed(0) : shortened.toFixed(1);

        return `${formatted} ${suffix} ${currencySymbol}`;
    }

}
