import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Editaranexo11directorComponent } from './editaranexo11director.component';

describe('Editaranexo11directorComponent', () => {
  let component: Editaranexo11directorComponent;
  let fixture: ComponentFixture<Editaranexo11directorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Editaranexo11directorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Editaranexo11directorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
