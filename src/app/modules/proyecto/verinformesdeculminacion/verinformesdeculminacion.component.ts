import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl} from "@angular/forms";
import {Observable} from "rxjs";
import {Proyectos} from "../../../models/proyectos";
import {ActivatedRoute, Router} from "@angular/router";
import {Anexo4Service} from "../../../services/anexo4.service";
import {ProyectoService} from "../../../services/proyecto.service";
import {Anexo10Service} from "../../../services/anexo10.service";
import {Anexo8Service} from "../../../services/anexo8.service";
import {Anexo5Service} from "../../../services/anexo5.service";
import {Anexo2Service} from "../../../services/anexo2.service";
import {FechaService} from "../../../services/fecha.service";
import {Anexo10} from "../../../models/anexo10";
// @ts-ignore
import { saveAs } from "file-saver";

@Component({
  selector: 'app-verinformesdeculminacion',
  templateUrl: './verinformesdeculminacion.component.html',
  styleUrls: ['./verinformesdeculminacion.component.css']
})
export class VerinformesdeculminacionComponent implements OnInit {


  issloading=true;
  isexist?:boolean
  myControl = new FormControl();
  filteredOptions?: Observable<Proyectos[]>;
  date?:Date;
  anexo10:Anexo10[]=[];

  constructor(private _formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private anexo4Service:Anexo4Service,
              private proyectoService:ProyectoService,
              private anexo10Service:Anexo10Service,
              private anexo8Service:Anexo8Service,private anexo5Service:Anexo5Service, private anexo2Service:Anexo2Service,  private router: Router,private fb: FormBuilder,private fechaService:FechaService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( params => {
      let cedula = params['cedula']
      this.anexo10Service.getAnexo10All().subscribe(value => {
        this.isexist=value.filter(value1 => value1.cedulaEstudiante==cedula).length!=0;
        this.anexo10=value.filter(value1 => value1.cedulaEstudiante==cedula);
        this.fechaService.getSysdate().subscribe(value1 => this.date=value1.fecha)
        this.issloading=false;
      })
      this.proyectoService.getProyectos().subscribe(value => {
        //console.log(value)
      })
    })
  }

  convertFile(docum:any) {
    // console.log(docum)
    //Usage example:
    var file = this.dataURLtoFile(docum, 'Anexo10.pdf');
    //console.log(file);
    saveAs(file, 'Anexo10.pdf');
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
