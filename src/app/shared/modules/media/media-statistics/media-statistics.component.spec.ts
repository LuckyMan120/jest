import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MediaStatisticsComponent } from './media-statistics.component';


describe('MediaStatisticsComponent', () => {
  let component: MediaStatisticsComponent;
  let fixture: ComponentFixture<MediaStatisticsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MediaStatisticsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
