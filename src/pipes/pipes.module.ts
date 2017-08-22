import { NgModule } from '@angular/core';
import { UrlPipe } from './../pipes/url/url';
import { YoutubePipe } from './../pipes/youtube/youtube';
import { GetNamePipe } from './../pipes/get-name/get-name';
import { SlidesPipe } from './../pipes/slides/slides';
@NgModule({
	declarations: [UrlPipe,
    YoutubePipe,
    GetNamePipe,
    SlidesPipe],
	imports: [],
	exports: [UrlPipe,
    YoutubePipe,
    GetNamePipe,
    SlidesPipe]
})
export class PipesModule {}
