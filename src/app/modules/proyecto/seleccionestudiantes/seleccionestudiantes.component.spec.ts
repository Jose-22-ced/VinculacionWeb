import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionestudiantesComponent } from './seleccionestudiantes.component';

describe('SeleccionestudiantesComponent', () => {
  let component: SeleccionestudiantesComponent;
  let fixture: ComponentFixture<SeleccionestudiantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeleccionestudiantesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeleccionestudiantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
