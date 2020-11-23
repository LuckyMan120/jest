import { Component, Input, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({

  selector: 'app-kolkov-editor',
  templateUrl: './kolkov-editor.component.html',
  styleUrls: ['./kolkov-editor.component.scss']
})
export class KolkovEditorComponent implements OnInit {

  @Input() inputControl: any;
  @Input() inputName!: string;
  @Input() editorConfig: AngularEditorConfig = {};


  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: '15vh',
    maxHeight: '50vh',
    placeholder: 'Dann fang mal an zu tippen ;) ...',
    defaultParagraphSeparator: 'p',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    sanitize: true
  };

  constructor() { }

  ngOnInit() {
    this.config = { ...this.config, ...this.editorConfig };
  }

}
