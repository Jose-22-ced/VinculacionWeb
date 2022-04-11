import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarinformedeculminacionComponent } from './editarinformedeculminacion.component';

describe('EditarinformedeculminacionComponent', () => {
  let component: EditarinformedeculminacionComponent;
  let fixture: ComponentFixture<EditarinformedeculminacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarinformedeculminacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarinformedeculminacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
