import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {FechaService} from "../../../services/fecha.service";
import {ProyectoService} from "../../../services/proyecto.service";
import {ResponsablepppService} from "../../../services/responsableppp.service";
import {EntidadbeneficiarioService} from "../../../services/entidadbeneficiario.service";
import {DateAdapter} from "@angular/material/core";
import {Anexo2Service} from "../../../services/anexo2.service";
import {Anexo3Service} from "../../../services/anexo3.service";
import {Anexo4Service} from "../../../services/anexo4.service";
import {Proyectos} from "../../../models/proyectos";
import {map, Observable, startWith} from "rxjs";
import {Docentes} from "../../../models/docentes";
import {MatSelectionListChange} from "@angular/material/list";
import Swal from "sweetalert2";

import {Anexo3} from "../../../models/anexo3";
import {CordinadorVinculacion} from "../../../models/cordinadorvinculacion";
import {CordinadorvinculacionService} from "../../../services/cordinadorvinculacion.service";
import {Anexo6} from "../../../models/anexo6";
import {DatePipe} from "@angular/common";
import Docxtemplater from "docxtemplater";
// @ts-ignore
import PizZip from "pizzip";
// @ts-ignore
import PizZipUtils from "pizzip/utils/index.js";
// @ts-ignore
import { saveAs } from "file-saver";
import {Anexo6Service} from "../../../services/anexo6.service";
import {Anexo61} from "../../../models/anexo61";
import {Anexo62} from "../../../models/anexo62";
import {InformedeaceptacionestdiatesService} from "../../../services/informedeaceptacionestdiates.service";
import {EstudiantesInformeInicialRequest, Informeaceptacion} from "../../../models/informeaceptacion";


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
  selector: 'app-seleccionestudiantes',
  templateUrl: './seleccionestudiantes.component.html',
  styleUrls: ['./seleccionestudiantes.component.css']
})
export class SeleccionestudiantesComponent implements OnInit {

