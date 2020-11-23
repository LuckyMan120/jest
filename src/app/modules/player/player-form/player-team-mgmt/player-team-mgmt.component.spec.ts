import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PlayerTeamMgmtComponent } from './player-team-mgmt.component';


describe('PlayerTeamMgmtComponent', () => {
  let component: PlayerTeamMgmtComponent;
  let fixture: ComponentFixture<PlayerTeamMgmtComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PlayerTeamMgmtComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerTeamMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
