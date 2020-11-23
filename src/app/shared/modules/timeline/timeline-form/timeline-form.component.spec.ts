import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TimelineFormComponent } from './timeline-form.component';


describe('TimelineFormComponent', () => {
  let component: TimelineFormComponent;
  let fixture: ComponentFixture<TimelineFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TimelineFormComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