  isLinear = true;
  firstFormGroup?: FormGroup;
  secondFormGroup?: FormGroup;
  thirthFormGroup?: FormGroup;
  issloading=true;
  proyecto:Proyectos[]=[];
  pryectoselect:Proyectos = new Proyectos();
  myControl = new FormControl();
  filteredOptions?: Observable<Proyectos[]>;
  informeAceotacion:Informeaceptacion = new Informeaceptacion();
  anexo3:Anexo3[]=[];
  constructor(private _formBuilder: FormBuilder,
              private router: Router,
              private fechaService:FechaService,
              private activatedRoute: ActivatedRoute,
              private proyectoService:ProyectoService,
              private responsablepppService:ResponsablepppService,
              private entidadbeneficiarioService:EntidadbeneficiarioService,
              private _adapter: DateAdapter<any>,
              private anexo2Service:Anexo2Service,
              private anexo3Service:Anexo3Service,
              private anexo4Service:Anexo4Service,
              private cordinadorvinculacionService:CordinadorvinculacionService,
              private informedeaceptacionestdiatesService:InformedeaceptacionestdiatesService) {
    this._adapter.setLocale('es-ec');
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe( params => {
      let cedula = params['cedula']
      this.responsablepppService.getResposablepppbyAll().subscribe(value => {
        this.proyectoService.getProyectos().subscribe(value1 => {
          this.proyecto=value1.filter(value2 => value2.estado==true&&value2.codigocarrera==value.filter(value1 => value1.cedula==cedula)[0].codigoCarrera);
          this.cordinadorvinculacionService.getCordinadorVinculacioAll().subscribe(da=>{
            this.informeAceotacion.nombreRevisado=da.nombres+" "+da.apellidos
            this.filteredOptions = this.myControl.valueChanges.pipe(
              startWith(''),
              map(values=>this.filter(values)),
            );
            this.issloading=false;
          })
        })
      })
    })
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      antece: ['', Validators.required],
      objetivo: ['', Validators.required],
      descrip: ['', Validators.required],
    });
    this.thirthFormGroup = this._formBuilder.group({
      docx: ['', Validators.required],
    });
  }

  filter(value: any): Proyectos[] {
    const filterValue = value.toLowerCase();
    return this.proyecto.filter(option => option.nombre?.toLowerCase().includes(filterValue)
      ||option.carrera?.toLocaleLowerCase().includes(filterValue)
      ||option.nombredirector?.toLocaleLowerCase().includes(filterValue)
      ||option.objetivoGeneral?.toLocaleLowerCase().includes(filterValue)
    );
  }

  selectionProyecto(pryectoselect: MatSelectionListChange){
    this.anexo4Service.getAnexo4All().subscribe(value2 => {
      if(value2.filter(value3 => value3.idProyectoPPP==pryectoselect.option.value.id).length==0){
        Swal.fire({
          title: 'Opss',
          text: 'Aun no hay alumnos aceptados o denegados a este proyecto',
          icon: 'success',
          color: "#0c3255",
          confirmButtonColor:"#0c3255",
          background: "#fbc02d",
        })
        window.location.reload();
      }else {
        this.pryectoselect=pryectoselect.option.value;
        this.anexo3Service.getAnexo3byProyecto(this.pryectoselect.id).subscribe(value => {
          this.informeAceotacion.idProyectoPPP=this.pryectoselect.id;
          this.informeAceotacion.nombreProyecto=this.pryectoselect.nombre
          this.informeAceotacion.nombreDirector=this.pryectoselect.nombredirector
          this.informeAceotacion.nombreElaborado=this.pryectoselect.nombreresponsable
          this.informeAceotacion.nombreCarrera=this.pryectoselect.carrera;
          this.anexo3=value;
        })
      }
    })
  }

  alumnosselc:EstudiantesInformeInicialRequest[]=[];
  obtnerdatos():Informeaceptacion{
    this.alumnosselc.length=0;
    this.anexo3.forEach(value => {
      this.alumnosselc.push({
        cedula:value.cedula,
        nombreEstudiante:value.nombresestudiante,
        estado:value.estado,
        observaciones:value.razon
      })
    })
    this.fechaService.getSysdate().subscribe(value => {
      this.informeAceotacion.fechaElaborado=value.fecha+"";
      this.informeAceotacion.fechaRevisado=value.fecha;
      this.informeAceotacion.estudianteInformeInicial=this.alumnosselc;
    })
    return this.informeAceotacion;
  }

  guardarAceptacion(){
    var informe:Informeaceptacion=this.obtnerdatos();
    this.informedeaceptacionestdiatesService.savePreInforme(informe).subscribe(value => {
      Swal.fire({
        title: 'Éxito',
        text: 'Informe guardado exitosamente',
        icon: 'success',
        iconColor :'#17550c',
        color: "#0c3255",
        confirmButtonColor:"#0c3255",
        background: "#fbc02d",
      })
      this.router.navigate(['/panelusuario/proyectovinculacion/verestudiantesseleccionado',informe.nombreElaborado])
    },error => {
      Swal.fire({
        title: 'Ha surgido un error',
        text: "Hubo un error, contáctese con TICs.",
        icon: 'error',
        color: "#0c3255",
        confirmButtonColor:"#0c3255",
        background: "#fbc02d",
      })
    })
  }

  generarDocumento() {
    this.obtnerdatos();
    var informe:Informeaceptacion=this.obtnerdatos();
    console.log(informe)
    var pipe:DatePipe = new DatePipe('en-US')
    loadFile("https://raw.githubusercontent.com/Sbryan20/Sistema-PPProfesionales/main/src/assets/doc/preinforme.docx", function(
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
        nombrecarrera:informe.nombreCarrera,
        nombreproyecto:informe.nombreProyecto,
        nombredirector:informe.nombreDirector,
        antecedentes:informe.antecedentes,
        objetivosGenerales:informe.objetivoGeneral,
        desarrollo:informe.objetivoGeneral,
        tb:informe.estudianteInformeInicial,
        nombreresponsable:informe.nombreElaborado,
        nombrecoordinador:informe.nombreRevisado
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
        console.log(JSON.stringify({ error: error }, replaceErrors));
        // @ts-ignore
        if (error.properties && error.properties.errors instanceof Array) {
          // @ts-ignore
          const errorMessages = error.properties.errors
            // @ts-ignore
            .map(function(error) {
              return error.properties.explanation;
            })
            .join("\n");
          console.log("errorMessages", errorMessages);
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
      saveAs(out, "PROCESO DE SELECCIÓN DE ESTUDIANTES PARA PARTICIPAR EN EL PROYECTO DE VINCULACION.docx");
    });
  }

  subirDocumento(file:FileList){
    if(file.length==0){
    }else{
      getBase64(file[0]).then(docx=>{
        // @ts-ignore
        console.log(docx.length)
        // @ts-ignore
        if(docx.length>=10485760){
          this.informeAceotacion.documento="";
          Swal.fire(
            'Fallo',
            'El docemento es demaciado pesado',
            'warning'
          )
        }else{
          this.informeAceotacion.documento=docx+"";
        }
      })
    }
  }
}
