import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormControl} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";
import {Anexo61} from "../../../models/anexo61";
import {FechaService} from "../../../services/fecha.service";
import {CarrerasService} from "../../../services/carreras.service";
import {ActivatedRoute, Router} from "@angular/router";
import {EntidadbeneficiarioService} from "../../../services/entidadbeneficiario.service";
import {Anexo61Service} from "../../../services/anexo61.service";
import {DateAdapter} from "@angular/material/core";
import Swal from "sweetalert2";
// @ts-ignore
import { saveAs } from "file-saver";
import {Anexo11Service} from "../../../services/anexo11.service";
import {Anexo11} from "../../../models/anexo11";

@Component({
  selector: 'app-veranexos11',
  templateUrl: './veranexos11.component.html',
  styleUrls: ['./veranexos11.component.css']
})
export class Veranexos11Component implements OnInit {

  issloading = true;
  isexist?: boolean
  panelOpenState = false;
  myControl = new UntypedFormControl();
  filteredOptions?: Observable<Anexo11[]>;
  cedula?: String;
  nombre?: String;
  anexos11: Anexo11[] = [];

  constructor(private fechaService: FechaService, private carrerasService: CarrerasService,
              private activatedRoute: ActivatedRoute, private _formBuilder: UntypedFormBuilder,
              private anexo11Service: Anexo11Service,
              private _adapter: DateAdapter<any>,
              private router: Router) {
    this._adapter.setLocale('es-ec');
  }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(params => {
      let cedula = params['cedula']
      let nombre = params['nombres']
      this.nombre = nombre;
      // console.log(cedula)
      this.anexo11Service.getAll().subscribe(anex11 => {
        this.anexos11 = anex11.filter(value => value.nombreApoyo == nombre);

        // console.log(nombre)
        this.isexist = anex11.length != 0;
        this.issloading = false;
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(values => this.filter(values)),
        );
        //console.log(this.anexos11)
      })
    })

  }

  ngAfterViewInit(): void {
    setTimeout(() => {
    }, 1000)
  }

  filter(value: any): Anexo11[] {
    const filterValue = value.toLowerCase();
    return this.anexos11.filter(option => option.cedulaEstudiante?.toLowerCase().includes(filterValue)
      || option.carrera?.toLocaleLowerCase().includes(filterValue)
      || option.nombresEstudiante?.toLocaleLowerCase().includes(filterValue)
    );

  }


  eliminarAnexo11(anexo61: Anexo61) {
    this.issloading = true;
    this.anexo11Service.deleteAnexo11(anexo61.id).subscribe(value => {
      Swal.fire({
        title: 'Exito',
        text: 'Anexo 11 eliminado',
        icon: 'success',
        iconColor: '#17550c',
        color: "#0c3255",
        confirmButtonColor: "#0c3255",
        background: "#fbc02d",
      })
      window.location.reload();
    }, error => {
      Swal.fire({
        title: 'Error',
        text: 'Anexo no se elimino ' + error.error.messages,
        icon: 'error',
        color: "#0c3255",
        confirmButtonColor: "#0c3255",
        background: "#fbc02d",
      })
      window.location.reload();
    })
    this.issloading = false;
  }

  convertFile(docum: any) {
    //console.log(docum)
    //Usage example:
    var file = this.dataURLtoFile(docum, 'Anexo11.pdf');
    //console.log(file);
    saveAs(file, 'Anexo11.pdf');
  }

  dataURLtoFile(dataurl: any, filename: any) {
    let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type: mime});
  }
}
