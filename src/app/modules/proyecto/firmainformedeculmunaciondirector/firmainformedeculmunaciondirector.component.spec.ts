import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirmainformedeculmunaciondirectorComponent } from './firmainformedeculmunaciondirector.component';

describe('FirmainformedeculmunaciondirectorComponent', () => {
  let component: FirmainformedeculmunaciondirectorComponent;
  let fixture: ComponentFixture<FirmainformedeculmunaciondirectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirmainformedeculmunaciondirectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FirmainformedeculmunaciondirectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
