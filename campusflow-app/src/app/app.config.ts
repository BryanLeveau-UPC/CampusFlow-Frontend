import { ApplicationConfig,  } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations'; // Importar
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // Importar

import { routes } from './app.routes'; // Asegúrate de que esta ruta sea correcta


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
  ]
};
