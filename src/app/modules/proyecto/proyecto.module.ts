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
  },{path:'nuevoresponsable',
    component:NuevoresponsablepppComponent

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
    NuevoresponsablepppComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [RouterModule]
})
export class ProyectoModule { }
