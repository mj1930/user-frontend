import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    baseUrl = environment.apiUrl;

    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler) {
        if(request.url == 'products/filter-products')
        {
            this.baseUrl = environment.sellerUrl;
        }
        let requestObject = {
            url: `${this.baseUrl}${request.url}`,
            setHeaders: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                Accept: 'application/json'
            }
        };

        if (request.url === 'users/admin/export') {
            requestObject['responseType'] = 'blob';
        }

        const authReq = request.clone(requestObject);
        return next.handle(authReq).pipe(
            catchError(this.handleError)
        );
    }

    handleError(error: HttpErrorResponse) {
        return throwError(error);
    }
}