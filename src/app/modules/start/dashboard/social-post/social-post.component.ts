import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { StartService } from './../../start.service';

@Component({

  selector: 'app-social-post',
  templateUrl: './social-post.component.html',
  styleUrls: ['./social-post.component.scss']
})
export class SocialPostComponent implements OnInit, OnDestroy {

  @Input() metaType: any;

  sub!: Subscription | undefined;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private startService: StartService,
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  buildForm(): void {
    this.form = this.fb.group({
      mode: new FormControl('link')
    });
    this.metaType.value.map((v: string) => this.form.addControl(v, new FormControl('')));
    this.form.addControl('type', new FormControl(this.metaType.key));
  }

  onSubmit() {
    this.sub = this.startService.createPosting(this.form.value)?.subscribe();
  }

  updateControl(path: string, value: string) {
    const control = this.form.controls[path];
    control.setValue(value);
    control.markAsDirty();
  }

  public get mode() {
    return this.form.controls.mode.value;
  }

  public get type() {
    return this.form.controls.type.value;
  }

}
