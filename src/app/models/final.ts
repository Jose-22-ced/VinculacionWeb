export class InformeFinal {
  id?: Number;
  programaVinculacion?: String;
  lineaAccion?: String;
  nombreProyecto?: String;
  carreras?: String;
  entidadBeneficiaria?: String;
  plazoEjecucion?: String;
  fechaInicio?: Date;
  fechaFin?: Date;
  fechaSeguimiento?: Date;
  fechaInicioReal?: Date;
  fechaFinReal?: Date;
  alcanceTerritorial?: String;
  objetivoGeneral?: String;
  situacionInicialenbeficiarios?: String;
  situacionActualBeneficiarios?: String;
  conclusiones?: String;
  nombreDirector?: String;
  cedulaDirector?: String;
  nombreCoordinadorVinculacion?: String;
  cedulaCoordinadorVinculacion?: String;
  fechaEntrega?: Date;
  idProyectoPPP?: Number;
  documento?:String;
  observaciones?:String;
  docentesParticipantes?:docentesParticipantes[];
  estudiantesParticipantes?:EstudiantesParticipantesFinalRequest[];
  objetivosEspecificosInformes?:ObjetivosEspecificosInformeRequest[];
  actividadesInformeSeguimiento?:actividadesInformeSeguimientoRequest[];
  indicadores?:IndicadoresRequest[];
  matrizObjetivos?:MatrizObjetivosRequest[];
  productoObtenido?:String;
  impacto?:String;
  descripcionImpacto?:String;
  resultadoIndicadores?:String;
  recomendaciones?:String;


}


export class docentesParticipantes{
  id?:Number;
  cedula?:String;
  informeId?:Number;
  numeroHoras?:String;
  nombres?:String;
  carrera?:String;
}

export class EstudiantesParticipantesFinalRequest{
  id?:Number;
  cedula?:String;
  informeId?:Number;
  numeroHoras?:String;
  nombres?:String;
  carrera?:String;
  cod_estudiante?:String;
}

export class ObjetivosEspecificosInformeRequest{
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

export class IndicadoresRequest{
  id?:Number;
  descripcion?:String;
  tipo?:String;
}

export class MatrizObjetivosRequest{
  id?:Number;
  ObjetivosEspecifico?:String;
  indicadores?:String;
  resultadoPlanificado?:String;
  resultadoObtenido?:String;
  observaciones?:String;
}
