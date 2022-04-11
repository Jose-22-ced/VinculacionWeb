import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirmarplandeaprendizajeComponent } from './firmarplandeaprendizaje.component';

describe('FirmarplandeaprendizajeComponent', () => {
  let component: FirmarplandeaprendizajeComponent;
  let fixture: ComponentFixture<FirmarplandeaprendizajeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirmarplandeaprendizajeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FirmarplandeaprendizajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
