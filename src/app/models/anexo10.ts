export class Anexo10{
  id?:Number;
  fecha?:Date;
  idProyectoPPP?:Number;
  nombreProyecto?:String;
  nombreDirector?:String;

  nombreEmpresa?:String;
  Ciudad?:String
  Direccion?:String
  direccion?:String
  nombreDocenteapoyo?:String;
  cedulaDocenteApoyo?:String;
  correo_DocenteApoyo?:String;

  nombreEstudiante?:String;
  cedulaEstudiante?:String;
  cicloAprovado?:String;
  correoEstudiante?:String;
  telefonoEstudiante?:String;

  nombreAdministrador?:String;
  cedulaAdministrador?:String;
  correoAdministrador?:String;
  horasRealizadas?:String;
  fechaInicio?:Date;
  fechaFin?:Date;
  descripcionEmpresa?:String;
  evidencias?:String;

  conclusiones?:String;
  recomendaciones?:String;
  documento?:String;
  actividadesAnexo10s?:actividadesAnexo10s[];
  num_proceso?:Number;

}

export class actividadesAnexo10s{
  id?:Number;
  actividadesGenerales?:String;
  actividadesEspecificas?:String;
  productoGenerado?:String;
}
