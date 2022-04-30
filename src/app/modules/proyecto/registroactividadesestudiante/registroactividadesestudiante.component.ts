import { Component, OnInit } from '@angular/core';
import {Anexo3} from "../../../models/anexo3";
import {ActividadesAnexo8Request, Anexo8} from "../../../models/anexo8";
import {Proyectos} from "../../../models/proyectos";
import {Entidadbeneficiaria} from "../../../models/entidadbeneficiaria";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Anexo8Service} from "../../../services/anexo8.service";
import {ActivatedRoute} from "@angular/router";
import {Anexo3Service} from "../../../services/anexo3.service";
import {ProyectoService} from "../../../services/proyecto.service";
import Swal from "sweetalert2";
import Docxtemplater from "docxtemplater";

// @ts-ignore
import PizZip from "pizzip";
// @ts-ignore
import PizZipUtils from "pizzip/utils/index.js";
// @ts-ignore
import { saveAs } from "file-saver";
import {FechaService} from "../../../services/fecha.service";
import {Anexo61} from "../../../models/anexo61";
import {DatePipe} from "@angular/common";
import {MatSelectionListChange} from "@angular/material/list";
import {MatSelectChange} from "@angular/material/select";

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
  selector: 'app-registroactividadesestudiante',
  templateUrl: './registroactividadesestudiante.component.html',
  styleUrls: ['./registroactividadesestudiante.component.css']
})
export class RegistroactividadesestudianteComponent implements OnInit {
  issloading=true;
  Fechaenvio?: Date;
  isLinear = true;
  panelOpenState = true;
  isexist?: boolean;
  canBotton: boolean = false
  public sum=0;
  actualzar=false
  public cedula?:String;
  public nombre?:String;
  anexo3:Anexo3[]=[];
  proyectos:Proyectos[]=[];
  anexo8requeste:Anexo8=new Anexo8;
  proyecto:Proyectos=new Proyectos;
  edntidad:Entidadbeneficiaria=new Entidadbeneficiaria();
  ceduladir?: String;
  //secuenciasdepantallas
  firstFormGroup?: FormGroup;
  secondFormGroup?: FormGroup;
  fourFormGroup?: FormGroup;
  ////ARRAY
  rows: FormArray;
  itemForm?: FormGroup;
//ANEXO8
  constructor(private fechaService: FechaService,private anexo8Service:Anexo8Service,private activatedRoute: ActivatedRoute,private _formBuilder: FormBuilder,
              private anexo3Service:Anexo3Service, private proyectoService:ProyectoService) {
    //ArrayActividades
    this.secondFormGroup = this._formBuilder.group({
      items: [null, Validators.required],
      items_value: ['no', Validators.required]
    });
    this.rows = this._formBuilder.array([]);
  }

  ngAfterViewInit(): void {
    setTimeout(()=>{
    },1000)
  }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe( params => {
      let cedula = params['cedula']
      let nombre = params['nombres']
      this.nombre=nombre;
      this.cedula=cedula;
      this.anexo3Service.getanexo3(cedula).subscribe(datos=>{
        this.proyectoService.getProyectos().forEach(value => {
          this.proyectos=value.filter(value1 => value1.id==datos.filter(d=>d.estado=="AN")[datos.length-1].idProyectoPPP&&value1.estado==true)
        })
        this.issloading=false;
      })
      this.fechaService.getSysdate().subscribe(value => {
        this.Fechaenvio = value.fecha;
      })
    })
    //ArrayActividadesEst


