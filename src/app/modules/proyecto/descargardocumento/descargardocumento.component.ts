import { Component, OnInit } from '@angular/core';
import {MatSelectionListChange} from "@angular/material/list";
import {map, Observable, startWith} from "rxjs";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ProyectoService} from "../../../services/proyecto.service";
import {Proyectos} from "../../../models/proyectos";
import {FechaService} from "../../../services/fecha.service";
import {Anexo6Service} from "../../../services/anexo6.service";
import {Anexo61Service} from "../../../services/anexo61.service";
import {Anexo3Service} from "../../../services/anexo3.service";
import {ResponsablepppService} from "../../../services/responsableppp.service";
import {Anexo1} from "../../../models/anexo1";
// @ts-ignore

import {Anexo1Service} from "../../../services/anexo1.service";

import {OtrosService} from "../../../services/otros.service";
import {CarreasAlumo} from "../../../models/anexo3";
import {Anexo2Service} from "../../../services/anexo2.service";
import {Anexo2} from "../../../models/anexo2";
import {DateAdapter} from "@angular/material/core";
// @ts-ignore
import Swal from "sweetalert2";
import {Anexo3} from "../../../models/anexo3";
// @ts-ignore
import PizZip from "pizzip";
// @ts-ignore
import PizZipUtils from "pizzip/utils/index.js";
// @ts-ignore
import { saveAs } from "file-saver";
import {Anexo5} from "../../../models/anexo5";
import {Anexo5Service} from "../../../services/anexo5.service";
import {Anexo4} from "../../../models/anexo4";
import {Anexo6} from "../../../models/anexo6";
import {Anexo61} from "../../../models/anexo61";
import {Anexo62} from "../../../models/anexo62";
import {Anexo7} from "../../../models/anexo7";
import {Anexo8} from "../../../models/anexo8";
import {Anexo9} from "../../../models/anexo9";
import {Anexo12} from "../../../models/anexo12";
import {Anexo11} from "../../../models/anexo11";
import {Anexo10} from "../../../models/anexo10";
import {InformeSeguimiento} from "../../../models/seguimiento";
import {InformeFinal} from "../../../models/final";
import {Informeaceptacion} from "../../../models/informeaceptacion";
import {Anexo62Service} from "../../../services/anexo62.service";
import {Anexo7Service} from "../../../services/anexo7.service";
import {Anexo8Service} from "../../../services/anexo8.service";
import {Anexo9Service} from "../../../services/anexo9.service";
import {Anexo10Service} from "../../../services/anexo10.service";
import {Anexo11Service} from "../../../services/anexo11.service";
import {Anexo12Service} from "../../../services/anexo12.service";
import {InformeSeguimientoService} from "../../../services/informeseguimiento.service";
import {InformeFinalService} from "../../../services/informefinal.service";

import {InformedeaceptacionestdiatesService} from "../../../services/informedeaceptacionestdiates.service";
import {Anexo4Service} from "../../../services/anexo4.service";
import {Anexo13} from "../../../models/anexo13";
import {Anexo13Service} from "../../../services/anexo13.service";
import {Codigocarrera} from "../../../models/codigocarrera";

function loadFile(url:any, callback:any) {
  PizZipUtils.getBinaryContent(url, callback);
}
function getBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
@Component({
  selector: 'app-descargardocumento',
  templateUrl: './descargardocumento.component.html',
  styleUrls: ['./descargardocumento.component.css']
})
export class DescargardocumentoComponent implements OnInit {

