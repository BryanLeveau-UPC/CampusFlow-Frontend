import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegistroEstudianteComponent } from './components/registro/registro-estudiante/registro-estudiante.component';
import { RegistroProfesorComponent } from './components/registro/registro-profesor/registro-profesor.component';
import { AsignaturaComponent } from './components/asignatura/asignatura.component';
import { EventoComponent } from './components/evento/evento.component';
import { GrupoForoComponent } from './components/grupo-foro/grupo-foro.component';
import { EstudianteComponent } from './components/estudiante/estudiante.component';
import { PublicacionComponent } from './components/publicacion/publicacion.component';
import { RecursosComponent } from './components/recursos/recursos.component';
import { HorarioComponent } from './components/horario/horario.component';
import { NotaComponent } from './components/nota/nota.component';
import { RecompensaComponent } from './components/recompensa/recompensa.component';
import { TareasComponent } from './components/tareas/tareas.component';
import { RegistroSelectorComponent } from './components/registro/registro-selector/registro-selector.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registro-Selector', component: RegistroSelectorComponent },
  { path: 'registrar-estudiante', component: RegistroEstudianteComponent },
  { path: 'registrar-profesor', component: RegistroProfesorComponent },
  { path: 'asignatura', component: AsignaturaComponent },
  { path: 'estudiantes', component: EstudianteComponent },
  { path: 'evento', component: EventoComponent },
  { path: 'grupo-foro', component: GrupoForoComponent },
  { path: 'grupo-foro/publicacion', component: PublicacionComponent },
  { path: 'grupo-foro/recursos', component: RecursosComponent },
  { path: 'horario', component: HorarioComponent },
  { path: 'nota', component: NotaComponent },
  { path: 'recompensa', component: RecompensaComponent },
  { path: 'tareas', component: TareasComponent }
];
