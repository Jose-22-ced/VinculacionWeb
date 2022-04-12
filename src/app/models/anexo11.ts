

export class Anexo11{
  id?:Number;
  idProyecto?:Number;
  nombresEstudiante?:String;
  cedulaEstudiante?:String;
  emailEstudiante?:String;
  carrera?:String;
  fechaInicio?:Date;
  fechaFinaliza?:Date;
  fechaEvaluacion?:Date;
  totalHoras?:String;
  nombreApoyo?:String;
  nombreDirector?:String;
  resultadoAnexo11?:String;
  promedio?:String;
  documento?:String;
  apoyo?:Anexo11ApoyoResponse[];
  director?:Anexo11DirectorResponse[];
}
export class Anexo11ApoyoResponse{
  id?:Number;
  apoyoItem1?:String;
  apoyoItem2?:String
  apoyoItem3?:String;
  apoyoItem4?:String;
  apoyoPuntaje?:String;
}
export class Anexo11DirectorResponse{
  id?:Number;
  directorItem1?:String;
    directorItem2?:String;
  directorItem3?:String;
  directorItem4?:String;
  directorPuntaje?:String;
}
