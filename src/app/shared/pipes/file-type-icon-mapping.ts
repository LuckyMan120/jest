import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileTypeIconMapping'
})

export class FileTypeIconMappingPipe implements PipeTransform {

  private readonly iconsClasses = [
    // Media
    { type: 'image', icon: 'fa-file-image' },
    { type: 'audio', icon: 'fa-file-audio' },
    { type: 'video', icon: 'fa-file-video' },
    // Documents
    { type: 'application/pdf', icon: 'fa-file-pdf' },
    { type: 'application/msword', icon: 'fa-file-word' },
    { type: 'application/vnd.ms-word', icon: 'fa-file-word' },
    { type: 'application/vnd.oasis.opendocument.text', icon: 'fa-file-word' },
    { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml', icon: 'fa-file-word' },
    { type: 'application/vnd.ms-excel', icon: 'fa-file-excel' },
    { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml', icon: 'fa-file-excel' },
    { type: 'application/vnd.oasis.opendocument.spreadsheet', icon: 'fa-file-excel' },
    { type: 'application/vnd.ms-powerpoint', icon: 'fa-file-powerpoint' },
    { type: 'application/vnd.openxmlformats-officedocument.presentationml', icon: 'fa-file-powerpoint' },
    { type: 'application/vnd.oasis.opendocument.presentation', icon: 'fa-file-powerpoint' },
    { type: 'text/plain', icon: 'fa-file-text' },
    { type: 'text/html', icon: 'fa-file-code' },
    { type: 'application/json', icon: 'fa-file-code' },
    // Archives
    { type: 'application/gzip', icon: 'fa-file-archive' },
    { type: 'application/zip', icon: 'fa-file-archive' },
  ];

  transform(mimeType: any): any {
    const result = this.iconsClasses.find(({ type }) => type === mimeType);
    return result && result.icon ? result.icon : 'fa-file';
  }


}
