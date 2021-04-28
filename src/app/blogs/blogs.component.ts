import { Component, Injector, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { BlogDto, BlogDtoPagedResultDto, BlogServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { CreateBlogDialogComponent } from './create-blog-dialog/create-blog-dialog.component';
import { EditBlogDialogComponent } from './edit-blog-dialog/edit-blog-dialog.component';



class PagedBlogsRequestDto extends PagedRequestDto {
  keyword: string;
}
@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  animations: [appModuleAnimation()],
  styles: [
  ]
})
export class BlogsComponent extends PagedListingComponentBase<BlogDto> {
  blogs: BlogDto[] = [];
  keyword = '';
  advancedFiltersVisible = false;

  constructor(
    injector: Injector,
    private _blogService: BlogServiceProxy,
    private _modalService: BsModalService
  ) {
    super(injector);
  }

  list(
    request: PagedBlogsRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;

    this._blogService
      .getAll(
        request.keyword,
        request.skipCount,
        request.maxResultCount
      )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: BlogDtoPagedResultDto) => {
        this.blogs = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  delete(blog: BlogDto): void {
    abp.message.confirm(
      this.l('BlogDeleteWarningMessage', blog.title),
      undefined,
      (result: boolean) => {
        if (result) {
          this._blogService
            .delete(blog.id)
            .pipe(
              finalize(() => {
                abp.notify.success(this.l('SuccessfullyDeleted'));
                this.refresh();
              })
            )
            .subscribe(() => {});
        }
      }
    );
  }

  createBlog(): void {
    this.showCreateOrEditBlogDialog();
  }

  editBlog(blog: BlogDto): void {
    this.showCreateOrEditBlogDialog(blog.id);
  }

  showCreateOrEditBlogDialog(id?: string): void {
    let createOrEditBlogDialog: BsModalRef;
    if (!id) {
      createOrEditBlogDialog = this._modalService.show(
        CreateBlogDialogComponent,
        {
          class: 'modal-lg',
        }
      );
    } else {
      createOrEditBlogDialog = this._modalService.show(
        EditBlogDialogComponent,
        {
          class: 'modal-lg',
          initialState: {
            id: id,
          },
        }
      );
    }

    createOrEditBlogDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }

  clearFilters(): void {
    this.keyword = '';
    this.getDataPage(1);
  }
}


