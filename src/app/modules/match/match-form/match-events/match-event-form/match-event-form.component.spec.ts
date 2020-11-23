import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatchEventFormComponent } from './match-event-form.component';


describe('MatchEventFormComponent', () => {
  let component: MatchEventFormComponent;
  let fixture: ComponentFixture<MatchEventFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MatchEventFormComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchEventFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
