import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegistroEstudianteComponent } from './components/auth/registro-estudiante/registro-estudiante.component';
import { RegistroProfesorComponent } from './components/auth/registro-profesor/registro-profesor.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registrar-estudiante', component: RegistroEstudianteComponent },
  { path: 'registrar-profesor', component: RegistroProfesorComponent }
];
