import { Component, OnInit } from "@angular/core";
import { Storage } from "@capacitor/storage";
import { Capacitor } from "@capacitor/core";
import { Injectable } from "@angular/core";
import { UserPhoto } from "../services/photo.service";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { Platform } from "@ionic/angular";

@Injectable({
  providedIn: "root",
})
@Component({
  selector: "app-add-image",
  templateUrl: "./add-image.component.html",
  styleUrls: ["./add-image.component.scss"],
})
export class AddImageComponent implements OnInit {
  NewimagePath: string;
  displayImage: any;
  public newPhoto: UserPhoto;

  slideOptsprofile = {
    initialSlide: 0,
    loop: false,
    autoplay: true,
    speed: 500,
    pagination: {
      el: ".swiper-pagination",
      dynamicBullets: true,
    },
  };

  slideOpts = {
    initialSlide: 0,
    speed: 400,
  };
  display = false;

  constructor(private platform: Platform) {}

  async ngOnInit() {
    this.dataLoading();
  }
  async dataLoading() {
    const NewimagePath = await Storage.get({ key: "capturedImage" });
    // const NewimagePath = await Storage.get({ key: "capturedImage" });
    // this.displayImage = `data:image/jpeg;base64,${NewimagePath.value}`;
    this.displayImage = NewimagePath.value;
    // this.newPhoto = JSON.parse(NewimagePath.value) || [];
    console.log("This is newPhoto: ", this.newPhoto);
    console.log("This is displayImage: ", this.displayImage);
  }
  async createPost() {}
  // if (!this.platform.is("hybrid")) {
  //   const readFile = await Filesystem.readFile({
  //     path: this.newPhoto.filepath,
  //     directory: Directory.Data,
  //   });
  //   this.newPhoto.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
  // }
  // this.displayImage = `data:image/jpeg;base64,${this.NewimagePath}`;
  // console.log("This is your image: ", this.displayImage);
  // }
  // async createPost() {
  //   await this.userPostService
  //     .createNewPost(this.userPost)
  //     .toPromise()
  //     .then(async (data: UserPost) => {
  //       console.log(data);
  //       this.router.navigate(["/tabs/tab5"]);
  //     })
  //     .catch(async (error) => {
  //       console.log(JSON.stringify(error));
  //     })
  //     .finally(async () => {
  //       await this.loadSvc.dismissLoading();
  //     });
  // }

  // public async loadSaved() {
  //   // Retrieve cached photo array data
  //   const photoList = await Storage.get({ key: this.PHOTO_STORAGE });
  //   this.photos = JSON.parse(photoList.value) || [];

  //   // If running on the web...
  //   if (!this.platform.is("hybrid")) {
  //     // Display the photo by reading into base64 format
  //     for (let photo of this.photos) {
  //       // Read each saved photo's data from the Filesystem
  //       const readFile = await Filesystem.readFile({
  //         path: photo.filepath,
  //         directory: Directory.Data,
  //       });

  //       // Web platform only: Load the photo as base64 data
  //       photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
  //     }
  //   }
  // }
}

// public createNewPost(userPost: UserPost): Observable<UserPost> {
//   console.log('UserPost-Data: ', userPost);
//   return this.http.post<UserPost>(`${environment.apiEndpoint}/UserPost`, userPost);
// }
