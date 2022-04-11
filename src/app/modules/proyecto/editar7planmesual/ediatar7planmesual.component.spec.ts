import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ediatar7planmesualComponent } from './ediatar7planmesual.component';

describe('Ediatar7planmesualComponent', () => {
  let component: Ediatar7planmesualComponent;
  let fixture: ComponentFixture<Ediatar7planmesualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ediatar7planmesualComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Ediatar7planmesualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
