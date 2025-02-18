import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TeamDashboardComponent } from './team-dashboard.component';


describe('TeamDashboardComponent', () => {
  let component: TeamDashboardComponent;
  let fixture: ComponentFixture<TeamDashboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TeamDashboardComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
