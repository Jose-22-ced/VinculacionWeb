import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeseguimientoComponent } from './informeseguimiento.component';

describe('InformeseguimientoComponent', () => {
  let component: InformeseguimientoComponent;
  let fixture: ComponentFixture<InformeseguimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformeseguimientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformeseguimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
