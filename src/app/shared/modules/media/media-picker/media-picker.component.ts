import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MediaItem } from '../../../_interfaces/media-item.interface';

@Component({

  selector: 'app-media-picker',
  templateUrl: './media-picker.component.html',
  styleUrls: ['./media-picker.component.scss']
})
export class MediaPickerComponent implements OnInit {

  selectedMedias: any = {};

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<MediaPickerComponent>) {
  }

  ngOnInit(): void {
  }

  onSelect(item: MediaItem) {
    if (!this.data.multiple) {
      this.dialogRef.close(item);
    }
    this.selectedMedias[item.id] = item;
  }

  onDeSelect(item: MediaItem) {
    delete this.selectedMedias[item.id];
    console.log(this.selectedMedias);
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.dialogRef.close(this.selectedMedias);
  }
}
