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
import { EditarplanificacionComponent } from './editarplanificacion/editarplanificacion.component';
import { Anexo61Component } from './anexo61/anexo61.component';
import { Veranexo61Component } from './veranexo61/veranexo61.component';
import { Anexo62Component } from './anexo62/anexo62.component';
import { Veranexo62Component } from './veranexo62/veranexo62.component';
import { RegistroactividadesestudianteComponent } from './registroactividadesestudiante/registroactividadesestudiante.component';
import { NuevavisitaComponent } from './nuevavisita/nuevavisita.component';
import { VervisitasComponent } from './vervisitas/vervisitas.component';
import { NuevoinformedeculminacionComponent } from './nuevoinformedeculminacion/nuevoinformedeculminacion.component';
import { VerinformesdeculminacionComponent } from './verinformesdeculminacion/verinformesdeculminacion.component';
import {Anexo7planificacionmensualComponent} from "./anexo7planificacionmensual/anexo7planificacionmensual.component";
import {Veranexos7Component} from "./veranexos7/veranexos7.component";
import { EditarinformedeculminacionComponent } from './editarinformedeculminacion/editarinformedeculminacion.component';
import { FirmarinformdedeculmnacionapoyoComponent } from './firmarinformdedeculmnacionapoyo/firmarinformdedeculmnacionapoyo.component';
import { FirmainformedeculmunaciondirectorComponent } from './firmainformedeculmunaciondirector/firmainformedeculmunaciondirector.component';
import { FirmarplandeaprendizajeComponent } from './firmarplandeaprendizaje/firmarplandeaprendizaje.component';
import {Editar7planmesualComponent} from "./editar7planmesual/ediatar7planmesual.component";
import {Firmaanexo61Component} from "./firmaanexo61/firmaanexo61.component";
import {Firmaanexo62Component} from "./firmaanexo62/firmaanexo62.component";
import {Anexo11Component} from "./anexo11/anexo11.component";
import {Veranexo8Component} from "./veranexo8/veranexo8.component";
import {
  SeguimientomensualplanificacionComponent
} from "./seguimientomensualplanificacion/seguimientomensualplanificacion.component";
import {Veranexo9Component} from "./veranexo9/veranexo9.component";
import {Firmaranexo9Component} from "./firmaranexo9/firmaranexo9.component";
import {Registrobeneficiarios12Component} from "./registrobeneficiarios12/registrobeneficiarios12.component";
import {Veranexo12Component} from "./veranexo12/veranexo12.component";
import {InformeseguimientoComponent} from "./informeseguimiento/informeseguimiento.component";
import {ListainformeseguimientoComponent} from "./listainformeseguimiento/listainformeseguimiento.component";
import {FirmarinformeseguimientoComponent} from "./firmarinformeseguimiento/firmarinformeseguimiento.component";

