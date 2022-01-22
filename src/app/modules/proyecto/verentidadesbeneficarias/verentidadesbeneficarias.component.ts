import { Component, OnInit } from '@angular/core';
import {FechaService} from "../../../services/fecha.service";
import {ActivatedRoute} from "@angular/router";
import {FormBuilder, FormControl} from "@angular/forms";
import {EntidadbeneficiarioService} from "../../../services/entidadbeneficiario.service";
import {Entidadbeneficiaria} from "../../../models/entidadbeneficiaria";
import {map, Observable, startWith} from "rxjs";
import {CordinadorVinculacion} from "../../../models/cordinadorvinculacion";

@Component({
  selector: 'app-verentidadesbeneficarias',
  templateUrl: './verentidadesbeneficarias.component.html',
  styleUrls: ['./verentidadesbeneficarias.component.css']
})
export class VerentidadesbeneficariasComponent implements OnInit {
  panelOpenState = false;
  entidad:Entidadbeneficiaria[]=[];
  myControl = new FormControl();
  filteredOptions?: Observable<Entidadbeneficiaria[]>;

  constructor(private fechaService:FechaService,private activatedRoute: ActivatedRoute,private _formBuilder: FormBuilder,private entidadbeneficiarioService:EntidadbeneficiarioService) { }

  ngOnInit(): void {
    this.entidadbeneficiarioService.getsaveEntidadBeneficiaria().subscribe(value => {
      this.entidad=value;
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(values=>this.filter(values)),
      );
    })

  }
  filter(value: any): Entidadbeneficiaria[] {
    const filterValue = value.toLowerCase();
    return this.entidad.filter(option => option.nombre?.toLowerCase().includes(filterValue)
      ||option.cedulaAdministrador?.toLocaleLowerCase().includes(filterValue)
      ||option.celularRepresentante?.toLocaleLowerCase().includes(filterValue)
      ||option.nombreAdministrador?.toLocaleLowerCase().includes(filterValue)
      ||option.representante?.toLocaleLowerCase().includes(filterValue)
    );
  }

}
