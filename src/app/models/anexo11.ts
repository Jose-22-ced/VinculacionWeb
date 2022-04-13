

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
  totalHoras?:Number;
  nombreApoyo?:String;
  nombreDirector?:String;
  resultadoAnexo11?:String;
  promedio?:Number;
  apoyoPuntaje?:Number;
  directorPuntaje?:Number;
  documento?:String;
  apoyo?:Anexo11ApoyoResponse[];
  director?:Anexo11DirectorResponse[];
}
export class Anexo11ApoyoResponse{
  id?:Number;
  apoyoItem1?:String;
  apoyoItem2?:String
  apoyoItem3?:Number;

}
export class Anexo11DirectorResponse{
  id?:Number;
  directorItem1?:String;
    directorItem2?:String;
  directorItem3?:Number;

}
