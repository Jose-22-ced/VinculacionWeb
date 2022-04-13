import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Anexo11directorComponent } from './anexo11director.component';

describe('Anexo11directorComponent', () => {
  let component: Anexo11directorComponent;
  let fixture: ComponentFixture<Anexo11directorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Anexo11directorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Anexo11directorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
