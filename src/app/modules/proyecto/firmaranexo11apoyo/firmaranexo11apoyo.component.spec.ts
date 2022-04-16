import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Firmaranexo11apoyoComponent } from './firmaranexo11apoyo.component';

describe('Firmaranexo11apoyoComponent', () => {
  let component: Firmaranexo11apoyoComponent;
  let fixture: ComponentFixture<Firmaranexo11apoyoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Firmaranexo11apoyoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Firmaranexo11apoyoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
