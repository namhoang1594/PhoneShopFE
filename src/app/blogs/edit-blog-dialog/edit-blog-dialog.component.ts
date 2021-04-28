import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BlogDto, BlogServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-edit-blog-dialog',
  templateUrl: './edit-blog-dialog.component.html',
  styles: [
  ]
})
export class EditBlogDialogComponent extends AppComponentBase
  implements OnInit {
  saving = false;
  blog: BlogDto = new BlogDto();
  id: string;

  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    public _blogService: BlogServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._blogService.get(this.id).subscribe((result: BlogDto) => {
      this.blog = result;
    });
  }

  save(): void {
    this.saving = true;

    this._blogService
      .update(this.blog)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.bsModalRef.hide();
        this.onSave.emit();
      });
  }
}