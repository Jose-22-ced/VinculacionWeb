import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListainformeseguimientoComponent } from './listainformeseguimiento.component';

describe('ListainformeseguimientoComponent', () => {
  let component: ListainformeseguimientoComponent;
  let fixture: ComponentFixture<ListainformeseguimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListainformeseguimientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListainformeseguimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
