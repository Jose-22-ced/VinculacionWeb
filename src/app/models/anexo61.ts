
export class Anexo61 {
  id?:Number;
  cedulaDirector?:String;
  idProyecto?:Number;
  documento?:String;
  fechaApoyo?: Date;
  fechaDirector?: Date;
  nombreApoyo?:String;
  nombreDirector?:String;
  actividades?:Actividades[]=[];
}

export class Actividades {
  actividadesEstudiante?:String;
  controlEstudiante?:String;
  desempenoEstudiante?: String;
  asignaturasBase?:String;
}


