import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FechaService} from "../../../services/fecha.service";
import {ProyectoService} from "../../../services/proyecto.service";
import {ResponsablepppService} from "../../../services/responsableppp.service";
import {FormBuilder, FormControl} from "@angular/forms";
import {EntidadbeneficiarioService} from "../../../services/entidadbeneficiario.service";
import {DateAdapter} from "@angular/material/core";
import {Anexo2Service} from "../../../services/anexo2.service";
import {Anexo3Service} from "../../../services/anexo3.service";
import {OtrosService} from "../../../services/otros.service";
import {MateriasService} from "../../../services/materias.service";
import {map, Observable, startWith} from "rxjs";
import {Anexo3} from "../../../models/anexo3";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
// @ts-ignore
import { saveAs } from "file-saver";
import {Proyectos} from "../../../models/proyectos";
import Swal from "sweetalert2";
import {Anexo2} from "../../../models/anexo2";
import Docxtemplater from "docxtemplater";
// @ts-ignore
import PizZip from "pizzip";
// @ts-ignore
import PizZipUtils from "pizzip/utils/index.js";
import {Anexo4} from "../../../models/anexo4";
import {DatePipe} from "@angular/common";
import {Anexo4Service} from "../../../services/anexo4.service";

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
  selector: 'app-verpostulaciones1',
  templateUrl: './verpostulaciones1.component.html',
  styleUrls: ['./verpostulaciones1.component.css']
})
export class Verpostulaciones1Component implements OnInit {
  issloading=true;
  isexist?:boolean

  anexo3pendientes:Anexo3[]=[];
  anexo3aceptados:Anexo3[]=[];
  anexo3rechazados:Anexo3[]=[];

  cedula?:String;

  proyecto:Proyectos[]=[];

  //tablas
  displayedColumns: string[] = ['nombresestudiante', 'apellidosestudiante', 'cedula', 'paralelo','nombreproyecto','fecha_solicitud','documento','aceptar','denegar'];
  // @ts-ignore
  dataSource: MatTableDataSource<Anexo3>;
  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ts-ignore
  @ViewChild(MatSort) sort: MatSort;

  myControla = new FormControl();
  filteredOptionsa?: Observable<Anexo3[]>;
  myControlr = new FormControl();
  filteredOptionsr?: Observable<Anexo3[]>;

  constructor(private router: Router,
              private fechaService:FechaService,
              private activatedRoute: ActivatedRoute,
              private proyectoService:ProyectoService,
              private responsablepppService:ResponsablepppService,
              private _formBuilder: FormBuilder,
              private entidadbeneficiarioService:EntidadbeneficiarioService,
              private _adapter: DateAdapter<any>,
              private anexo2Service:Anexo2Service,
              private anexo3Service:Anexo3Service,
              private anexo4Service:Anexo4Service) {
    this._adapter.setLocale('es-ec');
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( params => {
      let cedula = params['cedula']
      this.cedula=cedula
      this.cargarpostulaiones(cedula);
    })
  }

  cargarpostulaiones(cedula:String){
    this.responsablepppService.getResposablepppbyAll().subscribe(value => {
      this.proyectoService.getProyectos().subscribe(value1 => {
        this.proyecto=value1.filter(value2 => value2.codigocarrera==value.filter(value1 => value1.cedula==cedula)[0].codigoCarrera&&value2.estado==true);
      })
      this.anexo3Service.getAnexo3byCodigoCorrera(value.filter(value1 => value1.cedula==cedula)[0].codigoCarrera).subscribe(value1 => {
        this.isexist=value1.length!=0;
        this.anexo3pendientes=value1.filter(value2 => value2.estado=="PN")
        this.anexo3aceptados=value1.filter(value2 => value2.estado=="AN")
        this.filteredOptionsa = this.myControla.valueChanges.pipe(
          startWith(''),
          map(values=>this.filtera(values)),
        );
        this.anexo3rechazados=value1.filter(value2 => value2.estado=="DN")
        this.issloading=false;
        this.filteredOptionsr = this.myControlr.valueChanges.pipe(
          startWith(''),
          map(values=>this.filterr(values)),
        );
      })
    })
  }

