export class Anexo6 {
  id?:Number;
  nombreProyecto?:String;
  nombreDocenteApoyo?:String;
  nombreEntidad?:String;
  nombreEstudiante?:String;
  cedulaEstudiante?:String;
  nombreResponsableVinculacion?:String;
  nombreCoordinadorVinculacion?:String;
  cedulaCoordinadorVinculacion?:String;
  documento?:String;
  fecha?:Date;
  periodoAcademico?:String;
  ciclo?:String;
  totalHoras?:String;
  proyectoId?:Number;
  num_proceso?:Number;
  actividades?:ActividadesAnexo6[];
}

export class ActividadesAnexo6{
  id?:Number;
  numero?:Number;
  actividad?:String;
  asignatura?:String;
  resultado?:String;
  horasAsignadas?:String;
}
