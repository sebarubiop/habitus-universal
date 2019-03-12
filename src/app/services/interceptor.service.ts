import { Injectable, Injector } from '@angular/core'
import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'

import { AuthenticationService } from './authentication.service'

@Injectable()
export class InterceptorService implements HttpInterceptor {

  constructor(
    private injector: Injector
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler){
    let authService = this.injector.get(AuthenticationService)
    let tokenizedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authService.getToken()}`
      }
    })
    return next.handle(tokenizedReq)
  }
}
