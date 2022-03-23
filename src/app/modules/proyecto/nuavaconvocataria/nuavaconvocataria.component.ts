import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FechaService} from "../../../services/fecha.service";
import {ProyectoService} from "../../../services/proyecto.service";
import {ResponsablepppService} from "../../../services/responsableppp.service";
import {Proyectos} from "../../../models/proyectos";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatSelectionListChange} from "@angular/material/list";
import {EntidadbeneficiarioService} from "../../../services/entidadbeneficiario.service";
import {DateAdapter} from "@angular/material/core";
import {map, Observable, startWith} from "rxjs";
import {Actividadesanexo, Anexo2, Fechas} from "../../../models/anexo2";
import {Anexo2Service} from "../../../services/anexo2.service";
import {Anexo1} from "../../../models/anexo1";
import Docxtemplater from "docxtemplater";
// @ts-ignore
import PizZip from "pizzip";
// @ts-ignore
import PizZipUtils from "pizzip/utils/index.js";
// @ts-ignore
import { saveAs } from "file-saver";
import { DatePipe } from '@angular/common';

function loadFile(url:any, callback:any) {
  PizZipUtils.getBinaryContent(url, callback);
}

@Component({
  selector: 'app-nuavaconvocataria',
  templateUrl: './nuavaconvocataria.component.html',
  styleUrls: ['./nuavaconvocataria.component.css']
})
export class NuavaconvocatariaComponent implements OnInit {
  issloading=true;
  isexist?:boolean;
  isLinear = true;
  myControl = new FormControl();
  filteredOptions?: Observable<Proyectos[]>;
  firstFormGroup?: FormGroup;
  secondFormGroup?: FormGroup;
  tercerFormGroup?: FormGroup;
  proyectos:Proyectos[]=[];
  proyectoselect:Proyectos = new Proyectos();
  actividadesanexo:Actividadesanexo[]=[]
  anexo2:Anexo2=new Anexo2();
  fechas:Fechas=new Fechas()
  numeroConvocatoria?:String;
  data:Date = new Date();

  //
  fechae1?:Date;
  fechae2?:Date;

  fechar1?:Date;
  fechar2?:Date;

  fechap1?:Date;
  fechap2?:Date;

