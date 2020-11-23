import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatchDashboardComponent } from './match-dashboard.component';


describe('MatchDashboardComponent', () => {
  let component: MatchDashboardComponent;
  let fixture: ComponentFixture<MatchDashboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MatchDashboardComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
