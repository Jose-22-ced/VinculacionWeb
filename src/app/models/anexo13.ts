export class Anexo13{
  id?:Number;
  nombreDirectorDocenteApoyo?:String
  cedulaDirectorDocenteApoyo?:String
  periodoAcademicon?:String
  empresa?:String
  representanteLegal?:String
  ciclo?:String
  observaciones?:String
  documento?:String
  proyectoId?:Number;
  estudiantesVisitas?:EstudiantesVisitaRequest[]
  informes?:InformeVisitaRequest[]
  num_proceso?:Number;
}
export class EstudiantesVisitaRequest{
  id?:Number;
  cedula?:String;
  nombre?:String;
}
export class InformeVisitaRequest{
  id?:Number;
  asunto?:String;
  actividades?:String;
  observaciones?:String;
  horaInicio?:String;
  horaFin?:String;
  fecha?:Date;

}
