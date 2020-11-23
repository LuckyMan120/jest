import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PlayerTeamMgmtListComponent } from './player-team-mgmt-list.component';


describe('PlayerTeamMgmtListComponent', () => {
  let component: PlayerTeamMgmtListComponent;
  let fixture: ComponentFixture<PlayerTeamMgmtListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PlayerTeamMgmtListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerTeamMgmtListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
