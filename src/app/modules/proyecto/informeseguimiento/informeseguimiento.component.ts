import { Component, OnInit } from '@angular/core';
import {UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {ProyectoService} from "../../../services/proyecto.service";
import {EntidadbeneficiarioService} from "../../../services/entidadbeneficiario.service";
import {map, Observable, startWith} from "rxjs";
import {actividadeslistProyectos, ObjetivosEspeciicoslistProyecto, Proyectos} from "../../../models/proyectos";
import {Entidadbeneficiaria} from "../../../models/entidadbeneficiaria";
import {MatSelectionListChange} from "@angular/material/list";
import {CarrerasService} from "../../../services/carreras.service";
import {Carreras} from "../../../models/carreras";

import {
  actividadesInformeSeguimientoRequest,
  docentesParticipantes,
  estudiantesParticipantes,
  InformeSeguimiento, objetivosEspecificosInforme
} from "../../../models/seguimiento";
// @ts-ignore
import PizZip from "pizzip";
// @ts-ignore
import PizZipUtils from "pizzip/utils/index.js";
// @ts-ignore
import { saveAs } from "file-saver";
import {Anexo1Service} from "../../../services/anexo1.service";
import {Anexo1} from "../../../models/anexo1";
import {Anexo3Service} from "../../../services/anexo3.service";
import {Anexo3} from "../../../models/anexo3";
import {FechaService} from "../../../services/fecha.service";
import {actividadesAnexo9, Anexo9} from "../../../models/anexo9";
import Swal from "sweetalert2";
import {DatePipe} from "@angular/common";
import Docxtemplater from "docxtemplater";
import {InformeSeguimientoService} from "../../../services/informeseguimiento.service";
import {CordinadorvinculacionService} from "../../../services/cordinadorvinculacion.service";
import {CordinadorVinculacion} from "../../../models/cordinadorvinculacion";
import {Anexo8} from "../../../models/anexo8";
import {Anexo8Service} from "../../../services/anexo8.service";
import {
  Anexo7,
  HorasDocentesA7Request,
  HorasEstudiantesA7Response,
  HorasPersonasResponse,
  TotalHorasResponse
} from "../../../models/anexo7";
import {Anexo7Service} from "../../../services/anexo7.service";
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
  selector: 'app-informeseguimiento',
  templateUrl: './informeseguimiento.component.html',
  styleUrls: ['./informeseguimiento.component.css']
})
export class InformeseguimientoComponent implements OnInit {
  issloading=true;
  isLinear = true;
  situacionInicio?:String;
  situacionActual?:String;
  conclusiones?:String;
  observacionesInformeSeguimiento?:String;
  fecha?:Date;
  nombres?:String;
  cedula?:String;
  rows: UntypedFormArray;
  rowsEst: UntypedFormArray;
  rowsInfo:UntypedFormArray;
  rowsObje:UntypedFormArray;
  cv:CordinadorVinculacion = new CordinadorVinculacion();
  //grupos
  firstFormGroup?: UntypedFormGroup;
  secondFormGroup?: UntypedFormGroup;
  thirdFormGroup?:UntypedFormGroup;
  fourFormGroup?:UntypedFormGroup;
  fiveFormGroup?:UntypedFormGroup;
  sixFormGroup?:UntypedFormGroup;
  sevenFormGroup?:UntypedFormGroup;
  eigthFormGroup?:UntypedFormGroup;
  nineFormGroup?:UntypedFormGroup;
  myControl = new UntypedFormControl();
  proyectos:Proyectos[]=[];
  proyectoSelect:Proyectos=new Proyectos();
  entidadS:Entidadbeneficiaria=new Entidadbeneficiaria();
  anexo1select: Anexo1= new Anexo1();
  anexo1selectLista: Anexo1[]= [];
  docentesselectLista: TotalHorasResponse []= [];
  estudiantesselectLista: TotalHorasResponse[]=[];
  actividadesSelectListaa: HorasPersonasResponse []=[];
  anexo3select: Anexo3[]=[];
  anexo8select: Anexo8[]=[];
  anexo8select1: Anexo8  = new Anexo8();
  filteredOptions?: Observable<Proyectos[]>;
  entidadSelect:Entidadbeneficiaria=new Entidadbeneficiaria();
  carreraSelect:Carreras= new Carreras();
  constructor(private _formBuilder: UntypedFormBuilder,
              private activatedRoute: ActivatedRoute,
              private proyectoService: ProyectoService,
              private entidadService: EntidadbeneficiarioService,
              private carreraService: CarrerasService,
              private anexo1Service: Anexo1Service,
              private anexo3Service: Anexo3Service,
              private fechaService: FechaService,
              private informeService: InformeSeguimientoService,
              private coordinadorService: CordinadorvinculacionService,
              private anexo7Service: Anexo7Service) {
    this.thirdFormGroup = this._formBuilder.group({
      items: [null, Validators.required],
      items_value: ['no', Validators.required]

    });
    this.fourFormGroup = this._formBuilder.group({
      items: [null, Validators.required],
      items_value: ['no', Validators.required]

    });
    this.sixFormGroup = this._formBuilder.group({
      items: [null, Validators.required],
      items_value: ['no', Validators.required]

    });
    this.rowsObje = this._formBuilder.array([]);
    this.sevenFormGroup = this._formBuilder.group({
      items: [null, Validators.required],
      items_value: ['no', Validators.required]

    });
    this.rows = this._formBuilder.array([]);
    this.rowsEst = this._formBuilder.array([]);
    this.rowsInfo = this._formBuilder.array([]);
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
    }, 1000)
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params=>{
      let id=params['id']
      let cedula=params['cedula']
      let nombres=params['nombres']
      this.nombres=nombres
      this.cedula=cedula
      this.proyectoService.getProyectosCICedulaDirector(cedula).subscribe(dataPro=>{
        this.proyectos=dataPro.filter(value => value.nombredirector==nombres&&value.estado==true);
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(values => this.filter(values)),
        );
        this.issloading = false;
      })
    })
    this.firstFormGroup = this._formBuilder.group({
      proyecto: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
    });
    this.thirdFormGroup = this._formBuilder.group({
    });

    this.thirdFormGroup.get("items_value")?.setValue("yes");
    this.thirdFormGroup.addControl('rows', this.rows);

    this.fourFormGroup = this._formBuilder.group({
    });

    this.fourFormGroup.get("items_value")?.setValue("yes");
    this.fourFormGroup.addControl('rowsEst', this.rowsEst);
    this.sixFormGroup = this._formBuilder.group({
      situacion: ['', Validators.required],
    });
    this.sixFormGroup.get("items_value")?.setValue("yes");
    this.sixFormGroup.addControl('rowsObje', this.rowsObje);

    this.fiveFormGroup = this._formBuilder.group({
      fecha: ['', Validators.required],
    });


    this.sevenFormGroup = this._formBuilder.group({
    });

    this.sevenFormGroup.get("items_value")?.setValue("yes");
    this.sevenFormGroup.addControl('rowsInfo', this.rowsInfo);

    this.eigthFormGroup = this._formBuilder.group({
      fechaEn: ['', Validators.required],
    });
    this.nineFormGroup = this._formBuilder.group({
      docx: ['', Validators.required],
    });
    this.fechaService.getSysdate().subscribe(value => {
      this.fecha=value.fecha;
    })
  }
  filter(value: any): Proyectos[] {
    const filterValue = value.toString().toLowerCase();
    return this.proyectos.filter(option => option.nombre?.toLowerCase().includes(filterValue)
      || option.nombredirector?.toLocaleLowerCase().includes(filterValue)
    );
  }
  selectionProyecto(proyectoSele: MatSelectionListChange){
    this.proyectoSelect=proyectoSele.option.value
    // console.log(this.proyectoSelect)

    this.proyectoSelect.objetivosEspecificosProyecto?.forEach(value=>{
      this.onAddRowOb(value)

    })
    this.entidadService.getsaveEntidadBeneficiariabyId(Number(this.proyectoSelect.id)).subscribe(dataE=>{
      this.entidadSelect=dataE
      console.log(dataE)
      this.carreraService.getCarrerabyCodigo(String(this.proyectoSelect.codigocarrera)).subscribe(dataC=>{
        this.carreraSelect=dataC
        this.anexo1Service.getAnexo1byCedula(this.cedula).subscribe(dataAnexo1=>{
          this.anexo1select=dataAnexo1[0]
          this.anexo7Service.docentesEst(Number(this.proyectoSelect.id)).subscribe(dataAn1=>{
            this.estudiantesselectLista=dataAn1
            this.estudiantesselectLista.forEach(value => this.onAddRowEst(value));
            console.log(dataAn1)
          })
          this.anexo7Service.actividadesParticipantes(Number(this.proyectoSelect.id)).subscribe(dataAct=>{
            this.actividadesSelectListaa=dataAct
            this.actividadesSelectListaa.forEach(value => this.onAddRowInfo(value));
          })

              this.anexo3select.forEach(value => {this.onAddRowEst(value)});
              this.anexo7Service.docentesPart(Number(this.proyectoSelect.id)).subscribe(dataAn1=>{
                this.docentesselectLista=dataAn1
                this.docentesselectLista.forEach(value => this.onAddRow(value));
                this.coordinadorService.getCVbyId(Number(this.entidadSelect.idCoordinador)).subscribe(dataCv=>{
                  this.cv=dataCv
                  // console.log(dataCv)
                })
              })
          //console.log(this.anexo1selectLista)
              //console.log(this.anexo3select)




        })
      })
    })
    }
