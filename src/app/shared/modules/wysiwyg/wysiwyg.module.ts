import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { FroalaService } from './froala.service';
import { FroalaComponent } from './froala/froala.component';
import { KolkovEditorComponent } from './kolkov-editor/kolkov-editor.component';


@NgModule({
  declarations: [
    FroalaComponent,
    KolkovEditorComponent,
  ],
  exports: [
    FroalaComponent,
    KolkovEditorComponent
  ],
  imports: [
    AngularEditorModule,
    CommonModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    FroalaService
  ]
})
export class WysiwygModule { }
