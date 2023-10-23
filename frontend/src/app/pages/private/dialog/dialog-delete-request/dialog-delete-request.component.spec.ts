import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDeleteRequestComponent } from './dialog-delete-request.component';

describe('DialogDeleteRequestComponent', () => {
  let component: DialogDeleteRequestComponent;
  let fixture: ComponentFixture<DialogDeleteRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogDeleteRequestComponent]
    });
    fixture = TestBed.createComponent(DialogDeleteRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
