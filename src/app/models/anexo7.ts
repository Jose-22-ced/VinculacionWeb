export class Anexo7 {
  id?:number;
  nombreEntidadBeneficiaria?: String;
  nombreDirectorProyecto?: String;
  fechaPlanificacion?: Date
  mesAnioPlanificado?: Date;
  idProyecto?:number;
  nombreProyecto?: String;
  horasDocentes?: HorasDocentesA7Request[]=[];
  horasEstudiantes?: HorasEstudiantesA7Request[]=[];
  documento?:String;
}

export class HorasDocentesA7Request{
  id?:Number;
  resultados?:String;
  actividad?:String;
  cedulaDocente?:String;
  nombreDocenteApoyo?:[]=[];
  numHoras?:Number;
  fechaInicio?:Date;
  fechaFin?:Date;
  observaciones?:String;
}

export class NombreDocenteApoyo{
}

export class HorasEstudiantesA7Request{
  id?:Number;
  resultados?:String;
  actividad?:String;
  cedulaEstudiante?:String;
  nombreEstudiante?:[]=[];
  numHoras?:Number;
  fechaInicio?:Date;
  fechaFin?:Date;
  observaciones?:String;
}