  proyetoFilterp(event: any){
    console.log(this.anexo3pendientes)
    if(event+""!="ND"){
      this.dataSource = new MatTableDataSource(this.anexo3pendientes.filter(value => value.nombreproyecto==event+""));
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }else {
      this.dataSource = new MatTableDataSource(this.anexo3pendientes);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }
  proyetoFiltera(event: any){
    console.log(this.anexo3pendientes)
    if(event+""!="ND"){
      this.dataSource = new MatTableDataSource(this.anexo3pendientes.filter(value => value.nombreproyecto==event+""));
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }else {
      this.dataSource = new MatTableDataSource(this.anexo3pendientes);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  filtera(value: any): Anexo3[] {
    const filterValue = value.toLowerCase();
    return this.anexo3aceptados.filter(option => option.cedula?.toLowerCase().includes(filterValue)
      ||option.nombreproyecto?.toLocaleLowerCase().includes(filterValue)
      ||option.nombresestudiante?.toLocaleLowerCase().includes(filterValue)
      ||option.apellidosestudiante?.toLocaleLowerCase().includes(filterValue)
      ||option.ciclo?.toLocaleLowerCase().includes(filterValue)
    );
  }
  filterr(value: any): Anexo3[] {
    const filterValue = value.toLowerCase();
    return this.anexo3rechazados.filter(option => option.cedula?.toLowerCase().includes(filterValue)
      ||option.nombreproyecto?.toLocaleLowerCase().includes(filterValue)
      ||option.nombresestudiante?.toLocaleLowerCase().includes(filterValue)
      ||option.apellidosestudiante?.toLocaleLowerCase().includes(filterValue)
      ||option.ciclo?.toLocaleLowerCase().includes(filterValue)
    );
  }

  async aceptarPostulacion(anexo: Anexo3) {
    var anexo4=this.obtnerdatos(anexo);
    Swal.fire({
      allowOutsideClick: false,
      allowEnterKey:false,
      allowEscapeKey:false,
      title: '¡ATENCIÓN!',
      text: '🔊 Antes de "CONTINUAR LA ACEPTACIÓN" usted deberá: ' +
        '1. Obtener el anexo\n' +
        '2. Firmar el anexo y trasnformarlo a PDF '+
        '3. Dar clic en "Continuar Postulación"',
      icon: 'info',
      showDenyButton: true,
      showCancelButton: true,
      cancelButtonText: 'Salir, y continuar después',
      confirmButtonText: '📑OBTENER ANEXO',
      denyButtonText: `CONTINUAR POSTULACIÓN 👉`,
      denyButtonColor: "#3cb227",
      color: "#0c3255",
      confirmButtonColor: "#0c3255",
      background: "#fbc02d",
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        const { value: number } = await Swal.fire({
          allowOutsideClick: false,
          allowEnterKey:false,
          allowEscapeKey:false,
          showCancelButton: true,
          cancelButtonText: 'Salir, y continuar después',
          title: 'Ingrese el número de horas',
          input: 'number',
          inputLabel: 'Número de horas',
          inputPlaceholder: 'Ingrese el número de horas',
          color: "#0c3255",
          confirmButtonColor: "#0c3255",
          background: "#f3e0b8",
        })
        if (number) {
          anexo4.numeroHoras=number;
          console.log(anexo4.numeroHoras)
          this.generarDocumento(anexo4);
        }
      } else if (result.isDenied) {
        const {value: text} = await Swal.fire({
          allowOutsideClick: false,
          allowEnterKey:false,
          allowEscapeKey:false,
          input: 'textarea',
          color: "#0c3255",
          confirmButtonColor: "#3cb227",
          confirmButtonText: "CONTINUAR ACEPTACIÓN 👉",
          background: "#f3e0b8",
          cancelButtonText: 'Salir, y continuar después',
          title:'¡ATENCIÓN!',
          text:"Es importante dar una explicación por el cual la postulación del estudiante ha sido aceptado.",
          inputLabel: '¿POR QUÉ?',
          inputPlaceholder: 'La razón de....',
          inputAttributes: {
            'aria-label': 'Type your message here'
          },
          showCancelButton: true
        })
        if (text) {
          anexo.razon=text;
          anexo.estado="AN";
          console.log(anexo.razon)
          const {value: file} = await Swal.fire({
            allowOutsideClick: false,
            allowEnterKey:false,
            allowEscapeKey:false,
            showCancelButton: true,
            confirmButtonText:"ENVIAR ACEPTACIÓN 👉",
            color: "#0c3255",
            confirmButtonColor: "#3cb227",
            background: "#fbc02d",
            title: 'Confirmación',
            text: 'Debe subir el anexo en el formato requerido "PDF" para finalizar. Nota: Sea reponsable con el documento a subir.',
            input: 'file',
            inputAttributes: {
              'accept': 'application/pdf',
              'aria-label': 'Debe subir el documento en formato PDF'
            },
            inputValidator: (value) => {
              return new Promise((resolve) => {
                if (value === null) {
                  resolve('Es necesario que seleccione el PDF del anexo')
                } else {
                  this.issloading=true;
                  getBase64(value).then(docx => {
                    anexo4.documento = docx + '';
                    this.anexo4Service.saveAnexo4(anexo4).subscribe(value1 => {
                      this.anexo3Service.updateAnexo3(anexo).subscribe(value => {
                        Swal.fire({
                          title: 'Éxito',
                          text: 'La aceptación ha sido enviada',
                          icon: 'success',
                          iconColor :'#17550c',
                          color: "#0c3255",
                          confirmButtonColor:"#0c3255",
                          background: "#fbc02d",
                        })
                        this.cargarpostulaiones(this.cedula+"")
                        this.router.navigate(['/panelusuario/proyectovinculacion/verportulaciones1',this.cedula]);
                      },error => {
                        Swal.fire({
                          title: 'Ha surgido un error',
                          text: "Hubo un error, contáctese con TICs.",
                          icon: 'info',
                          iconColor :'#17550c',
                          color: "#0c3255",
                          confirmButtonColor:"#0c3255",
                          background: "#fbc02d",
                        })
                      })
                      this.issloading=false;
                    },error => {
                      Swal.fire({
                        title: 'Ha surgido un error',
                        text: "Hubo un error, contáctese con TICs.",
                        icon: 'info',
                        iconColor :'#17550c',
                        color: "#0c3255",
                        confirmButtonColor:"#0c3255",
                        background: "#fbc02d",
                      })
                      this.issloading=false;
                    })
                  })
                }
              })
            }
          })
        }
      }
    })
  }
  anexo4response:Anexo4 = new Anexo4();
  obtnerdatos(anexo3:Anexo3):Anexo4{
    this.anexo4response.idProyectoPPP=anexo3.idProyectoPPP;
    this.anexo4response.nombreEstudiante=anexo3.nombresestudiante+" "+anexo3.apellidosestudiante;
    this.anexo4response.nombreResponsable=anexo3.nombre_responsable;
    this.anexo4response.nombreProyecto=anexo3.nombreproyecto;
    this.anexo4response.siglasCarrera=anexo3.siglas_carrera;
    this.fechaService.getSysdate().subscribe(data=>{
      this.anexo4response.fechaRespuesta=data.fecha;});
    this.anexo3Service.getDocenteDirectorbyCodigoProyecto(anexo3.idProyectoPPP).subscribe(data=>{
      this.anexo4response.nombreDirector=data.nombre+" "+data.apellidos;
    })
    this.anexo3Service.getReprecentantebyCodigoProyecto(anexo3.idProyectoPPP).subscribe(data=>{
      this.anexo4response.nombreRepresentante=data.nombre;
    })
    this.anexo4response.cedulaEstudiante=anexo3.cedula;
    this.anexo4response.num_proceso=1;
    return this.anexo4response;
  }


  async denegarPostulacion(anexo: Anexo3) {
    const {value: text} = await Swal.fire({
      allowOutsideClick: false,
      allowEnterKey:false,
      allowEscapeKey:false,
      input: 'textarea',
      color: "#0c3255",
      confirmButtonColor: "#be1b1b",
      confirmButtonText: "ENVIAR DENEGACIÓN 👉",
      background: "#f3e0b8",
      cancelButtonText: 'Salir, y continuar después',
      title: '¡ATENCIÓN!',
      text:"Es importante dar una explicación por el cual la postulación del estudiante ha sido denegado.",
      inputLabel: '¿POR QUÉ?',
      inputPlaceholder: 'La razón de....',
      inputAttributes: {
        'aria-label': 'Type your message here'
      },
      showCancelButton: true
    })
    if (text) {
      this.issloading=true;
      anexo.razon=text;
      anexo.estado="DN";
      this.anexo3Service.updateAnexo3(anexo).subscribe(value => {
        Swal.fire({
          title: 'Éxito',
          text: 'La denagación ha sido denagada',
          icon: 'success',
          iconColor :'#17550c',
          color: "#0c3255",
          confirmButtonColor:"#0c3255",
          background: "#fbc02d",
        })
        this.cargarpostulaiones(this.cedula+"")
        this.router.navigate(['/panelusuario/proyectovinculacion/verportulaciones1',this.cedula]);
      },error => {
        Swal.fire({
          title: 'Ha surgido un error',
          text: "Hubo un error, contáctese con TICs.",
          icon: 'info',
          iconColor :'#17550c',
          color: "#0c3255",
          confirmButtonColor:"#0c3255",
          background: "#fbc02d",
        })
        this.issloading=false;
      })
    }
  }


  generarDocumento(anexo4:Anexo4) {
    var pipe:DatePipe = new DatePipe('en-US')
    loadFile("https://raw.githubusercontent.com/Jose-22-ced/VinculacionWeb/master/src/assets/docs/anexo4.docx", function(
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
        fecha: pipe.transform(anexo4.fechaRespuesta,'dd/MM/yyyy'),
        nombre_estudiante:anexo4.nombreEstudiante,
        nombre_proyecto:anexo4.nombreProyecto,
        siglas_carrera:anexo4.siglasCarrera,
        nombre_poryecto:anexo4.nombreProyecto,
        nom_director_proy:anexo4.nombreDirector,
        nom_respre_entidad:anexo4.nombreRepresentante,
        num_horas_asignadas:anexo4.numeroHoras,
        nom_responsable_vinculacion:anexo4.nombreResponsable,
        nom_apell_estudiante:anexo4.nombreEstudiante
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
      saveAs(out, "Anexo 4 aceptacion al estudiante "+ anexo4.nombreEstudiante+".docx");
    });
  }

  convertFile(docum:any) {
    console.log(docum)
    //Usage example:
    var file = this.dataURLtoFile(docum, 'Anexo3.pdf');
    console.log(file);
    saveAs(file, 'Anexo3.pdf');
  }
  dataURLtoFile(dataurl:any, filename:any) {
    try {
      let arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });

    } catch (error) {
      let arr = dataurl,
        mime = arr,
        bstr = atob(arr),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    }
  }

}
