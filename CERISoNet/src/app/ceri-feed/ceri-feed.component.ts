import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRouteSnapshot, Router} from "@angular/router";
import {LocalStorageTokenVoterService} from "../local-storage-token-voter.service";
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {debounceTime, distinctUntilChanged, filter, map, merge, Observable, OperatorFunction, Subject} from "rxjs";
import {NgbTypeahead, NgbTypeaheadSelectItemEvent} from "@ng-bootstrap/ng-bootstrap";
import {NotifierService} from "angular-notifier";
import {faHeart, faShareSquare, faComment, faTrashCan} from "@fortawesome/free-regular-svg-icons";
import {DatePipe} from "@angular/common";


@Component({
  selector: 'app-ceri-feed',
  templateUrl: './ceri-feed.component.html',
  styleUrls: ['./ceri-feed.component.scss'],
  providers: [DatePipe]
})

export class CeriFeedComponent implements OnInit {
  public posts: any[]= [];
  public collapsed: any;
  public collapsedRepost: any;
  public userFilter: any;
  public users: any;
  public usersData: any;
  public headers: any;
  public options: any;
  public numberOfPages: any;
  public page: any;
  public itemPerPage: any;
  public filteredSearch: boolean | undefined;
  public filteredSearchHash: boolean | undefined;
  public hashtags: any;
  public hashtagsFilter: any;
  faHeart = faHeart;
  faShareSquare = faShareSquare;
  faComment = faComment;
  faTrashCan = faTrashCan;
  public filterMemory: any;
  private filterMemoryHash: any;
  public chosenSortLike: any;
  public chosenSortDate: any;
  public sortedData: boolean | undefined;
  public sortedDataValue: any;
  private sortedDataType: any;
  public liked: any;

