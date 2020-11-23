import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CreationPublicationInfoComponent } from './creation-publication-info.component';


describe('CreationPublicationInfoComponent', () => {
  let component: CreationPublicationInfoComponent;
  let fixture: ComponentFixture<CreationPublicationInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CreationPublicationInfoComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationPublicationInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
