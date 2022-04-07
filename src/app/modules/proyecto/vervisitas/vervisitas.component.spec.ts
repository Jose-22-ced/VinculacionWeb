import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VervisitasComponent } from './vervisitas.component';

describe('VervisitasComponent', () => {
  let component: VervisitasComponent;
  let fixture: ComponentFixture<VervisitasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VervisitasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VervisitasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
