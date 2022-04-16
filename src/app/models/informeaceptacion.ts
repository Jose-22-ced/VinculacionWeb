export class Informeaceptacion {
  id?:Number
  idProyectoPPP?:Number;
  nombreProyecto?:String;
  nombreDirector?:String;
  nombreCarrera?:String;
  antecedentes?:String;
  objetivoGeneral?:String;
  evidencias?:String;
  nombreElaborado?:String;
  cargoElaborado?:Date;
  fechaElaborado?:String;
  nombreRevisado?:String;
  desasarollo?:String;
  fechaRevisado?:Date;
  cargoRevisado?:String;
  estudianteInformeInicial?:EstudiantesInformeInicialRequest[];
  documento?:String;

}
export class EstudiantesInformeInicialRequest {
  id?:Number;
  cedula?:String;
  nombreEstudiante?:String;
  estado?:String;
  observaciones?:String;
}
