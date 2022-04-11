import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoinformedeculminacionComponent } from './nuevoinformedeculminacion.component';

describe('NuevoinformedeculminacionComponent', () => {
  let component: NuevoinformedeculminacionComponent;
  let fixture: ComponentFixture<NuevoinformedeculminacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NuevoinformedeculminacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevoinformedeculminacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
