import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BienvenidaComponent } from './bienvenida/bienvenida.component';
import {RouterModule, Routes} from "@angular/router";
import { AsignarcodinadorvinculacionComponent } from './asignarcodinadorvinculacion/asignarcodinadorvinculacion.component';
import {MaterialModule} from "../../../material/material.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { VercordinadorvinculacionComponent } from './vercordinadorvinculacion/vercordinadorvinculacion.component';
import { NuevaendidadbeneficiariaComponent } from './nuevaendidadbeneficiaria/nuevaendidadbeneficiaria.component';
import { VerentidadesbeneficariasComponent } from './verentidadesbeneficarias/verentidadesbeneficarias.component';
import { EditarentidadbeneficiariaComponent } from './editarentidadbeneficiaria/editarentidadbeneficiaria.component';
import { NuevoresponsablepppComponent } from './nuevoresponsableppp/nuevoresponsableppp.component';
import { VerresposabledepppComponent } from './verresposabledeppp/verresposabledeppp.component';
import { NuevoproyectoComponent } from './nuevoproyecto/nuevoproyecto.component';
import {MaterialFileInputModule} from "ngx-material-file-input";
import { VerproyectosComponent } from './verproyectos/verproyectos.component';
import { EditarproyectoComponent } from './editarproyecto/editarproyecto.component';
import { DocentesdeapoyofirmaComponent } from './docentesdeapoyofirma/docentesdeapoyofirma.component';
import { AgregaractividadesyrequisitosComponent } from './agregaractividadesyrequisitos/agregaractividadesyrequisitos.component';
import { Verproyectos1Component } from './verproyectos1/verproyectos1.component';
import { NuavaconvocatariaComponent } from './nuavaconvocataria/nuavaconvocataria.component';
import { VerconvocatoriasComponent } from './verconvocatorias/verconvocatorias.component';
import { EditarconvocatoriaComponent } from './editarconvocatoria/editarconvocatoria.component';
import { Verconvocatorias1Component } from './verconvocatorias1/verconvocatorias1.component';
import { VerpostulacionesComponent } from './verpostulaciones/verpostulaciones.component';
import { Verpostulaciones1Component } from './verpostulaciones1/verpostulaciones1.component';
import { FirmarpostulacionComponent } from './firmarpostulacion/firmarpostulacion.component';
import { VerfirmadepostulacionComponent } from './verfirmadepostulacion/verfirmadepostulacion.component';
import { DelegaciondealumnosComponent } from './delegaciondealumnos/delegaciondealumnos.component';
import { VerdelegacionesComponent } from './verdelegaciones/verdelegaciones.component';
import { AdelagaciondealumnosfirmaComponent } from './adelagaciondealumnosfirma/adelagaciondealumnosfirma.component';
import { NuevoplandeaprendizajeComponent } from './nuevoplandeaprendizaje/nuevoplandeaprendizaje.component';
import { VerplanifcacionComponent } from './verplanifcacion/verplanifcacion.component';
import { EditardelegacionComponent } from './editardelegacion/editardelegacion.component';

const routes: Routes = [
  {path:'bienvenida',
    component:BienvenidaComponent
  },{path:'cordinadorvinculacion',
    component:AsignarcodinadorvinculacionComponent
  },{path:'vercordinadorvinculacion',
    component:VercordinadorvinculacionComponent
  },{path:'nuevaentidadbenefiaria/:id',
    component:NuevaendidadbeneficiariaComponent
  }, {path:'verentidadesbenefiarias',
    component:VerentidadesbeneficariasComponent
  },{path:'editarentidadveneficiaria/:id',
    component:EditarentidadbeneficiariaComponent
  },{path:'nuevoresponsable/:cedula',
    component:NuevoresponsablepppComponent
  }, {path:'verresponsable/:cedula',
    component:VerresposabledepppComponent
  }, {path:'nuevoproyecto/:cedula/:nombres',
    component:NuevoproyectoComponent
  },{path:'verproyecto/:cedula/:nombres',
    component:VerproyectosComponent
  },{path:'editarproyecto/:id/:cedula/:nombres',
    component:EditarproyectoComponent
  },{path:'docentedeapoyo/:cedula',
    component:DocentesdeapoyofirmaComponent
  },{path:'agregaractividadesyrequisitos/:id/:cedula',
    component:AgregaractividadesyrequisitosComponent
  },{path:'verproyectos1/:cedula',
    component:Verproyectos1Component
  },{path:'nuevaconvocatoria/:cedula',
    component:NuavaconvocatariaComponent
  },{path:'verconvocatoria/:cedula',
    component:VerconvocatoriasComponent
  },{path:'editarconvocatoria/:id',
    component:EditarconvocatoriaComponent
  },{path:'verconvocatoria1/:cedula',
    component:Verconvocatorias1Component
  },{path:'verportulaciones/:cedula',
    component:VerpostulacionesComponent
  },{path:'verportulaciones1/:cedula',
    component:Verpostulaciones1Component
  },{path:'firmarportulaciones/:cedula',
    component:FirmarpostulacionComponent
  },{path:'verfirmarportulaciones/:cedula',
    component:VerfirmadepostulacionComponent
  },{path:'delegaciondealumnos/:cedula',
    component:DelegaciondealumnosComponent
  },{path:'verdelegacion/:cedula',
    component:VerdelegacionesComponent
  },{path:'delegaciondealumnosfirma/:cedula',
    component:AdelagaciondealumnosfirmaComponent
  },{path:'nuevoplandeaprendizaje/:cedula',
    component:NuevoplandeaprendizajeComponent
  },{path:'verplanifiaciones/:cedula',
    component:VerplanifcacionComponent
  },{path:'editardelegacion/:id/:cedula',
    component:EditardelegacionComponent
  }
]

@NgModule({
  declarations: [
    BienvenidaComponent,
    AsignarcodinadorvinculacionComponent,
    VercordinadorvinculacionComponent,
    NuevaendidadbeneficiariaComponent,
    VerentidadesbeneficariasComponent,
    EditarentidadbeneficiariaComponent,
    NuevoresponsablepppComponent,
    VerresposabledepppComponent,
    NuevoproyectoComponent,
    VerproyectosComponent,
    EditarproyectoComponent,
    DocentesdeapoyofirmaComponent,
    AgregaractividadesyrequisitosComponent,
    Verproyectos1Component,
    NuavaconvocatariaComponent,
    VerconvocatoriasComponent,
    EditarconvocatoriaComponent,
    Verconvocatorias1Component,
    VerpostulacionesComponent,
    Verpostulaciones1Component,
    FirmarpostulacionComponent,
    VerfirmadepostulacionComponent,
    DelegaciondealumnosComponent,
    VerdelegacionesComponent,
    AdelagaciondealumnosfirmaComponent,
    NuevoplandeaprendizajeComponent,
    VerplanifcacionComponent,
    EditardelegacionComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialFileInputModule
  ],
  exports: [RouterModule]
})
export class ProyectoModule { }
