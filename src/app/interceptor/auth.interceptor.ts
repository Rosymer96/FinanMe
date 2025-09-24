import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
 const authService = inject(AuthService);
  const token = authService.getToken();

  const router = inject(Router);

const publicRouterPaths = ['/login', '/register'];
  const isPublicPath = publicRouterPaths.some((path) => req.url.includes(path));

  if (token && !isPublicPath) { 
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  } else if (!isPublicPath) {
    router.navigate(['/login']);
  }

  return next(req);
};



