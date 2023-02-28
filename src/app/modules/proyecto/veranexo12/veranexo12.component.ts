import { Component, OnInit } from '@angular/core';
import {UntypedFormControl} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {Anexo12Service} from "../../../services/anexo12.service";
import {Anexo12} from "../../../models/anexo12";
import {Anexo9} from "../../../models/anexo9";
import Swal from "sweetalert2";
// @ts-ignore
import { saveAs } from "file-saver";
@Component({
  selector: 'app-veranexo12',
  templateUrl: './veranexo12.component.html',
  styleUrls: ['./veranexo12.component.css']
})
export class Veranexo12Component implements OnInit {
  issloading = true;
  isexist?: boolean
  panelOpenState = false;
  myControl = new UntypedFormControl();
  filteredOptions?: Observable<Anexo12[]>;
  cedula?: String;
  nombres?: String;
  anexos12: Anexo12[] = [];
  constructor(private activatedRoute: ActivatedRoute,
              private anexos12Service: Anexo12Service) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      let cedula = params['cedula']
      let nombres = params['nombres']
      this.nombres = nombres;
      this.anexos12Service.getAnexo12_porapoyo(cedula).subscribe(anex12=>{
        this.anexos12=anex12;
        // console.log(nombres)
        this.isexist=anex12.length!=0;
        this.issloading = false;
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(values => this.filter(values)),
        );
        //  console.log(this.anexos12)
      })
    })
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
    }, 1000)
  }

  filter(value:any): Anexo9[]{
    const filterValue = value.toLowerCase();
    // @ts-ignore
    return this.anexos12.filter(option => option.nombreProyecto?.toLowerCase().includes(filterValue)
      || option.entidadBeneficiaria?.toLocaleLowerCase().includes(filterValue)

    );
  }

  eliminarAnexo12(anexo12: Anexo12){
    this.issloading=true;

    this.anexos12Service.deleteAnexo12(anexo12.id).subscribe(value => {
      Swal.fire({
        title: 'Exito',
        text: 'Anexo 12 eliminado',
        icon: 'success',
        iconColor: '#17550c',
        color: "#0c3255",
        confirmButtonColor: "#0c3255",
        background: "#fbc02d",
      })
      window.location.reload();
      this.issloading = false;
    }, error => {
      Swal.fire({
        title: 'Error',
        text: 'Anexo no se elimino ' + error.error.messages,
        icon: 'error',
        color: "#0c3255",
        confirmButtonColor: "#0c3255",
        background: "#fbc02d",
      })
      this.issloading = false;
    })
  }

  convertFile(docum: any) {
    // console.log(docum)
    //Usage example:
    var file = this.dataURLtoFile(docum, 'Anexo12.pdf');
    // console.log(file);
    saveAs(file, 'Anexo12.pdf');
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
