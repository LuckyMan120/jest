import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { KolkovEditorComponent } from './kolkov-editor.component';


describe('KolkovEditorComponent', () => {
  let component: KolkovEditorComponent;
  let fixture: ComponentFixture<KolkovEditorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [KolkovEditorComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KolkovEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
