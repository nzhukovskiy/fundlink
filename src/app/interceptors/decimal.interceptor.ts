import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor, HttpResponse,
} from '@angular/common/http';
import { map, Observable } from 'rxjs';
import Decimal from 'decimal.js';

@Injectable()
export class DecimalInterceptor implements HttpInterceptor {

    private decimalFields = new Set(['amount']);

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            map(event => {
                if (event instanceof HttpResponse) {
                    const modifiedBody = this.convertDecimalFields(event.body);
                    return event.clone({ body: modifiedBody });
                }
                return event;
            })
        );
    }

    private convertDecimalFields(data: any): any {
        return this.recursiveConvert(data);
    }

    private recursiveConvert(obj: any): any {
        if (Array.isArray(obj)) {
            return obj.map(item => this.recursiveConvert(item));
        }

        if (obj !== null && typeof obj === 'object') {
            const convertedObj: any = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    convertedObj[key] = this.shouldConvert(key, obj[key])
                        ? this.convertToDecimal(obj[key])
                        : this.recursiveConvert(obj[key]);
                }
            }
            return convertedObj;
        }

        return obj;
    }

    private shouldConvert(key: string, value: any): boolean {
        return this.decimalFields.has(key) &&
            typeof value === 'string' &&
            !isNaN(Number(value));
    }

    private convertToDecimal(value: string): Decimal {
        try {
            return new Decimal(value);
        } catch (e) {
            console.warn(`Decimal conversion failed for value: ${value}`);
            return new Decimal(NaN);
        }
    }
}
