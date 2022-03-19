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
    EditarproyectoComponent
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
