import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { delay, pipe, switchMap, tap } from 'rxjs';
import { PaisSmall } from '../../interfaces/paises.interface';
import { PaisesService } from '../../services/paises.service';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    fronteras: ['', Validators.required]
  })

  regiones: string[] = []
  paises: PaisSmall[] = []
  //fronteras: string[] = []
  fronteras: PaisSmall[] = []

  cargando: boolean = false

  constructor(private fb: FormBuilder,
    private paisesService: PaisesService) { }

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones

    // this.miFormulario.get('region')?.valueChanges
    //   .subscribe(region => {
    //     console.log(region);

    //     this.paisesService.getPaisesPorRegion(region)
    //       .subscribe(paises => {
    //         this.paises = paises
    //       })

    //   })
    this.miFormulario.get('region')?.valueChanges
      .pipe(
        //delay(2000),
        tap((_) => {
          this.miFormulario.get('pais')?.reset('');
          this.cargando = true
        }),
        switchMap(region => this.paisesService.getPaisesPorRegion(region))
      )
      .subscribe(paises => {
        this.paises = paises
        this.cargando = false
      })

    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap((_) => {
          this.cargando = true
          this.fronteras = []
          this.miFormulario.get('frontera')?.reset('')
        }),
        switchMap(codigo => this.paisesService.getPaisPorCodigo(codigo)),
        switchMap(pais => this.paisesService.getPaisesPorCodigos(pais || []))
      )
      .subscribe(paises => {
        this.fronteras = paises
        this.cargando = false

      })

  }
  guardar() {

  }
}
