import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListainformefinalComponent } from './listainformefinal.component';

describe('ListainformefinalComponent', () => {
  let component: ListainformefinalComponent;
  let fixture: ComponentFixture<ListainformefinalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListainformefinalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListainformefinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