  constructor(private router: Router, private tokenChecker: LocalStorageTokenVoterService, private httpClient: HttpClient, private notifier: NotifierService, private datePipe: DatePipe) {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('authDataToken')
    });
    this.options = { headers: this.headers };
  }

  ngOnInit(): void {
    //Check if user is authenticated, if false, redirect the user on the login component as he should
    //be authenticated to use CERISoNet
    // @ts-ignore
    this.tokenChecker.isUserFullyAuthenticated() ? null : this.router.navigate(['/', 'login']);
    this.users = [];
    this.hashtags = []
    this.usersData = [];
    this.collapsed = [];
    this.collapsedRepost = [];
    this.page = 1;
    this.itemPerPage = 10;
    this.filteredSearch = false;
    this.filteredSearchHash = false;
    this.sortedData = false;
    this.sortedDataType = '';
    this.filterMemory = '';
    this.filterMemoryHash = '';
    this.sortedDataValue = '';
    this.liked = []
    this.setUp();
    //this.users = this.userService.getAll();
  }

  setUp(): void {
    try {
      this.httpClient.post('https://pedago.univ-avignon.fr:3223/Users', {}, this.options).subscribe((res1 :any) => {
        res1.forEach((el1: { _username: string; }) => this.users.push(el1._username));
        console.log(this.users);
        this.httpClient.post('https://pedago.univ-avignon.fr:3223/Posts', {}, this.options).subscribe((res2: any) => {
          this.posts = res2;
          this.numberOfPages = this.posts.length;
          this.filteredSearch = false;
          this.filteredSearchHash = false;
          res2.forEach((el: { hashtags: any[]; }) => {
            this.collapsed.push(true);
            this.collapsedRepost.push(true);
            el.hashtags.forEach((el2: any) => this.hashtags.push(el2));
          })
          console.log(this.posts);
          if (this.sortedData) {
            if (this.sortedDataType === 'date') {
              if (this.sortedDataValue === 'asc') {
                this.sortByDateAsc();
              }
              if (this.sortedDataValue === 'dsc') {
                this.sortByDateDsc();
              }
            }
            if (this.sortedDataType === 'like') {
              if (this.sortedDataValue === 'asc') {
                this.sortByLikeAsc();
              }
              if (this.sortedDataValue === 'dsc') {
                this.sortByLikeDsc();
              }
            }
          }
        })
      });
    } catch (error: any) {
      //Notify user if there is an error
      this.notifier.notify("error", "("+ error.status + ") " + error.error.errorMessage);
    }
  }

  getPost(username: string): void {
    try {
      this.httpClient.post('https://pedago.univ-avignon.fr:3223/Posts', {_username: username}, this.options).subscribe((res: any) => {
        this.posts = res;
        this.collapsed = [];
        this.collapsedRepost = [];
        this.filteredSearch = true;
        this.filteredSearchHash = false;
        this.hashtagsFilter = '';
        this.filterMemoryHash = '';
        this.filterMemory = username;
        res.forEach(() => {
          this.collapsed.push(true);
          this.collapsedRepost.push(true);
        })
        if (this.sortedData) {
          if (this.sortedDataType === 'date') {
            if (this.sortedDataValue === 'asc') {
              this.sortByDateAsc();
            }
            if (this.sortedDataValue === 'dsc') {
              this.sortByDateDsc();
            }
          }
          if (this.sortedDataType === 'like') {
            if (this.sortedDataValue === 'asc') {
              this.sortByLikeAsc();
            }
            if (this.sortedDataValue === 'dsc') {
              this.sortByLikeDsc();
            }
          }
        }
      });
    } catch (error: any) {
      //Notify user if there is an error
      this.notifier.notify("error", "("+ error.status + ") " + error.error.errorMessage);
    }
  }

  getPostByHashtag(hashtag: string): void {
    try {
      this.httpClient.post('https://pedago.univ-avignon.fr:3223/Posts', {_hashtags: hashtag}, this.options).subscribe((res: any) => {
        this.posts = res;
        this.collapsed = [];
        this.collapsedRepost = [];
        this.filteredSearch = false;
        this.userFilter = '';
        this.filterMemory = '';
        this.filteredSearchHash = true;
        this.filterMemoryHash = hashtag;
        res.forEach(() => {
          this.collapsed.push(true);
          this.collapsedRepost.push(true);
        })
        if (this.sortedData) {
          if (this.sortedDataType === 'date') {
            if (this.sortedDataValue === 'asc') {
              this.sortByDateAsc();
            }
            if (this.sortedDataValue === 'dsc') {
              this.sortByDateDsc();
            }
          }
          if (this.sortedDataType === 'like') {
            if (this.sortedDataValue === 'asc') {
              this.sortByLikeAsc();
            }
            if (this.sortedDataValue === 'dsc') {
              this.sortByLikeDsc();
            }
          }
        }
      });
    } catch (error: any) {
      //Notify user if there is an error
      this.notifier.notify("error", "("+ error.status + ") " + error.error.errorMessage);
    }
  }


  @ViewChild('instance', { static: true }) instance: NgbTypeahead | undefined;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    // @ts-ignore
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map((term) =>
        (term === '' ? this.users : this.users.filter((v: string) => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10),
      ),
    );
  };

  @ViewChild('other', { static: true }) other: NgbTypeahead | undefined;
  other$ = new Subject<string>();
  another$ = new Subject<string>();

  searchHastag: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    // @ts-ignore
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map((term) =>
        (term === '' ? this.hashtags : this.hashtags.filter((v: string) => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10),
      ),
    );
  };


  selectedItem($event: NgbTypeaheadSelectItemEvent<any>) {
    console.log($event);
    this.getPost($event.item);
  }


  selectedItemHash($event: NgbTypeaheadSelectItemEvent<any>) {
    console.log($event);
    this.getPostByHashtag($event.item);
  }

  onKey($event: string) {
    console.log($event);
  }

  createComment(value: string, _id: any) {
    const newDate = new Date();
    const commentVal = {
      // @ts-ignore
      commentedBy: JSON.parse(localStorage.getItem('authData'))._id,
      date: newDate.getFullYear() + '-' + (newDate.getMonth()+1) + '-' + newDate.getDay(),
      hour: this.datePipe.transform(newDate, 'shortTime'),
      text: value
    }
    console.log(commentVal);
    // @ts-ignore
    console.log(JSON.parse(localStorage.getItem('authData'))._id);
    this.httpClient.post('https://pedago.univ-avignon.fr:3223/addComment', {comment: commentVal, id: _id}, this.options).subscribe((res: any) => {
      console.log(res);
      if (res.modifiedCount && res.modifiedCount > 0) {
        //Ne redraw pas le rendu update seulement la taille
        //this.posts[this.posts.findIndex((element: { _id: any; }) => element._id === _id)].comments.push(commentVal);
        if (this.filteredSearch) {
          this.getPost(this.filterMemory)
        }
        else if (this.filteredSearchHash) {
          this.getPostByHashtag(this.filterMemoryHash)
        }
        else {
          this.setUp();
        }
      }
      else {
        this.notifier.notify("error", "Impossible d'envoyer le commentaire !");
      }
    })

  }

  likePost(_id: any, value: any, $event: any) {
    console.log($event);
    if (this.liked.findIndex((element: { _id: any; }) => element._id === _id) === -1) {
      this.httpClient.post('https://pedago.univ-avignon.fr:3223/updateLikes', {id: _id, incr: true}, this.options).subscribe((res: any) => {
        console.log(res);
        if (res.modifiedCount && res.modifiedCount > 0) {
          $event.srcElement.style.color = "red";
          this.posts[this.posts.findIndex((element: { _id: any; }) => element._id === _id)].likes += 1;
          this.liked.push({_id: _id, incr: true})
        }
        else {
          this.notifier.notify("error", "Impossible de like le post !");
        }
      });
    }
    else {
      if (this.liked[this.liked.findIndex((element: { _id: any; }) => element._id === _id)].incr) {
        this.httpClient.post('https://pedago.univ-avignon.fr:3223/updateLikes', {id: _id, incr: false}, this.options).subscribe((res: any) => {
          console.log(res);
          if (res.modifiedCount && res.modifiedCount > 0) {
            $event.srcElement.style.color = "black";
            this.posts[this.posts.findIndex((element: { _id: any; }) => element._id === _id)].likes -= 1;
            this.liked[this.liked.findIndex((element: { _id: any; }) => element._id === _id)].incr = false
          }
          else {
            this.notifier.notify("error", "Impossible de like le post !");
          }
        });
      }
      else {
        this.httpClient.post('https://pedago.univ-avignon.fr:3223/updateLikes', {id: _id, incr: true}, this.options).subscribe((res: any) => {
          console.log(res);
          if (res.modifiedCount && res.modifiedCount > 0) {
            $event.srcElement.style.color = "red";
            this.liked[this.liked.findIndex((element: { _id: any; }) => element._id === _id)].incr = true
            this.posts[this.posts.findIndex((element: { _id: any; }) => element._id === _id)].likes += 1;
          }
          else {
            this.notifier.notify("error", "Impossible de like le post !");
          }
        });
      }
    }
  }

  sortByLikeAsc() {
    this.sortedData = true;
    this.sortedDataType = 'like';
    this.sortedDataValue = "asc"
    this.posts.sort((a: { likes: number; }, b: { likes: number; }) => {
      return a.likes - b.likes;
    })
  }

  sortByLikeDsc() {
    this.sortedData = true;
    this.sortedDataType = 'like';
    this.sortedDataValue = "dsc"
    this.posts.sort((a: { likes: number; }, b: { likes: number; }) => {
      return b.likes - a.likes;
    })
  }

  sortByDateAsc() {
    this.sortedData = true;
    this.sortedDataType = 'date';
    this.sortedDataValue = "asc"
    this.posts.sort((a: { date: string; }, b: { date: string; }) => {
      // @ts-ignore
      return new Date(a.date) - new Date(b.date);
    })
  }

  sortByDateDsc() {
    this.sortedData = true;
    this.sortedDataType = 'date';
    this.sortedDataValue = "dsc"
    this.posts.sort((a: { date: string; }, b: { date: string; }) => {
      // @ts-ignore
      return new Date(b.date) - new Date(a.date);
    })
  }

  cancelSort() {
    this.sortedData = false;
    this.sortedDataType = '';
    this.sortedDataValue = ""
    if (this.filteredSearch) {
      this.getPost(this.filterMemory)
    }
    else if (this.filteredSearchHash) {
      this.getPostByHashtag(this.filterMemoryHash)
    }
    else {
      this.setUp();
    }
    this.chosenSortLike = '';
    this.chosenSortDate = '';
  }


  likeSort() {
    console.log(this.chosenSortLike);
    switch(this.chosenSortLike) {
      case "asc":
        this.sortByLikeAsc();
        break;
      case "dsc":
        this.sortByLikeDsc();
        break;
      case "none":
        this.cancelSort();
        break;
      default:
        this.notifier.notify("error", "Erreur lors du tri");
        break;
    }
    this.chosenSortDate = '';
  }

  dateSort() {
    switch(this.chosenSortDate) {
      case "asc":
        this.sortByDateAsc();
        break;
      case "dsc":
        this.sortByDateDsc();
        break;
      case "none":
        this.cancelSort();
        break;
      default:
        this.notifier.notify("error", "Erreur lors du tri");
        break;
    }
    this.chosenSortLike = '';
  }

  cancelFilter() {
    this.filteredSearch = false;
    this.filteredSearchHash = false;
    this.filterMemory = '';
    this.filterMemoryHash = '';
    this.userFilter = '';
    this.hashtagsFilter = '';
    this.setUp();
  }

  createRepost(body: string, url: string, title: string, tag: string, _id: any) {
    let tags = tag.split(" ").filter(t => t.charAt(0) === '#');

    // @ts-ignore
    this.httpClient.post('https://pedago.univ-avignon.fr:3223/createRepost', {
      postId: _id,
      // @ts-ignore
      userId: JSON.parse(localStorage.getItem('authData'))._id,
      body: body,
      url: url,
      title: title,
      tags: tags
    }, this.options).subscribe((res: any) => {
      if (this.filteredSearch) {
        this.getPost(this.filterMemory)
      }
      else if (this.filteredSearchHash) {
        this.getPostByHashtag(this.filterMemoryHash)
      }
      else {
        this.setUp();
      }
    });
  }
}