  isLinear = true;
  panelOpenState = true;
  issloading = true;
  isexist?: boolean;
  actualzar = false;
  nombres?:String;
  nombreanexo1:String | undefined;
//pantallas
  firstFormGroup?: FormGroup;
  secondFormGroup?: FormGroup;

//proyectos
  proyectos:Proyectos[]=[]
  proyectoselect: Proyectos = new Proyectos();
  proyectodoc: Proyectos[]=[];
//filtros
  ids?: number;
  myControl = new FormControl();
  filteredOptions?: Observable<Proyectos[]>;
  filteredOptionsanexo1?: Observable<Anexo1[]>; filteredOptionsanexo2?: Observable<Anexo2[]>;
  filteredOptionsanexo3?: Observable<Anexo3[]>; filteredOptionsanexo4?: Observable<Anexo4[]>;
  filteredOptionsanexo5?: Observable<Anexo5[]>; filteredOptionsanexo6?: Observable<Anexo6[]>;
  filteredOptionsanexo61?: Observable<Anexo61[]>; filteredOptionsanexo62?: Observable<Anexo62[]>;
  filteredOptionsanexo7?: Observable<Anexo7[]>; filteredOptionsanexo8?: Observable<Anexo8[]>;
  filteredOptionsanexo9?: Observable<Anexo9[]>; filteredOptionsanexo10?: Observable<Anexo10[]>;
  filteredOptionsanexo11?: Observable<Anexo11[]>; filteredOptionsanexo12?: Observable<Anexo12[]>;
  filteredOptionsanexo13?: Observable<Anexo13[]>;
  filteredOptioni?: Observable<InformeSeguimiento[]>; filteredOptionif?: Observable<InformeFinal[]>;
  filteredOptiona?: Observable<Informeaceptacion[]>;

///ANEXOS
  anexo1:Anexo1[]=[];
  anexo2:Anexo2[]=[];
  anexo3:Anexo3[]=[];
  anexo4:Anexo4[]=[];
  anexo5:Anexo5[]=[];
  anexo6:Anexo6[]=[];
  anexo61:Anexo61[]=[];
  anexo62:Anexo62[]=[];
  anexo7:Anexo7[]=[];
  anexo8:Anexo8[]=[];
  anexo9:Anexo9= new Anexo9();
  anexo10:Anexo10[]=[];
  anexo11:Anexo11[]=[];
  anexo12:Anexo12[]=[];
  anexo13:Anexo13[]=[];
  informe:InformeSeguimiento=new InformeSeguimiento();
  informefinal:InformeFinal[]=[];
  informeanexo3:Informeaceptacion[]=[];
  carreradocente?:String;

