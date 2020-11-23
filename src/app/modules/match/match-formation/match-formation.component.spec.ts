import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatchFormationComponent } from './match-formation.component';


describe('MatchFormationComponent', () => {
  let component: MatchFormationComponent;
  let fixture: ComponentFixture<MatchFormationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MatchFormationComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchFormationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
