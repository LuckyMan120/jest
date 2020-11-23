import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MissingMatchResultsComponent } from './missing-match-results.component';


describe('MissingMatchResultsComponent', () => {
  let component: MissingMatchResultsComponent;
  let fixture: ComponentFixture<MissingMatchResultsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MissingMatchResultsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissingMatchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