onAddRowOb(objetivosEspecificosInforme: ObjetivosEspeciicoslistProyecto ){
  this.rowsObje.push(this.createItemFormGroupObje(objetivosEspecificosInforme));
  //console.log(this.rowsObje.getRawValue())
}
  onAddRow(docentesParticipantes: TotalHorasResponse) {
    this.rows.push(this.createItemFormGroup(docentesParticipantes));
    //console.log(this.rows.getRawValue())
  }
  onAddRowEst(estudiantesParticipantes: TotalHorasResponse) {
    this.rowsEst.push(this.createItemFormGroupEst(estudiantesParticipantes));
   // console.log(this.rowsEst.getRawValue())
  }
  createItemFormGroup(docentesParticipantes:TotalHorasResponse): UntypedFormGroup {
    return this._formBuilder.group({
      nombres:[docentesParticipantes.nombre,Validators.required],
      cedula:[docentesParticipantes.cedula,Validators.required],
      carrera:[docentesParticipantes.carrera,Validators.required],
      numeroHoras:[docentesParticipantes.horas,Validators.required]
    });
  }
  createItemFormGroupEst(estudiantesParticipantes: TotalHorasResponse): UntypedFormGroup {
    return this._formBuilder.group({
      nombres:[estudiantesParticipantes.nombre,Validators.required],
      cedula:[estudiantesParticipantes.cedula,Validators.required],
      carrera:[estudiantesParticipantes.carrera,Validators.required],
      numeroHoras:[estudiantesParticipantes.horas,Validators.required]
    });
  }



  onAddRowInfo(actividadesInformeSeguimientoRequest: HorasPersonasResponse) {
    this.rowsInfo.push(this.createItemFormGroupInfo(actividadesInformeSeguimientoRequest));
    //console.log(this.rowsInfo.getRawValue())
  }

  createItemFormGroupInfo(actividadesInformeSeguimientoRequest: HorasPersonasResponse): UntypedFormGroup {
    return this._formBuilder.group({
      actividades:[actividadesInformeSeguimientoRequest.actividad, Validators.required],
      porcentajeCumplimiento:['', Validators.required],
      fechaEjecucion:[actividadesInformeSeguimientoRequest.fechaInicio, Validators.required],
      responsableEjecucion:[actividadesInformeSeguimientoRequest.nombre, Validators.required],
      documento:['', Validators.required],
      observaciones:['', Validators.required]
    });
  }

  createItemFormGroupObje(objetivosEspecificosInforme: ObjetivosEspeciicoslistProyecto): UntypedFormGroup {
    return this._formBuilder.group({
      descripcion:[objetivosEspecificosInforme.descripcion,Validators.required]
    });
  }
  informe:InformeSeguimiento= new InformeSeguimiento();
  obtenerDatos(){
    this.informe.idProyectoPPP=this.proyectoSelect.id;
    this.informe.programaVinculacion=this.proyectoSelect.programaVinculacion;
    this.informe.lineaAccion=this.proyectoSelect.lineaaccion;
    this.informe.nombreProyecto=this.proyectoSelect.nombre;
    this.informe.carrera=this.carreraSelect.nombre;
    this.informe.docentesParticipantes=this.rows.getRawValue();
    this.informe.estudiantesParticipantes=this.rowsEst.getRawValue();
    this.informe.nombreEntidadBeneficiaria=this.entidadSelect.nombre;
    this.informe.fechaInicio=this.proyectoSelect.fechaInicio;
    this.informe.fechaFin=this.proyectoSelect.fechaFin;
    this.informe.alcanceTerritorial=this.proyectoSelect.alcanceTerritorial;
    this.informe.objetivoGeneral=this.proyectoSelect.objetivoGeneral;
    this.informe.objetivosEspecificosInforme=this.rowsObje.getRawValue();
    this.informe.actividadesInformeSeguimientoRequest=this.rowsInfo.getRawValue();
    this.informe.fechaSeguimiento=this.fecha;
    this.informe.cedulaCoordinadorVinculacion=this.cv.cedula;
    this.informe.nombreDirector=this.proyectoSelect.nombredirector;
    this.informe.nombreCoordinadorVinculacion=this.cv.nombres;
    return this.informe;
  }
  guardarAnexo(){
    var informeS=this.obtenerDatos();
    this.informeService.saveAnexo(informeS).subscribe(value => {
      //console.log(informeS)
      Swal.fire({
        title: 'Exito',
        text: 'Informe seguimiento creado',
        icon: 'success',
        iconColor :'#17550c',
        color: "#0c3255",
        confirmButtonColor:"#0c3255",
        background: "#fbc02d",
      })
    },error => {
      Swal.fire({
        title: 'Error',
        text: 'Informe seguimiento no se creado '+error.error.message,
        icon: 'error',
        color: "#0c3255",
        confirmButtonColor:"#0c3255",
        background: "#fbc02d",
      })
    })
  }

  subirDocumento(file:FileList){
    if(file.length==0){
    }else{
      getBase64(file[0]).then(docx=>{
        // @ts-ignore
        //console.log(docx.length)
        // @ts-ignore
        if(docx.length>=10485760){
          this.informe.documento="";
          Swal.fire(
            'Fallo',
            'El documento excede el peso permitido',
            'warning'
          )
        }else{
          this.informe.documento=docx+"";
          //console.log(this.informe.documento)
        }
      })
    }
  }

  generarDocumento() {
    var informe:InformeSeguimiento=this.obtenerDatos();
    //console.log(informe)
    var pipe:DatePipe = new DatePipe('en-US')
    loadFile("https://raw.githubusercontent.com/Jose-22-ced/VinculacionWeb/master/src/assets/docs/informe%201.docx", function(
      // @ts-ignore
      error,
      // @ts-ignore
      content
    ) {
      if (error) {
        throw error;
      }
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });


      doc.setData({
        nombreProyecto:informe.nombreProyecto,
        nombreDirector:informe.nombreDirector,
        programaVinculacion:informe.programaVinculacion,
        lineaAccion:informe.lineaAccion,
        carrera:informe.carrera,
        tb2:informe.docentesParticipantes,
        tb3:informe.estudiantesParticipantes,
        nombreEntidadBeneficiaria:informe.nombreEntidadBeneficiaria,
        fechaInicio:informe.fechaInicio,
        fechaFin:informe.fechaFin,
        fechaSeguimiento:informe.fechaSeguimiento,
        fechaInicioReal:informe.fechaInicioReal,
        fechaFinReal:informe.fechaFinReal,
        alcanceTerritorial:informe.alcanceTerritorial,
        objetivoGeneral:informe.objetivoGeneral,
        tb5:informe.objetivosEspecificosInforme,
        situacionInicio:informe.situacionInicio,
        situacionActual:informe.situacionActual,
        tb4:informe.actividadesInformeSeguimientoRequest,
        conclusiones:informe.conclusiones,
        observacionesInformeSeguimiento:informe.observacionesInformeSeguimiento,
        nombreCoordinadorVinculacion:informe.nombreCoordinadorVinculacion,
        fechaEntrega:informe.fechaEntrega


      });
      try {
        // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
        doc.render();
      } catch (error) {
        // The error thrown here contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
        // @ts-ignore
        function replaceErrors(key, value) {
          if (value instanceof Error) {
            return Object.getOwnPropertyNames(value).reduce(function(
                error,
                key
              ) {
                // @ts-ignore
                error[key] = value[key];
                return error;
              },
              {});
          }
          return value;
        }
        //console.log(JSON.stringify({ error: error }, replaceErrors));
        // @ts-ignore
        if (error.properties && error.properties.errors instanceof Array) {
          // @ts-ignore
          const errorMessages = error.properties.errors
            // @ts-ignore
            .map(function(error) {
              return error.properties.explanation;
            })
            .join("\n");
          //console.log("errorMessages", errorMessages);
          // errorMessages is a humanly readable message looking like this :
          // 'The tag beginning with "foobar" is unopened'
        }
        throw error;
      }
      const out = doc.getZip().generate({
        type: "blob",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      });
      // Output the document using Data-URI
      saveAs(out, "InformeSeguimiento.docx");
    });
  }
}
