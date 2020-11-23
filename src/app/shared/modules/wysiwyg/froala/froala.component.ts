import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FroalaService } from './../froala.service';
declare var FroalaEditor: any;

@Component({
  selector: 'app-froala',
  templateUrl: './froala.component.html',
  styleUrls: ['./froala.component.scss']
})
export class FroalaComponent implements OnInit, OnDestroy {

  private subscription!: Subscription;
  public isReady = false;

  public options: Object = {
    moreText: {
      buttons: [
        'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript',
        'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'inlineClass',
        'inlineStyle', 'clearFormatting'
      ]
    },
    moreParagraph: {
      buttons: [
        'alignLeft', 'alignCenter', 'formatOLSimple', 'alignRight', 'alignJustify',
        'formatOL', 'formatUL', 'paragraphFormat', 'paragraphStyle',
        'lineHeight', 'outdent', 'indent', 'quote'
      ]
    },
    moreRich: {
      buttons: [
        'insertLink', 'insertImage', 'insertVideo',
        'insertTable', 'emoticons', 'fontAwesome', 'specialCharacters',
        'embedly', 'insertFile', 'insertHR'
      ]
    },
    moreMisc: {
      buttons: ['undo', 'redo', 'fullscreen', 'print', 'getPDF', 'spellChecker', 'selectAll', 'html', 'help'],
      align: 'right',
      buttonsVisible: 2
    },
    codeMirror: true,
    charCounterCount: true,
  }

  constructor(
    private readonly froalaService: FroalaService,
    @Inject(DOCUMENT) private readonly document: any
  ) { }

  ngOnInit(): void {
    this.subscription = this.froalaService.lazyLoadFroala().subscribe(_ => {
      this.isReady = true;
      if (!FroalaEditor) {
        FroalaEditor = this.document.defaultView.FroalaEditor;
      }
      console.log(FroalaEditor);

    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
