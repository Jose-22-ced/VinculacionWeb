import { Component, OnInit } from '@angular/core';
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
import {Anexo6} from "../../../models/anexo6";
import {DatePipe} from "@angular/common";
import Swal from "sweetalert2";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {Anexo4Service} from "../../../services/anexo4.service";
import {ProyectoService} from "../../../services/proyecto.service";
import {Anexo10Service} from "../../../services/anexo10.service";
import {Anexo8Service} from "../../../services/anexo8.service";
import {Anexo5Service} from "../../../services/anexo5.service";
import {Anexo2Service} from "../../../services/anexo2.service";
import {FechaService} from "../../../services/fecha.service";
import {Anexo4} from "../../../models/anexo4";
import {Proyectos} from "../../../models/proyectos";
import {actividadesAnexo10s, Anexo10} from "../../../models/anexo10";


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
  selector: 'app-editarinformedeculminacion',
  templateUrl: './editarinformedeculminacion.component.html',
  styleUrls: ['./editarinformedeculminacion.component.css']
})
export class EditarinformedeculminacionComponent implements OnInit {

  isLinear = true;
  issloading=true;
  // @ts-ignore
  firstFormGroup: FormGroup;
  // @ts-ignore
  secondFormGroup: FormGroup;
  thirdFormGroup?: FormGroup;
  fourFormGroup?: FormGroup;
  anexo4:Anexo4[]=[];
  proyecto:Proyectos = new Proyectos();
  cedula?:String;
  anexo10:Anexo10 = new Anexo10();
  //ArrayActividades
  rows: FormArray;

  constructor(private _formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private anexo4Service:Anexo4Service,
              private proyectoService:ProyectoService,
              private anexo10Service:Anexo10Service,
              private anexo8Service:Anexo8Service,private anexo5Service:Anexo5Service, private anexo2Service:Anexo2Service,  private router: Router,private fb: FormBuilder,private fechaService:FechaService) {
    //ArrayActividades
    this.rows = this._formBuilder.array([]);
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( params => {
      let id = params['id']
      this.anexo10Service.getAnexo10All().subscribe(value => {
        this.anexo10=value.filter(value1 => value1.id==id)[0]
        this.anexo10.Direccion=(value.filter(value1 => value1.id==id)[0].direccion)
        this.anexo10.actividadesAnexo10s?.forEach(value1 => this.onAddRow(value1))
        this.issloading=false;
      })
    })
    this.firstFormGroup = this._formBuilder.group({
    });
    this.secondFormGroup = this._formBuilder.group({
    });
    this.thirdFormGroup = this._formBuilder.group({
      descrip: ['', Validators.required],
      conclu: ['', Validators.required],
      recome: ['', Validators.required],
      tele: ['', [Validators.required,Validators.pattern("[0-9]+"),Validators.maxLength(10)]],
    });
    this.fourFormGroup = this._formBuilder.group({
      docx: ['', Validators.required],
    });

    // @ts-ignore
    this.secondFormGroup.get("items_value")?.setValue("yes");
    // @ts-ignore
    this.secondFormGroup.addControl('rows', this.rows);
  }

  //ArrayActividades
  onAddRow(actividad:actividadesAnexo10s) {
    this.rows.push(this.createItemFormGroup(actividad));
  }
  onRemoveRow(rowIndex:number){
    this.rows.removeAt(rowIndex);
  }
  createItemFormGroup(actividad:actividadesAnexo10s): FormGroup {
    return this._formBuilder.group({
      id:[actividad.id, Validators.required],
      actividadesGenerales: [actividad.actividadesGenerales, Validators.required],
      actividadesEspecificas: [actividad.actividadesGenerales, Validators.required],
      productoGenerado: [actividad.productoGenerado, Validators.required],
    });
  }



  obtenarDatos():Anexo10{
    this.anexo10.num_proceso=1;
    this.anexo10.actividadesAnexo10s=this.rows.getRawValue();
    return this.anexo10;
  }

  actualizarInforme(){
    this.anexo10Service.updateAnexo10(this.obtenarDatos()).subscribe(value => {
      Swal.fire({
        title: 'Exito',
        text: 'Informe actualizado con exito.',
        icon: 'success',
        iconColor :'#17550c',
        color: "#0c3255",
        confirmButtonColor:"#0c3255",
        background: "#fbc02d",
      })
      this.router.navigate(['/panelusuario/proyectovinculacion/verinformedeculminación',this.obtenarDatos().cedulaEstudiante]);
    },error => {
      Swal.fire({
        title: 'Error',
        text: 'El informe no se actualizó.',
        icon: 'warning',
        color: "#0c3255",
        confirmButtonColor:"#0c3255",
        background: "#fbc02d",
      })
    })
  }

  generarDocumento() {
    console.log(this.obtenarDatos())
    this.obtenarDatos();
    var anexo10:Anexo10=this.obtenarDatos();
    var pipe:DatePipe = new DatePipe('en-US')
    loadFile("https://raw.githubusercontent.com/Sbryan20/Sistema-PPProfesionales/main/src/assets/doc/anexo10.docx", function(
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
        fecha:pipe.transform(anexo10.fecha,'dd/MM/yyyy'),
        nombreProyecto:anexo10.nombreProyecto,
        directorProyecto:anexo10.nombreDirector,
        nombreEmpresa:anexo10.nombreEmpresa,
        ubicacionEmpresa:anexo10.Direccion,
        nomDocenteApoyo:anexo10.nombreDocenteapoyo,
        cedulaDocA:anexo10.cedulaDocenteApoyo,
        EmailDocenteApoyo:anexo10.correo_DocenteApoyo,
        nombreEstudiante:anexo10.nombreEstudiante,
        cedulaEstudiante:anexo10.cedulaEstudiante,
        ultimoCicloAprobado:anexo10.cicloAprovado,
        emailEstudiante:anexo10.correoEstudiante,
        nombreResponsableEntidadBeneficiaria:anexo10.nombreAdministrador,
        cedulaResponsableEntidadBeneficiaria:anexo10.cedulaAdministrador,
        EmailResponsableEntidadBeneficiaria:anexo10.correoAdministrador,
        horasRealizadas:anexo10.horasRealizadas,
        fechaInicio:anexo10.fechaFin,
        fechaFinalizacion:anexo10.fechaInicio,
        descripcionEmpresa:anexo10.descripcionEmpresa,
        recomendaciones:anexo10.recomendaciones,
        conclusiones:anexo10.conclusiones,
        tb:anexo10.actividadesAnexo10s
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
      saveAs(out, "Anexo10.docx");
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
          this.anexo10.documento="";
          Swal.fire(
            'Fallo',
            'El docemento es demaciado pesado',
            'warning'
          )
        }else{
          this.anexo10.documento=docx+"";
        }
      })
    }
  }

}
