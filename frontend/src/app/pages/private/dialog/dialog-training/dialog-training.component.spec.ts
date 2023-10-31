import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogTrainingComponent } from './dialog-training.component';

describe('DialogTrainingComponent', () => {
  let component: DialogTrainingComponent;
  let fixture: ComponentFixture<DialogTrainingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogTrainingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
