import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegistroEstudianteComponent } from './components/registro/registro-estudiante/registro-estudiante.component';
import { RegistroProfesorComponent } from './components/registro/registro-profesor/registro-profesor.component';
import { AsignaturaComponent } from './components/asignatura/asignatura.component';
import { ListarEstudiantesComponent } from './components/estudiante/estudiante.component';
import { RegistroSelectorComponent } from './components/registro/registro-selector/registro-selector.component';
import { IndexComponent } from './pages/index/index.component';
import { NosotrosComponent } from './pages/nosotros/nosotros.component';
import { MarcasComponent } from './pages/marcas/marcas.component';
import { EstudianteDashboardComponent } from './components/dashboard/estudiante-dashboard/estudiante-dashboard.component';
import { ProfesorDashboardComponent } from './components/dashboard/profesor-dashboard/profesor-dashboard.component';
import { ErrorDashboardComponent } from './components/dashboard/dasboard-error/dasboard-error.component';
import { EventoRegistrarComponent } from './components/evento/evento-registrar/evento-registrar.component';
import { EventoListarComponent } from './components/evento/evento-listar/evento-listar.component';
import { ForoListarComponent } from './components/foro/foro-listar/foro-listar.component';
import { HorarioListarComponent } from './components/horario/horario-listar/horario-listar.component';
//import { NotaListarComponent } from './components/nota/nota-listar/nota-listar.component';
import { TareaListarComponent } from './components/tarea/tarea-listar/tarea-listar.component';
import { TareaRegistrarComponent } from './components/tarea/tarea-registrar/tarea-registrar.component';
import { PublicacionListarComponent } from './components/publicacion/publicacion-listar/publicacion-listar.component';
import { RecompensaRegistrarComponent } from './components/recompensa/recompensa-registrar/recompensa-registrar.component';
import { RecompensaListarComponent } from './components/recompensa/recompensa-listar/recompensa-listar.component';
import { RecursoRegistrarComponent } from './components/recurso/recurso-registrar/recurso-registrar.component';
import { RecursoListarComponent } from './components/recurso/recurso-listar/recurso-listar.component';
import { NotasAsignaturaComponent } from './components/notas-asignatura/notas-asignatura.component';
import { PublicacionRegistroComponent } from './components/publicacion/publicacion-registrar/publicacion-registrar.component';
import { CrearForoProfesorComponent } from './components/crear-foro/crear-foro.component';
import { RegistrarNotasComponent } from './components/registrar-notas/registrar-notas.component';

export const routes: Routes = [
  { path: '', redirectTo: '/index', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registro-Selector', component: RegistroSelectorComponent },
  { path: 'registrar-estudiante', component: RegistroEstudianteComponent },
  { path: 'registrar-profesor', component: RegistroProfesorComponent },
  { path: 'asignatura', component: AsignaturaComponent },
  { path: 'estudiantes', component: ListarEstudiantesComponent },

  { path: 'registrar-evento', component: EventoRegistrarComponent },
  
  { path: 'listar-evento', component: EventoListarComponent },
  { path: 'listar-grupo-foro', component: ForoListarComponent },
  { path: 'registrar-publicacion', component: PublicacionRegistroComponent },
  { path: 'publicaciones', component: PublicacionListarComponent },
  { path: 'listar-publicacion', component: PublicacionListarComponent },
  { path: 'listar-horario', component: HorarioListarComponent },
  //{ path: 'listar-nota', component: NotaListarComponent },
  { path: 'listar-tareas', component: TareaListarComponent },
  { path: 'tarea/registrar', component: TareaRegistrarComponent },
  { path: 'index', component: IndexComponent },
  { path: 'marcas', component: MarcasComponent },
  { path: 'dashboard-estudiante', component: EstudianteDashboardComponent },
  { path: 'dashboard-profesor', component: ProfesorDashboardComponent },
  { path: 'error-carga', component: ErrorDashboardComponent },
  { path: 'registrar-recompensa', component: RecompensaRegistrarComponent },
  { path: 'listar-recompensa', component: RecompensaListarComponent },
  { path: 'registrar-recurso', component: RecursoRegistrarComponent },
  { path: 'listar-recurso', component: RecursoListarComponent },
  { path: 'nota', component: NotasAsignaturaComponent },
  { path: 'notas', component: NotasAsignaturaComponent },
  {path: 'recurso', component: RecursoListarComponent },
  {path: 'publicacion', component: PublicacionListarComponent },
  {path: 'tarea', component: TareaListarComponent }, 
  {path: 'horario', component: HorarioListarComponent }, 
  {path: 'grupo-foro', component: ForoListarComponent }, 
  {path: 'foro', component: ForoListarComponent }, 
  {path: 'nuevo/grupo-foro', component: CrearForoProfesorComponent }, 
  {path: 'registrar-notas', component: RegistrarNotasComponent }, 
  { path: 'grupo-foro/:idGrupoForo/publicaciones', component: PublicacionListarComponent },
  { path: '**', redirectTo: '/index' },
];