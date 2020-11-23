import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Category } from './../../../../modules/category/_interfaces/category.interface';
import { MediaItem } from './../../../../shared/_interfaces/media-item.interface';

@Component({

  selector: 'app-media-info',
  templateUrl: './media-info.component.html',
  styleUrls: ['./media-info.component.scss']
})
export class MediaInfoComponent implements OnInit {

  form!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<MediaInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      media: MediaItem,
      categories: Category[]
    },
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.initForm(this.data.media);
  }

  close(): void {
    this.dialogRef.close();
  }

  deleteMedia(): void {
    this.dialogRef.close({ mediaItem: this.data.media, action: 'delete' });
  }

  closeAndSave(): void {
    this.data.media.assignedCategoryIds = this.form.get('assignedCategoryIds')?.value;
    this.dialogRef.close({ mediaItem: this.data.media, action: 'edit' });
  }

  initForm(media: MediaItem): void {
    this.form = this.fb.group({
      assignedCategoryIds: null
    });
    this.form.patchValue(media);
  }
}
