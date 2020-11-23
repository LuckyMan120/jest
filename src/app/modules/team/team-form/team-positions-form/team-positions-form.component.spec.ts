import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TeamPositionsFormComponent } from './team-positions-form.component';


describe('TeamPositionsFormComponent', () => {
  let component: TeamPositionsFormComponent;
  let fixture: ComponentFixture<TeamPositionsFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TeamPositionsFormComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamPositionsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
