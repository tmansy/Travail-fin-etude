import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNewStaffComponent } from './dialog-new-staff.component';

describe('DialogNewStaffComponent', () => {
  let component: DialogNewStaffComponent;
  let fixture: ComponentFixture<DialogNewStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogNewStaffComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogNewStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