import { Veranexos11Component } from './veranexos11/veranexos11.component';
import { Anexo11directorComponent } from './anexo11director/anexo11director.component';
import { Firmaranexo11Component } from './firmaranexo11/firmaranexo11.component';


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
  },{path:'editarplanificacion/:id/:cedula',
    component:EditarplanificacionComponent
  },{path:'anexo6_1/:id/:cedula/:nombres',
    component:Anexo61Component
  },{path:'veranexos6_1/:cedula/:nombres',
    component:Veranexo61Component
  } ,{path:'anexo6_2/:id/:cedula/:nombres',
    component:Anexo62Component
  },{path:'veranexos6_2/:cedula/:nombres',
    component:Veranexo62Component
  },{path:'registroactividadesestudiante/:cedula/:nombres',
    component:RegistroactividadesestudianteComponent
  },{path:'nueavavisita/:cedula',
    component:NuevavisitaComponent
  },{path:'vervisitas/:cedula',
    component:VervisitasComponent
  },{path:'nuevoinformedeculminacion/:cedula',
    component:NuevoinformedeculminacionComponent
  },{path:'verinformedeculminación/:cedula',
    component:VerinformesdeculminacionComponent
  },{path:'nuevaplaificacionmensual/:cedula/:nombres',
    component:Anexo7planificacionmensualComponent
  },{path:'verplatificaciones/:cedula/:nombres',
    component:Veranexos7Component
  },{path:'editarinformedeculminacion/:id',
    component:EditarinformedeculminacionComponent
  },{path:'firmarpladeaprendizajeapoyo/:cedula',
    component:FirmarinformdedeculmnacionapoyoComponent
  },{path:'firmarpladeaprendizajedirector/:cedula',
    component:FirmainformedeculmunaciondirectorComponent
  },{path:'firmarplandeaprondizaje/:cedula',
    component:FirmarplandeaprendizajeComponent
  },{path:'editarplafinicacionmensuak/:id/:cedula/:nombre',
    component:Editar7planmesualComponent
  },{path: 'firmaranexo61/:cedula',
    component: Firmaanexo61Component
  },{path:'firmaranexo62/:cedula',
    component:Firmaanexo62Component
  },{path:'firmaranexo8/:cedula/:nombres',
    component:Veranexo8Component
  },{path:'anexo11/:cedula/:nombres',
    component:Anexo11Component
  },{path:'registroactividadesestudiante/:cedula/:nombres',
    component:RegistroactividadesestudianteComponent
  },{path:'firmaranexo61/:cedula',
    component:Firmaanexo61Component
  },{path:'firmaranexo62/:cedula',
    component:Firmaanexo62Component
  },{ path: 'planificacion_de_actividades_mensual/:cedula',
    component: Anexo7planificacionmensualComponent
  },{ path: 'seguimiento_mensual/:cedula/:nombres',
    component: SeguimientomensualplanificacionComponent
  },{ path: 'ver_seguimiento_mensual/:cedula/:nombres',
    component: Veranexo9Component
  },{ path: 'firmar_seguimiento_mensual/:cedula/:nombres',
    component: Firmaranexo9Component
  },{ path: 'registro_beneficiarios/:id/:cedula/:nombres',
    component: Registrobeneficiarios12Component
  },{ path: 'ver_registro_beneficiarios/:id/:cedula/:nombres',
    component: Veranexo12Component
  },{ path: 'informe_seguimiento/:cedula/:nombres',
    component: InformeseguimientoComponent
  },{ path: 'lista_informe_seguimiento/:cedula/:nombres',
    component: ListainformeseguimientoComponent
  },{ path: 'firmar_informe_seguimiento/:cedula/:nombres',
    component: FirmarinformeseguimientoComponent
  },{path:'anexo11/:cedula/:nombres',
    component:Anexo11Component
  },
  {path:'anexo11director/:cedula/:nombres',
    component:Anexo11directorComponent
  },
  {path:'veranexo11apoyo/:cedula/:nombres',
    component:Veranexos11Component
  },
  {path:'firmaranexo11director/:cedula/:nombres',
    component:Firmaranexo11Component
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
    EditarplanificacionComponent,
    Anexo61Component,
    Veranexo61Component,
    Anexo62Component,
    Veranexo62Component,
    RegistroactividadesestudianteComponent,
    NuevavisitaComponent,
    VervisitasComponent,
    NuevoinformedeculminacionComponent,
    VerinformesdeculminacionComponent,
    Anexo7planificacionmensualComponent,
    Veranexos7Component,
    EditarinformedeculminacionComponent,
    FirmarinformdedeculmnacionapoyoComponent,
    FirmainformedeculmunaciondirectorComponent,
    FirmarplandeaprendizajeComponent,
    Editar7planmesualComponent,
    Firmaanexo61Component,
    Firmaanexo62Component,
    Anexo11Component,
    Veranexo8Component,
    SeguimientomensualplanificacionComponent,
    Veranexo9Component,
    Firmaranexo9Component,
    Registrobeneficiarios12Component,
    Veranexo12Component,
    InformeseguimientoComponent,
    ListainformeseguimientoComponent,
    FirmarinformeseguimientoComponent,
    Veranexos11Component,
    Anexo11directorComponent,
    Firmaranexo11Component

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