    this.firstFormGroup = this._formBuilder.group({
      proyecto: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({});
    this.fourFormGroup = this._formBuilder.group({
      docx: ['', Validators.required],
    });
    //ArrayActividades
    this.secondFormGroup.get("items_value")?.setValue("yes");
    this.secondFormGroup.addControl('rows', this.rows);
  }


  //ArrayActividades
  onAddRow(actividades:ActividadesAnexo8Request) {
    this.sum = 0;
    this.rows.push(this.createItemFormGroup(actividades));
    this.rows.getRawValue().forEach(element => {
      this.sum+=element.numHoras;

      // console.log(this.sum)
    })
    //console.log(this.rows.getRawValue())
  }
  onRemoveRow(rowIndex:number){
    this.rows.removeAt(rowIndex)
    this.sum = 0;
    this.rows.getRawValue().forEach(element => {
      this.sum+=element.numHoras;
      //  console.log(this.sum)
    })
  }
  ///
  createItemFormGroup(actividades:ActividadesAnexo8Request): FormGroup {
    return this._formBuilder.group({
      id:actividades?.id,
      fecha:actividades?.fecha,
      descripcionActividad:actividades?.descripcionActividad,
      lugar:actividades?.lugar,
      numHoras:actividades?.numHoras,
    });
  }
  sumar(){
    this.sum = 0;
    this.rows.getRawValue().forEach(element => {
      this.sum+=element.numHoras;
      // console.log(this.sum)
      //console.log(this.proyecto)
    })
  }

  eliminarActividad(actividades:ActividadesAnexo8Request){
    console.log(this.anexo8requeste.id,actividades.id)
    this.anexo8Service.deteledActivadades(this.anexo8requeste.id,actividades.id).subscribe(data=>{
      Swal.fire({
        icon: 'success',
        title: 'ELIMINADO',
        text: 'Correctamente',
        confirmButtonColor: "#0c3255",
        background: "#fbc02d",
      })
      window.location.reload();
      this.actulizar();
    },err=>{
      Swal.fire({
        icon: 'warning',
        title: 'Al paracer hubo un problema',
        text: err.error.message,
        confirmButtonColor: "#0c3255",
        background: "#fbc02d",
      })
      window.location.reload();
    })
  }


  selectOpcion(event: MatSelectChange){
    this.proyectoService.getProyectobyid(event.value).subscribe(data=>{
      this.proyecto=data
      console.log( this.proyecto)
      this.anexo8Service.getEntidadById(data.entidadbeneficiaria).subscribe(da=>{
        this.edntidad=da;
      })
    })
    this.anexo8Service.getAnexo8byCedula(this.cedula+'').subscribe(datos=>{
      if(datos.length!=0){
        this.anexo8requeste=datos[0]
        if(datos[0].actividades?.length!=0){
          this.actualzar=true;
          datos[0].actividades?.forEach(element => {
            this.onAddRow(element)
          });
        }else {
          this.onAddRow(new ActividadesAnexo8Request())
        }
      }
    })

  }



  anexo8:Anexo8= new Anexo8;
  ontnerDatos():Anexo8{
    this.anexo8.cedulaEstudiante=this.cedula;
    this.anexo8.idProyectoPPP=this.proyecto.id;
    this.anexo8.nombreDirectorProyecto=this.proyecto.nombredirector;
    this.anexo8.nombreDocenteApoyo=(this.proyecto.docenteApoyoResponse!=undefined)?this.proyecto.docenteApoyoResponse[0].nombres:"";
    this.anexo8.nombreEntidadBeneficiaria=this.edntidad.nombre;
    this.anexo8.nombreEstudiante=this.nombre;
    this.anexo8.nombreProyecto=this.proyecto.nombre;
    this.anexo8.totalHoras=this.sum;
    this.anexo8.actividades=this.rows.getRawValue();
    this.anexo8.nombreAdminEB=this.edntidad.nombreAdministrador;
    this.anexo8Service.getDocentedirector(this.proyecto.id).subscribe(value => {
      this.ceduladir = value.cedula;
    })
    this.anexo8.cedulaDirector=this.ceduladir;
    return this.anexo8;
  }
  guardar(){
    this.anexo8=this.ontnerDatos();
    this.anexo8Service.saveAnexo8(this.ontnerDatos()).subscribe(datos=>{
      // console.log(">."+this.anexo8Service.saveAnexo8(this.ontnerDatos()))
      Swal.fire({
        icon: 'success',
        title: 'ACTIVIDAD REGISTRADA CORRECTAMENTE',
        text: 'Datos guadados correctamente',
        confirmButtonColor: "#0c3255",
        background: "#fbc02d",
      })
      window.location.reload();
    },err=>{
      Swal.fire({
        icon: 'warning',
        title: 'Al paracer hubo un problema',
        text: err.error.message,
        confirmButtonColor: "#0c3255",
        background: "#fbc02d",
      })
    })

  }

  subirDocumento8(file:FileList){
    if(file.length==0){
    }else{
      getBase64(file[0]).then(docx=>{
        // @ts-ignore
        //console.log(docx.length)
        // @ts-ignore
        if(docx.length>=10485760){
          this.anexo8.documento="";
          Swal.fire(
            'Fallo',
            'El documento excede el peso permitido',
            'warning'
          )
        }else{
          this.anexo8.documento=docx+"";
        }
      })
    }
  }

  actulizar(){
    // console.log(this.ontnerDatos())
    this.anexo8.id=this.anexo8requeste.id
    this.anexo8Service.updateActivadades(this.ontnerDatos()).subscribe(datos=>{
      // console.log(this.anexo8Service.updateActivadades(this.ontnerDatos()))
      Swal.fire({
        icon: 'success',
        title: 'ACTIVIDAD REGISTRADA',
        text: 'Datos guadados correctamente',
        confirmButtonColor: "#0c3255",
        background: "#fbc02d",
      })
      window.location.reload();
    },err=>{
      Swal.fire({
        icon: 'warning',
        title: 'Al paracer hubo un problema',
        text: err.error.message,
        confirmButtonColor: "#0c3255",
        background: "#fbc02d",
      })
    })
  }
  ggenerarDocumento8() {
    var anexo8:Anexo8=this.ontnerDatos();
    // console.log(anexo8)
    var pipe:DatePipe = new DatePipe('en-US')
    loadFile("https://raw.githubusercontent.com/Sbryan20/Sistema-PPProfesionales/main/src/assets/doc/anexo8.docx", function(
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
        nombre_proyecto:anexo8.nombreProyecto,
        entidad_beneficiaria:anexo8.nombreEntidadBeneficiaria,
        nombre_estudiante:anexo8.nombreEstudiante,
        identificiacion_est:anexo8.cedulaEstudiante,
        nombre_admin_entidad:anexo8.nombreAdminEB,
        docente_apoyo:anexo8.nombreDocenteApoyo,
        nombre_director:anexo8.nombreDirectorProyecto,
        tb:anexo8.actividades,
        totalHoras:anexo8.totalHoras
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
          // console.log("errorMessages", errorMessages);
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
      saveAs(out, "Anexo8.docx");
    });
  }

}
