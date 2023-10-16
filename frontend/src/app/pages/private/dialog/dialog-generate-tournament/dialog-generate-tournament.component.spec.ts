import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogGenerateTournamentComponent } from './dialog-generate-tournament.component';

describe('DialogGenerateTournamentComponent', () => {
  let component: DialogGenerateTournamentComponent;
  let fixture: ComponentFixture<DialogGenerateTournamentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogGenerateTournamentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogGenerateTournamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