  fechan1?:Date;
  fechan2?:Date;
  //
  constructor(private router: Router,
              private fechaService:FechaService,
              private activatedRoute: ActivatedRoute,
              private proyectoService:ProyectoService,
              private responsablepppService:ResponsablepppService,
              private _formBuilder: FormBuilder,
              private entidadbeneficiarioService:EntidadbeneficiarioService,
              private _adapter: DateAdapter<any>,
              private anexo2Service:Anexo2Service) {
    this._adapter.setLocale('es-ec');
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( params => {
      let cedula = params['cedula']
      console.log(cedula)
      this.responsablepppService.getResposablepppbyAll().subscribe(value => {
        this.proyectoService.getProyectos().subscribe(value1 => {
          this.isexist=value1.filter(value2 => value2.codigocarrera==value.filter(value3 => value3.cedula==cedula)[0]).length==0;
          this.proyectos=value1.filter(value2 => value2.codigocarrera==value.filter(value3 => value3.cedula==cedula)[0].codigoCarrera)
          this.anexo2Service.getAnexo2().subscribe(anexo2=>{
            if(anexo2.filter(fil=>fil.siglasCarrera==this.proyectos[0].codigocarrera).length==0){
              this.numeroConvocatoria="1";
            }else{
              this.numeroConvocatoria=(Number(anexo2.filter(fil=>fil.siglasCarrera==this.proyectos[0].codigocarrera)[0].numeroConvocatoria)+1).toString();
            }
          })
          this.issloading=false;
          this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(''),
            map(values=>this.filter(values)),
          );
        })
      })

    })

    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      ciclo: ['', Validators.required],
      fecharesep: ['', Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required],
      start1: ['', Validators.required],
      end1: ['', Validators.required],
      start2: ['', Validators.required],
      end2: ['', Validators.required],
      start3: ['', Validators.required],
      end3: ['', Validators.required],
      correo:['', [Validators.required,Validators.email]],
    });
    this.tercerFormGroup = this._formBuilder.group({
      docx:['', Validators.required]
    });
  }
  ngAfterViewInit(): void {
    setTimeout(()=>{

    },1000)
  }
  filter(value: any): Proyectos[] {
    const filterValue = value.toLowerCase();
    return this.proyectos.filter(option => option.nombre?.toLowerCase().includes(filterValue)
      ||option.nombre?.toLocaleLowerCase().includes(filterValue)
      ||option.nombredirector?.toLocaleLowerCase().includes(filterValue)
      ||option.alcanceTerritorial?.toLocaleLowerCase().includes(filterValue)
      ||option.lineaaccion?.toLocaleLowerCase().includes(filterValue)
      ||option.nombreresponsable?.toLocaleLowerCase().includes(filterValue)
    );
  }
  selectionProyecto(proyectoselect: MatSelectionListChange){
    this.proyectoselect=proyectoselect.option.value
    console.log(this.proyectoselect)
  }


  obtnerDatos(proyecto:Proyectos):Anexo2 {
    this.actividadesanexo.length=0;
    this.actividadesanexo.push({
      descripcion:"Emisión de la convocatoria",
      inicio: this.fechae1,
      fin:this.fechae2,
    },{
      descripcion:"Recepción de solicitudes",
      inicio:this.fechar1,
      fin:this.fechar2,
    },{
      descripcion:"Proceso de selección",
      inicio:this.fechap1,
      fin:this.fechap2,
    },{
      descripcion:"Notificación de resultados",
      inicio:this.fechan1,
      fin:this.fechan2,
    })

    this.fechas.fechae1=this.fechae1;
    this.fechas.fechae2=this.fechae2;
    this.fechas.fechan1=this.fechan1;
    this.fechas.fechan2=this.fechan2;
    this.fechas.fechap1=this.fechap1;
    this.fechas.fechap2=this.fechap2;
    this.fechas.fechar1=this.fechar1;
    this.fechas.fechar2=this.fechar2;

    this.anexo2.numeroConvocatoria =this.numeroConvocatoria;
    this.anexo2.siglasCarrera=proyecto.codigocarrera;
    this.anexo2.carrera = proyecto.carrera;
    this.anexo2.num_proceso=1;
    this.anexo2.nombreProyecto = proyecto.nombre;
    this.anexo2.nombreResponsable = proyecto.nombreresponsable;
    this.anexo2.idProyectoPPP = proyecto.id;
    this.anexo2.actividades=this.actividadesanexo;
    this.fechaService.getSysdate().subscribe(value => {
      this.anexo2.anio = this.data.getFullYear()+""
      this.anexo2.fecha = value.fecha;
    })
    this.entidadbeneficiarioService.getEntidadBeneficiariaAll().subscribe(value => {
      this.anexo2.entidadBeneficiaria=value.filter(value1 => value1.idEntidad==proyecto.entidadbeneficiaria)[0].nombre
    })
    return this.anexo2
  }


  generarDocumento(proyecto:Proyectos,fechas:Fechas) {
    console.log(this.obtnerDatos(proyecto))
    var pipe:DatePipe = new DatePipe('en-US')
    var anexo:Anexo2=this.obtnerDatos(proyecto);
    var fecha:[];

    // @ts-ignore
    fecha=String(anexo.fecha).split("T");
    loadFile("https://raw.githubusercontent.com/Sbryan20/Sistema-PPProfesionales/main/src/assets/doc/anexo2.docx", function(
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
        // @ts-ignore
        fecha: fecha[0],
        siglas: anexo.siglasCarrera,
        anio: anexo.anio,
        num_convocatoria: anexo.numeroConvocatoria,
        ciclo: anexo.ciclo,
        carrera: anexo.carrera,
        nombre_proyeto: anexo.nombreProyecto,
        entidad_beneficiaria: anexo.entidadBeneficiaria,
        actividades: proyecto.actividadeslistProyectos,
        nombre_proyecto:anexo.nombreProyecto,
        asignatura: proyecto.requisitoslistProyectos,
        //Enlistar las asignaturas que necesitarán haber aprobado para ejecutar las actividades
        nombre_doc_responsableppp: anexo.nombreResponsable,
        email_doc_responsableppp: anexo.emailDocente,
        fecha_max:pipe.transform(anexo.fechaMaxRecepcion,'dd/MM/yyyy'),
        fecha_inic_convocatoria: pipe.transform(fechas.fechae1,'dd/MM/yyyy'),
        fecha_fin_convocatoria:pipe.transform(fechas.fechae2,'dd/MM/yyyy'),
        fecha_inic_recepcion:pipe.transform(fechas.fechar1,'dd/MM/yyyy'),
        fecha_lim_recepcion:pipe.transform(fechas.fechar2,'dd/MM/yyyy'),
        fecha_inic_seleccion:pipe.transform(fechas.fechap1,'dd/MM/yyyy'),
        fecha_fin_seleccion:pipe.transform(fechas.fechap2,'dd/MM/yyyy'),
        fecha_i_not_resultados:pipe.transform(fechas.fechan1,'dd/MM/yyyy'),
        fecha_f_not_resultados:pipe.transform(fechas.fechan2,'dd/MM/yyyy'),
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
      saveAs(out, "Anexo2 "+anexo.nombreResponsable+" Nª"+anexo.numeroConvocatoria+".docx");
    });
  }


}
