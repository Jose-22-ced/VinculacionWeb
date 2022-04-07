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

@Component({
  selector: 'app-vervisitas',
  templateUrl: './vervisitas.component.html',
  styleUrls: ['./vervisitas.component.css']
})
export class VervisitasComponent implements OnInit {

  panelOpenState = false;

  anexo13:Anexo13 = new Anexo13();
  date1?:Date;
  date2?:Date;
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
          console.log(value1[0])
          // @ts-ignore
          date=value1[0].periodoAcademicon.split(" ");
          this.date1= new Date(date[0]+"")
          this.date2= new Date(date[1]+"")
        })
      })
    })
  }

}
