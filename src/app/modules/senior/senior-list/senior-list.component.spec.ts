import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SeniorListComponent } from './senior-list.component';


describe('SeniorListComponent', () => {
  let component: SeniorListComponent;
  let fixture: ComponentFixture<SeniorListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SeniorListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeniorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
