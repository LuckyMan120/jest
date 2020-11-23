import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PlayerTeamListComponent } from './player-team-list.component';


describe('PlayerTeamListComponent', () => {
  let component: PlayerTeamListComponent;
  let fixture: ComponentFixture<PlayerTeamListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PlayerTeamListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerTeamListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