  constructor(private fechaService: FechaService, private activatedRoute: ActivatedRoute,
              private proyectoService: ProyectoService, private anexo1Service: Anexo1Service,
              private anexo2Service: Anexo2Service, private anexo3Service: Anexo3Service,private anexo4Service: Anexo4Service,
              private anexo5Service: Anexo5Service, private anexo6Service: Anexo6Service,
              private anexo61Service: Anexo61Service, private anexo62Service: Anexo62Service,
              private anexo7Service: Anexo7Service, private anexo8Service: Anexo8Service,private anexo9Service: Anexo9Service,
              private anexo10Service: Anexo10Service, private anexo11Service: Anexo11Service,
              private anexo12Service: Anexo12Service, private anexo13Service: Anexo13Service, private informeService: InformeSeguimientoService,
              private informefinalService: InformeFinalService,  private informeaceptacionServie:InformedeaceptacionestdiatesService ,
              private _formBuilder: FormBuilder, private responsablepppService:ResponsablepppService,
             private _adapter: DateAdapter<any>,
              private otrosService:OtrosService) {
    this._adapter.setLocale('es-ec');
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
    }, 1000)
  }

  ngOnInit(): void {
    var carrera:Codigocarrera[]=[];

    this.activatedRoute.params.subscribe(params => {
      let cedula = params['cedula']
      let nombres = params['nombres']
      this.nombres = nombres;
      // console.log(cedula)

      this.otrosService.getCarreraDocente(cedula).subscribe(value => {
        carrera=value
        //console.log(carrera)

      this.proyectoService.getProyectos().subscribe(value1 => {

        value.forEach(value2 => {value1.forEach(value3 => {if (value2.codigo==value3.codigocarrera){
          this.proyectos.push(value3)
        }})})


        this.filteredOptions= this.myControl.valueChanges.pipe(
          startWith(''),
          map(values=>this.filter(values)),
        );
        this.issloading=false;

      })

    this.firstFormGroup = this._formBuilder.group({
      proyecto: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
    });
    })
    })
  }
  filter(value: any): Proyectos[] {
    const filterValue = value.toString().toLowerCase();
    return this.proyectos.filter(option => option.nombre?.toLowerCase().includes(filterValue)
      ||option.carrera?.toLocaleLowerCase().includes(filterValue)
      ||option.codigocarrera?.toLocaleLowerCase().includes(filterValue)
    );
  }

  selectionP(proyecto: MatSelectionListChange) {
    this.proyectoselect = proyecto.option.value
    // console.log(this.proyectoselect)
    this.anexo1Service.getAnexo1byIdProyecto(this.proyectoselect.id).subscribe(value => {
      this.isexist=value.length!=0;
      this.anexo1=value;
      this.filteredOptionsanexo1= this.myControl.valueChanges.pipe(
        startWith(''),
        map(values=>this.filteranexo1(values)),
      );
      this.issloading=false;
      //console.log(this.anexo1)
    })
    this.anexo2Service.getAnexo2().subscribe(va=>{
      this.anexo2=va.filter(fil=>fil.idProyectoPPP==this.proyectoselect.id);
      this.issloading=false;
      this.filteredOptionsanexo2 = this.myControl.valueChanges.pipe(
        startWith(''),
        map(values=>this.filteranexo2(values)),
      );
      //console.log(this.anexo2)
    })
    this.anexo3Service.getAnexo3byProyecto(this.proyectoselect.id).subscribe(value => {
      this.isexist=value.length!=0;
      this.anexo3=value;
      this.filteredOptionsanexo3= this.myControl.valueChanges.pipe(
        startWith(''),
        map(values=>this.filteranexo3(values)),
      );
      this.issloading=false;
      //console.log(this.anexo3)
    })
    this.anexo4Service.getAnexo4byProyecto(this.proyectoselect.id).subscribe(value => {
      this.isexist=value.length!=0;
      this.anexo4=value;
      this.filteredOptionsanexo4= this.myControl.valueChanges.pipe(
        startWith(''),
        map(values=>this.filteranexo4(values)),
      );
      this.issloading=false;
      //console.log(this.anexo4)
    })

    this.anexo5Service.getAnexo5All().subscribe(value1 => {
      this.anexo5=value1.filter(value2 => value2.idProyectoPPP=this.proyectoselect.id)
      //console.log(this.anexo5)
      this.issloading=false;
      this.filteredOptionsanexo5 = this.myControl.valueChanges.pipe(
        startWith(''),
        map(values=>this.filteranexo5(values)),
      );
      //console.log(this.anexo5)
    })
    this.anexo6Service.getAnexo6all().subscribe(value1 => {
      this.anexo6=value1.filter(value2 => value2.proyectoId=this.proyectoselect.id)
      // console.log(this.anexo6)
      this.issloading=false;
      this.filteredOptionsanexo6 = this.myControl.valueChanges.pipe(
        startWith(''),
        map(values=>this.filteranexo6(values)),
      );
      //console.log(this.anexo6)
    })
    this.anexo61Service.getAnexo6().subscribe(value1 => {
      this.anexo61=value1.filter(value2 => value2.idProyecto=this.proyectoselect.id)
      //console.log(this.anexo61)
      this.issloading=false;
      this.filteredOptionsanexo61 = this.myControl.valueChanges.pipe(
        startWith(''),
        map(values=>this.filteranexo61(values)),
      );
      //console.log(this.anexo61)
    })
    this.anexo62Service.getAnexo6().subscribe(value1 => {
      this.anexo62=value1.filter(value2 => value2.idProyecto=this.proyectoselect.id)
      //console.log(this.anexo62)
      this.issloading=false;
      this.filteredOptionsanexo62 = this.myControl.valueChanges.pipe(
        startWith(''),
        map(values=>this.filteranexo62(values)),
      );
      //console.log(this.anexo62)
    })

    this.anexo7Service.getanexo7ppp(this.proyectoselect.id).subscribe(value => {
      this.isexist=value.length!=0;
      this.anexo7=value;
      this.filteredOptionsanexo7= this.myControl.valueChanges.pipe(
        startWith(''),
        map(values=>this.filteranexo7(values)),
      );
      this.issloading=false;
      //console.log(this.anexo7)
    })
    this.anexo8Service.getanexo8byproyecto(this.proyectoselect.id).subscribe(value => {
      this.isexist=value.length!=0;
      this.anexo8=value;
      this.filteredOptionsanexo8= this.myControl.valueChanges.pipe(
        startWith(''),
        map(values=>this.filteranexo8(values)),
      );
      this.issloading=false;
      //console.log(this.anexo8)
    })
    this.anexo9Service.getAnexo9_poridproyecto(this.proyectoselect.id).subscribe(value => {
      this.anexo9=value;
      this.issloading=false;
      // console.log(this.anexo9)
    })
    this.anexo10Service.getAnexo10All().subscribe(value1 => {
      this.anexo10=value1.filter(value2 => value2.idProyectoPPP=this.proyectoselect.id)
      //console.log(this.anexo10)
      this.issloading=false;
      this.filteredOptionsanexo10 = this.myControl.valueChanges.pipe(
        startWith(''),
        map(values=>this.filteranexo10(values)),
      );
      //console.log(this.anexo10)
    })


    this.anexo11Service.getAnexo11byidproyecto(this.proyectoselect.id).subscribe(value => {
      this.isexist=value.length!=0;
      this.anexo11=value;
      this.filteredOptionsanexo11= this.myControl.valueChanges.pipe(
        startWith(''),
        map(values=>this.filteranexo11(values)),
      );
      this.issloading=false;
      //console.log(this.anexo11)
    })
    this.anexo12Service.getAnexo12byidproyecto(this.proyectoselect.id).subscribe(value => {
      this.isexist=value.length!=0;
      this.anexo12=value;
      this.filteredOptionsanexo12= this.myControl.valueChanges.pipe(
        startWith(''),
        map(values=>this.filteranexo12(values)),
      );
      this.issloading=false;
      //console.log(this.anexo12)
    })
    // @ts-ignore
    this.anexo13Service.getAnexo13by(this.proyectoselect.id).subscribe(value => {
      this.isexist=value.length!=0;
      this.anexo13=value;
      this.filteredOptionsanexo13= this.myControl.valueChanges.pipe(
        startWith(''),
        map(values=>this.filteranexo13(values)),
      );
      this.issloading=false;
      //console.log(this.anexo13)
    })
    this.informeService.getInforme_poridproyetco(this.proyectoselect.id).subscribe(value => {
      this.informe=value;
      this.issloading=false;
      //console.log(this.informe)
    })
    this.informefinalService.getinformeallo().subscribe(value => {
      this.informefinal=value.filter(value2 => value2.idProyectoPPP=this.proyectoselect.id)
      //console.log(this.informefinal)
      this.issloading=false;
      this.filteredOptionif = this.myControl.valueChanges.pipe(
        startWith(''),
        map(values=>this.filteranexo10(values)),
      );
      //console.log(this.informefinal)
    })
    this.informeaceptacionServie.getpreinformeById(this.proyectoselect.id).subscribe(value => {
      this.informeanexo3=value;
      this.filteredOptiona= this.myControl.valueChanges.pipe(
        startWith(''),
        map(values=>this.filteraprovados(values)),
      );
      this.issloading=false;
      //console.log(this.informeanexo3)
    })

  }

  refresh() {
    window.location.reload();
  }

  filteranexo1(value: any): Anexo1[] {
    const filterValue = value.toLowerCase();
    return this.anexo1.filter(option => option.nombreProyecto?.toLowerCase().includes(filterValue)
    );
  }
  filteranexo2(value: any): Anexo2[] {
    const filterValue = value.toLowerCase();
    return this.anexo2.filter(option => option.carrera?.toLocaleLowerCase().includes(filterValue)
      ||option.ciclo?.toLocaleLowerCase().includes(filterValue)
    );
  }
  filteranexo3(value: any): Anexo3[] {
    const filterValue = value.toLowerCase();
    return this.anexo3.filter(option => option.cedula?.toLocaleLowerCase().includes(filterValue)
      ||option.nombresestudiante?.toLocaleLowerCase().includes(filterValue)
    );
  }
  filteranexo4(value: any): Anexo4[] {
    const filterValue = value.toLowerCase();
    return this.anexo4.filter(option => option.cedulaEstudiante?.toLocaleLowerCase().includes(filterValue)
      ||option.nombreEstudiante?.toLocaleLowerCase().includes(filterValue)
    );
  }
  filteranexo5(value: any): Anexo5[] {
    const filterValue = value.toLowerCase();
    // @ts-ignore
    return this.anexo5.filter(option => option.nombrerol?.toLowerCase().includes(filterValue)
      ||option.siglasCarrera?.toLocaleLowerCase().includes(filterValue)
    );
  }
  filteranexo6(value: any): Anexo6[] {
    const filterValue = value.toLowerCase();
    return this.anexo6.filter(option => option.nombreEstudiante?.toLowerCase().includes(filterValue)
      ||option.nombreEstudiante?.toLocaleLowerCase().includes(filterValue)
    );
  }
  filteranexo61(value: any): Anexo61[] {
    const filterValue = value.toLowerCase();
    return this.anexo61.filter(option => option.nombreEstudiante?.toLowerCase().includes(filterValue)
      ||option.cedulaEstudiante?.toLocaleLowerCase().includes(filterValue)
    );
  }
  filteranexo62(value: any): Anexo62[] {
    const filterValue = value.toLowerCase();
    return this.anexo62.filter(option => option.nombreEstudiante?.toLowerCase().includes(filterValue)
      ||option.cedulaEstudiante?.toLocaleLowerCase().includes(filterValue)
    );
  }
  filteranexo7(value: any): Anexo7[] {
    const filterValue = value.toLowerCase();
    return this.anexo7.filter(option => option.nombreDirectorProyecto?.toLowerCase().includes(filterValue)
      ||option.nombreProyecto?.toLocaleLowerCase().includes(filterValue)
    );
  }
  filteranexo8(value: any): Anexo8[] {
    const filterValue = value.toLowerCase();
    return this.anexo8.filter(option => option.cedulaEstudiante?.toLowerCase().includes(filterValue)
      ||option.nombreEstudiante?.toLocaleLowerCase().includes(filterValue)
    );
  }

  filteranexo10(value: any): Anexo10[] {
    const filterValue = value.toLowerCase();
    return this.anexo10.filter(option => option.nombreEstudiante?.toLowerCase().includes(filterValue)
      ||option.cedulaEstudiante?.toLocaleLowerCase().includes(filterValue)
    );
  }
  filteranexo11(value: any): Anexo11[] {
    const filterValue = value.toLowerCase();
    return this.anexo11.filter(option => option.resultadoAnexo11?.toLowerCase().includes(filterValue)
      ||option.cedulaEstudiante?.toLocaleLowerCase().includes(filterValue)
      ||option.nombresEstudiante?.toLocaleLowerCase().includes(filterValue)
    );
  }
  filteranexo12(value: any): Anexo12[] {
    const filterValue = value.toLowerCase();
    return this.anexo12.filter(option => option.entidadBeneficiaria?.toLowerCase().includes(filterValue)
      ||option.cedulaApoyo?.toLocaleLowerCase().includes(filterValue)
    );
  }
  filteranexo13(value: any): Anexo13[] {
    const filterValue = value.toLowerCase();
    return this.anexo13.filter(option => option.cedulaDirectorDocenteApoyo?.toLowerCase().includes(filterValue)
      ||option.ciclo?.toLocaleLowerCase().includes(filterValue)
    );
  }

  filterinformefinal(value: any): InformeFinal[] {
    const filterValue = value.toLowerCase();
    return this.informefinal.filter(option => option.entidadBeneficiaria?.toLowerCase().includes(filterValue)
      ||option.cedulaDirector?.toLocaleLowerCase().includes(filterValue)
    );
  }
  filteraprovados(value: any): Informeaceptacion[] {
    const filterValue = value.toLowerCase();
    return this.informeanexo3.filter(option => option.nombreDirector?.toLowerCase().includes(filterValue)
      ||option.fechaElaborado?.toLocaleLowerCase().includes(filterValue)
    );
  }



  convertFile1(docum:any,an:String) {
    this.anexo1.forEach(function (value) {
      //console.log(value.nombreDelegado);
      an='Delegacion docente '+value.nombreDelegado
    });
    //console.log(docum)
    //Usage example:
    var file = this.dataURLtoFile(docum, an+'.pdf');
    // console.log(file);
    saveAs(file, an+'.pdf');
  }

  convertFile2(docum:any,an:String) {
    this.anexo2.forEach(function (value) {
      //console.log(value.nombreProyecto);
      an='Convocatoria del Proyecto '+value.nombreProyecto
    });
    //console.log(docum)
    //Usage example:
    var file = this.dataURLtoFile(docum, an+'.pdf');
    //console.log(file);
    saveAs(file, an+'.pdf');
  }
  convertFile3(docum:any,an:String) {
    an='SOLICITUD DE PARTICIPACIÓN '
    //console.log(docum)
    //Usage example:
    var file = this.dataURLtoFile(docum, an+'.pdf');
    // console.log(file);
    saveAs(file, an+'.pdf');
  }
  convertFile4(docum:any,an:String) {
    an='Respuesta al estudiante '
    //console.log(docum)
    //Usage example:
    var file = this.dataURLtoFile(docum, an+'.pdf');
    //console.log(file);
    saveAs(file, an+'.pdf');
  }

  convertFile5(docum:any,an:String) {
    an='Delegacion '
    //console.log(docum)
    //Usage example:
    var file = this.dataURLtoFile(docum, an+'.pdf');
    // console.log(file);
    saveAs(file, an+'.pdf');
  }
  convertFile6(docum:any,an:String) {
    an='Plan de Aprendizaje '
    //console.log(docum)
    //Usage example:
    var file = this.dataURLtoFile(docum, an+'.pdf');
    //console.log(file);
    saveAs(file, an+'.pdf');
  }
  convertFile61(docum:any,an:String) {
    an='Plan de Aprendizaje Parcial '
    //console.log(docum)
    //Usage example:
    var file = this.dataURLtoFile(docum, an+'.pdf');
    //console.log(file);
    saveAs(file, an+'.pdf');
  }
  convertFile62(docum:any,an:String) {
    an='Plan de Aprendizaje Final '
    //console.log(docum)
    //Usage example:
    var file = this.dataURLtoFile(docum, an+'.pdf');
    //console.log(file);
    saveAs(file, an+'.pdf');
  }
  convertFile7(docum:any,an:String) {
    an='PLANIFICACIÓN MENSUAL DE ACTIVIDADES '
    //console.log(docum)
    //Usage example:
    var file = this.dataURLtoFile(docum, an+'.pdf');
    //console.log(file);
    saveAs(file, an+'.pdf');
  }
  convertFile8(docum:any,an:String) {
    an='ACTIVIDADES DE LOS ESTUDIANTES '
    //console.log(docum)
    //Usage example:
    var file = this.dataURLtoFile(docum, an+'.pdf');
    //console.log(file);
    saveAs(file, an+'.pdf');
  }
  convertFile9(docum:any,an:String) {
    an='SEGUIMIENTO MENSUAL SEGÚN PLANIFICACIÓN '
    //console.log(docum)
    //Usage example:
    var file = this.dataURLtoFile(docum, an+'.pdf');
    //console.log(file);
    saveAs(file, an+'.pdf');
  }
  convertFile10(docum:any,an:String) {
    an='INFORME DE CULMINACIÓN DEL PROYECTO DE VINCULACIÓN ESTUDIANTE '
    //console.log(docum)
    //Usage example:
    var file = this.dataURLtoFile(docum, an+'.pdf');
    //console.log(file);
    saveAs(file, an+'.pdf');
  }

  convertFile11(docum:any,an:String) {
    an='EVALUACIÓN AL ESTUDIANTE '
    //console.log(docum)
    //Usage example:
    var file = this.dataURLtoFile(docum, an+'.pdf');
    //console.log(file);
    saveAs(file, an+'.pdf');
  }

  convertFile12(docum:any,an:String) {
    an='REGISTRO DE BENEFICIARIOS / CAPACITACIONES '
    //console.log(docum)
    //Usage example:
    var file = this.dataURLtoFile(docum, an+'.pdf');
    //console.log(file);
    saveAs(file, an+'.pdf');
  }
  convertFile13(docum:any,an:String) {
    an='REGISTRO DE VISITAS'
    //console.log(docum)
    //Usage example:
    var file = this.dataURLtoFile(docum, an+'.pdf');
    // console.log(file);
    saveAs(file, an+'.pdf');
  }
  convertInforme(docum:any,an:String) {
    an='INFORME DE SEGUIMIENTO '+this.informe.nombreProyecto
    //console.log(docum)
    //Usage example:
    var file = this.dataURLtoFile(docum, an+'.pdf');
    //console.log(file);
    saveAs(file, an+'.pdf');
  }
  convertInformefinal(docum:any,an:String) {
    an='INFORME FINAL '
    //console.log(docum)
    //Usage example:
    var file = this.dataURLtoFile(docum, an+'.pdf');
    //console.log(file);
    saveAs(file, an+'.pdf');
  }
  convertInformeAceptacion(docum:any,an:String) {
    an='INFORME DE ACEPTACION '
    //console.log(docum)
    //Usage example:
    var file = this.dataURLtoFile(docum, an+'.pdf');
    //console.log(file);
    saveAs(file, an+'.pdf');
  }


  dataURLtoFile(dataurl:any, filename:any) {
    let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }



}
