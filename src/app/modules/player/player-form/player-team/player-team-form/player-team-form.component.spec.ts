import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PlayerTeamFormComponent } from './player-team-form.component';


describe('PlayerTeamFormComponent', () => {
  let component: PlayerTeamFormComponent;
  let fixture: ComponentFixture<PlayerTeamFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PlayerTeamFormComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerTeamFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
