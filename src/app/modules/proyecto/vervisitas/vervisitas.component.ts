import { Component, OnInit } from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {FechaService} from "../../../services/fecha.service";
import {CarrerasService} from "../../../services/carreras.service";
import {ActivatedRoute, Router} from "@angular/router";
import {EntidadbeneficiarioService} from "../../../services/entidadbeneficiario.service";
import {Anexo5Service} from "../../../services/anexo5.service";
import {Anexo1Service} from "../../../services/anexo1.service";
import {ProyectoService} from "../../../services/proyecto.service";
import {Anexo2Service} from "../../../services/anexo2.service";
import {ResponsablepppService} from "../../../services/responsableppp.service";
import {Anexo13Service} from "../../../services/anexo13.service";
import {Anexo13} from "../../../models/anexo13";
import Docxtemplater from "docxtemplater";
// @ts-ignore
import PizZip from "pizzip";
// @ts-ignore
import PizZipUtils from "pizzip/utils/index.js";
// @ts-ignore
import { saveAs } from "file-saver";
import {Anexo1} from "../../../models/anexo1";
import {Proyectos} from "../../../models/proyectos";
import {DatePipe} from "@angular/common";

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
  selector: 'app-vervisitas',
  templateUrl: './vervisitas.component.html',
  styleUrls: ['./vervisitas.component.css']
})
export class VervisitasComponent implements OnInit {

  panelOpenState = false;

  anexo13:Anexo13 = new Anexo13();
  // @ts-ignore
  date1:Date;
  // @ts-ignore
  date2:Date;
  proyecto:Proyectos = new Proyectos();
  constructor(private _formBuilder: FormBuilder,
              private fechaService:FechaService,private carrerasService:CarrerasService,
              private activatedRoute: ActivatedRoute,
              private entidadbeneficiarioService:EntidadbeneficiarioService,
              private anexo5Service:Anexo5Service,
              private anexo1Service:Anexo1Service,
              private router:Router,
              private proyectoService:ProyectoService,
              private anexo2Service:Anexo2Service,
              private responsablepppService:ResponsablepppService,
              private anexo13Service:Anexo13Service) { }

  ngOnInit(): void {
    var date:String[];
    this.activatedRoute.params.subscribe(params => {
      let cedula = params['cedula']
      this.anexo1Service.getAnexo1byCedula(cedula).subscribe(value => {
        this.anexo13Service.getAnexo13by(Number(value[0].idProyectoPPP)).subscribe(value1 => {
          this.anexo13=value1[0]
          this.proyectoService.getProyectobyid(Number(value[0].idProyectoPPP)).subscribe(value2 => {
            this.proyecto=value2;
          })
          console.log(value1[0])
          // @ts-ignore
          date=value1[0].periodoAcademicon.split(" ");
          this.date1= new Date(date[0]+"")
          this.date2= new Date(date[1]+"")
        })
      })
    })
  }

  generate(anexo13:Anexo13,proyecto:Proyectos,date1:Date,date2:Date) {
    console.log(anexo13)
    var pipe:DatePipe = new DatePipe('en-US')
    loadFile("https://raw.githubusercontent.com/Jose-22-ced/VinculacionWeb/master/src/assets/docs/anexo13.docx", function(
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
        direc_docenProyecto:anexo13.nombreDirectorDocenteApoyo,
        nombreProyecto:proyecto.nombre,
        representanteEntidad:anexo13.representanteLegal,
        peridoAcademico:pipe.transform(date1,'MMMM d, y') +" "+ pipe.transform(date2,'MMMM d, y'),
        entidadBeneficiaria:anexo13.empresa,
        ciclo:anexo13.ciclo,
        estudiante:anexo13.estudiantesVisitas,
        registro:anexo13.informes,
        observacionGeneral:anexo13.observaciones
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
      saveAs(out, "Anexo13 "+anexo13.periodoAcademicon+" "+anexo13.ciclo+".docx");
    });
  }

}
