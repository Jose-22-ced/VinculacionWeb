export class Proyectos {
  id?:number;
  codigo?:string;
  nombre?:string;
  lineaaccion?:string;
  codigocarrera?:string;
  carrera?:string;
  estado?:boolean;
  fechaat?:string;
  entidadbeneficiaria?:number;
  directorProyecto?:string;
  nombreresponsable?:string
  responsablePPP?:string;
  ceduladirector?:String;
  nombredirector?:string
  objetivoGeneral?:String;
  alcanceTerritorial?:String;
  programaVinculacion?:String;
  actividadeslistProyectos?: actividadeslistProyectos[];
  requisitoslistProyectos?:  requisitoslistProyectos[];
  objetivosEspecificosProyecto?:ObjetivosEspeciicoslistProyecto[]
  plazoEjecucion?:String;
  fechaInicio?:Date;
  fechaFin?:Date;
  docenteApoyoResponse?:DocenteApoyoResponse[];
}

export class actividadeslistProyectos {
  descripcion?: string;
}

interface requisitoslistProyectos {
  descripcion: string;
}
export class ObjetivosEspeciicoslistProyecto{
  descripcion?: String;
}
export class DocenteApoyoResponse{
  cedula?:String;
  nombres?:String;
  correo?:String;
}

export class listproyect{
  id?:number;
  carrera?:String;
  nombre?:String;
  nombreresponsable?:String;

}
