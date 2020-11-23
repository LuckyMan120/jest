import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatchInfoLeftComponent } from './match-info-left.component';


describe('MatchInfoLeftComponent', () => {
  let component: MatchInfoLeftComponent;
  let fixture: ComponentFixture<MatchInfoLeftComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MatchInfoLeftComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchInfoLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
