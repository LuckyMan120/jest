import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PlayerTeamComponent } from './player-team.component';


describe('PlayerTeamComponent', () => {
  let component: PlayerTeamComponent;
  let fixture: ComponentFixture<PlayerTeamComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PlayerTeamComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
