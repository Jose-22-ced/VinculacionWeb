import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Editaranexo11apoyoComponent } from './editaranexo11apoyo.component';

describe('Editaranexo11apoyoComponent', () => {
  let component: Editaranexo11apoyoComponent;
  let fixture: ComponentFixture<Editaranexo11apoyoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Editaranexo11apoyoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Editaranexo11apoyoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
