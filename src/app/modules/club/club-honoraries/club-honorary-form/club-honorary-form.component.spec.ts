import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ClubHonoraryFormComponent } from './club-honorary-form.component';


describe('ClubHonoraryFormComponent', () => {
  let component: ClubHonoraryFormComponent;
  let fixture: ComponentFixture<ClubHonoraryFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ClubHonoraryFormComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubHonoraryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
