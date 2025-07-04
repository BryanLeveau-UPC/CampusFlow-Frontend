import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const seguridadGuard = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Verificar si el usuario está logueado y el token no ha expirado
  if (!authService.verificar()) {
    router.navigate(['/login']);
    return false;
  }

  // 2. Obtener los roles esperados de la ruta (definidos en data: { roles: [...] })
  const expectedRoles = route.data['roles'] as string[];
  const userRole = authService.getUserRole(); // Obtener el rol del usuario logueado

  // 3. Si la ruta requiere roles específicos
  if (expectedRoles && expectedRoles.length > 0) {
    // 4. Verificar si el rol del usuario está incluido en los roles esperados
    if (userRole && expectedRoles.includes(userRole)) {
      console.log(`AuthGuard: Acceso concedido para rol ${userRole}.`);
      return true; // Usuario autenticado y con el rol permitido
    } else {
      // Usuario autenticado pero sin el rol requerido
      console.warn(`AuthGuard: Acceso denegado. Rol '${userRole}' no autorizado para la ruta. Roles esperados: ${expectedRoles ? expectedRoles.join(', ') : 'Ninguno'}.`);
      router.navigate(['/error-carga']); // Redirigir a una página de error o acceso denegado
      return false;
    }
  }

  // 5. Si no se especifican roles para la ruta, solo se requiere estar autenticado
  console.log('AuthGuard: Acceso concedido (solo autenticación requerida).');
  return true;
};
