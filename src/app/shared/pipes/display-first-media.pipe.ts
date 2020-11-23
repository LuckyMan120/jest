import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'displayFirstMedia'
})

export class DisplayFirstMediaPipe implements PipeTransform {


  constructor(public breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge
    ]).subscribe(result => {
      if (result.breakpoints[Breakpoints.XSmall]) {
        this.size = 128;
      }
      if (result.breakpoints[Breakpoints.Small]) {
        this.size = 256;
      }
      if (result.breakpoints[Breakpoints.Medium]) {
        this.size = 512;
      }
      if (result.breakpoints[Breakpoints.Large]) {
        this.size = 1024;
      }
      if (result.breakpoints[Breakpoints.XLarge]) {
        this.size = 2048;
      }
    });
  }

  placeholderImage = '/assets/media/misc/bg-1.jpg';
  size!: number;

  transform(value: any, args?: any[]): any {

    const allowImagePlaceholder = args && args.length > 0 ? args[0] : null;
    const placeholderImages = args && args.length > 1 ? args[1] : null;

    if (!value && placeholderImages) {
      return allowImagePlaceholder && placeholderImages ? this.getRandomPlaceholder(placeholderImages) : this.placeholderImage;
    }

    if (value.default && value.files[value.default]) {
      return value.files[value.default].sizes[this.size];
    }

    const keys = Object.keys(value);

    if (keys.length > 0 && value.sizes) {
      const key = keys[0];
      return value.sizes[this.size]
        ? value.sizes[this.size]
        : allowImagePlaceholder
          ? this.getRandomPlaceholder(placeholderImages)
          : this.placeholderImage;
      // value.files[key].sizes[this.size]
    } else {
      if (allowImagePlaceholder) {
        return placeholderImages ? this.getRandomPlaceholder(placeholderImages) : this.placeholderImage;
      } else {
        console.log(value);
        return this.getRandomPlaceholder(placeholderImages);
      }
    }
    /* if (!value || displayDefaultImage && !value.default) {
      return this.placeholderImage;
    }

    if (value.default && value.files[value.default] && displayDefaultImage) {
      return value.files[value.default].sizes[this.size];
    }

    const keys = Object.keys(value);

    if (keys.length > 0 && value.sizes) {
      const key = keys[0];
      return value.sizes[this.size] ? value.sizes[this.size] : this.placeholderImage; // value.files[key].sizes[this.size]
    } else {
      return this.placeholderImage;
    } */
  }

  getRandomPlaceholder(placeholderImages: string[]) {
    return placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
  }
}
