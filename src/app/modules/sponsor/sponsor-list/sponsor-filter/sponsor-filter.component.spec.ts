import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SponsorFilterComponent } from './sponsor-filter.component';


describe('SponsorFilterComponent', () => {
  let component: SponsorFilterComponent;
  let fixture: ComponentFixture<SponsorFilterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SponsorFilterComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SponsorFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
