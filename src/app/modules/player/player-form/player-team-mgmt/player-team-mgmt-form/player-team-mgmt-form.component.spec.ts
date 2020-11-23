import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PlayerTeamMgmtFormComponent } from './player-team-mgmt-form.component';


describe('PlayerTeamMgmtFormComponent', () => {
  let component: PlayerTeamMgmtFormComponent;
  let fixture: ComponentFixture<PlayerTeamMgmtFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PlayerTeamMgmtFormComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerTeamMgmtFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
