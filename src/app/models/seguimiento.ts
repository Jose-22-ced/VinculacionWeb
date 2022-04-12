export class InformeSeguimiento {
  id?: Number;
  programaVinculacion?: String;
  lineaAccion?: String;
  nombreProyecto?: String;
  carrera?: String;
  nombreEntidadBeneficiaria?: String;
  plazoEjecucion?: String;
  fechaInicio?: Date;
  fechaFin?: Date;
  fechaSeguimiento?: Date;
  fechaInicioReal?: Date;
  fechaFinReal?: Date;
  alcanceTerritorial?: String;
  objetivoGeneral?: String;
  situacionInicio?: String;
  situacionActual?: String;
  conclusiones?: String;
  nombreDirector?: String;
  cedulaDirector?: String;
  nombreCoordinadorVinculacion?: String;
  cedulaCoordinadorVinculacion?: String;
  fechaEntrega?: Date;
  idProyectoPPP?: Number;
  documento?:String;
  observacionesInformeSeguimiento?:String;
  docentesParticipantes?:docentesParticipantes[];
  estudiantesParticipantes?:estudiantesParticipantes[];
  objetivosEspecificosInforme?:objetivosEspecificosInforme[];
  actividadesInformeSeguimientoRequest?:actividadesInformeSeguimientoRequest[];
}



export class docentesParticipantes{
  id?:Number;
  cedula?:String;
  informeId?:Number;
  numeroHoras?:String;
  nombres?:String;
  carrera?:String;
}

export class estudiantesParticipantes{
  id?:Number;
  cedula?:String;
  informeId?:Number;
  numeroHoras?:String;
  nombres?:String;
  carrera?:String;
}

export class objetivosEspecificosInforme{
  id?:Number;
  descripcion?:String;
}

export class actividadesInformeSeguimientoRequest{
  id?:Number;
  actividades?:String;
  porcentajeCumplimiento?:String;
  fechaEjecucion?:Date;
  responsableEjecucion?:String;
  documento?:String;
  observaciones?:String;
  idInformeSeguimiento?:Number;
}
