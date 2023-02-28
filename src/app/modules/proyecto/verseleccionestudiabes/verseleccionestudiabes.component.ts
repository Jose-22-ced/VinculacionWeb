import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {FechaService} from "../../../services/fecha.service";
import {ProyectoService} from "../../../services/proyecto.service";
import {ResponsablepppService} from "../../../services/responsableppp.service";
import {EntidadbeneficiarioService} from "../../../services/entidadbeneficiario.service";
import {DateAdapter} from "@angular/material/core";
import {Anexo2Service} from "../../../services/anexo2.service";
import {Anexo3Service} from "../../../services/anexo3.service";
import {Anexo4Service} from "../../../services/anexo4.service";
import {CordinadorvinculacionService} from "../../../services/cordinadorvinculacion.service";
import {InformedeaceptacionestdiatesService} from "../../../services/informedeaceptacionestdiates.service";

// @ts-ignore
import { saveAs } from "file-saver";
import {Informeaceptacion} from "../../../models/informeaceptacion";

@Component({
  selector: 'app-verseleccionestudiabes',
  templateUrl: './verseleccionestudiabes.component.html',
  styleUrls: ['./verseleccionestudiabes.component.css']
})
export class VerseleccionestudiabesComponent implements OnInit {

  issloading=true;
  informeAceotacion:Informeaceptacion[] = [];
  constructor(private _formBuilder: UntypedFormBuilder,
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

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( params => {
      let nombre = params['nombres']
      this.informedeaceptacionestdiatesService.getAll().forEach(value => {
        this.informeAceotacion=value.filter(value1 => value1.nombreElaborado==nombre)
        this.issloading=false;
      })
    })

  }

  convertFile(docum:any) {
    // console.log(docum)
    //Usage example:
    var file = this.dataURLtoFile(docum, 'Anexo13.pdf');
    // console.log(file);
    saveAs(file, 'Anexo2.pdf');
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
