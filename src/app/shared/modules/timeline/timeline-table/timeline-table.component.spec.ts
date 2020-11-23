import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TimelineTableComponent } from './timeline-table.component';


describe('TimelineTableComponent', () => {
  let component: TimelineTableComponent;
  let fixture: ComponentFixture<TimelineTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TimelineTableComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
