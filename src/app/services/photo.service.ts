import { Injectable } from "@angular/core";
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from "@capacitor/camera";
import { Capacitor } from "@capacitor/core";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { Storage } from "@capacitor/storage";
import { ModalController, Platform } from "@ionic/angular";
import { AddImageComponent } from "../add-image/add-image.component";

@Injectable({
  providedIn: "root",
})
export class PhotoService {
  public photos: UserPhoto[] = [];
  private PHOTO_STORAGE: string = "photos";
  CapturedImage: string;

  constructor(
    private platform: Platform,
    private modalController: ModalController
  ) {}

  public async loadSaved() {
    // Retrieve cached photo array data
    const photoList = await Storage.get({ key: this.PHOTO_STORAGE });
    this.photos = JSON.parse(photoList.value) || [];

    // If running on the web...
    if (!this.platform.is("hybrid")) {
      // Display the photo by reading into base64 format
      for (let photo of this.photos) {
        // Read each saved photo's data from the Filesystem
        const readFile = await Filesystem.readFile({
          path: photo.filepath,
          directory: Directory.Data,
        });

        // Web platform only: Load the photo as base64 data
        photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
      }
    }
  }

  /* Use the device camera to take a photo:
   https://capacitor.ionicframework.com/docs/apis/camera

   Store the photo data into permanent file storage:
   https://capacitor.ionicframework.com/docs/apis/filesystem

   Store a reference to all photo filepaths using Storage API:
   https://capacitor.ionicframework.com/docs/apis/storage
  */
  public async addNewToGallery() {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri, // file-based data; provides best performance
      //resultType: CameraResultType.Base64,
      allowEditing: true,
      source: CameraSource.Camera, // automatically take a new photo with the camera
      quality: 100, // highest quality (0 to 100)
      saveToGallery: true,
    });
    if (capturedPhoto) {
      console.log("here is your image", capturedPhoto); // mine
      // this.CapturedImage = capturedPhoto.base64String; //mine
      this.CapturedImage = await this.readAsBase64(capturedPhoto); //mine
      console.log("here is your image after base64", this.CapturedImage); // mine
      Storage.set({
        key: "capturedImage",
        value: this.CapturedImage,
      });

      this.addMyImage(); // to open your modal
    }

    const savedImageFile = await this.savePicture(capturedPhoto);
    //here call the API and get the authentication token
    //attach the authentication token to call with your image -- POSTPONED
    // get your image from the backend
    //display your modal

    //response of your modal must be stored in your photos array
    // 1.THIS is the place to put your Modal
    // then in your Modal
    // Add new photo to Photos array
    this.photos.unshift(savedImageFile);

    // Cache all photo data for future retrieval
    Storage.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos),
    });
  }

  async addMyImage() {
    const Addphotos = await this.modalController.create({
      component: AddImageComponent,
      componentProps: {
        // EditKitchen: this.homeKitchen
      },
    });
    Addphotos.onDidDismiss().then(async (res) => {
      // await this.loadSvc.presentLoading('Updating your kitchen information...');
      // await this.ionViewWillEnter();
      // await this.loadSvc.dismissLoading();
    });
    return await Addphotos.present();
  }

  // Save picture to file on device
  private async savePicture(cameraPhoto: Photo) {
    // Convert photo to base64 format, required by Filesystem API to save
    const base64Data = await this.readAsBase64(cameraPhoto);

    // Write the file to the data directory
    const fileName = new Date().getTime() + ".jpeg";
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    });

    if (this.platform.is("hybrid")) {
      // Display the new image by rewriting the 'file://' path to HTTP
      // Details: https://ionicframework.com/docs/building/webview#file-protocol
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      };
    } else {
      // Use webPath to display the new image instead of base64 since it's
      // already loaded into memory
      return {
        filepath: fileName,
        webviewPath: cameraPhoto.webPath,
      };
    }
  }

  // Read camera photo into base64 format based on the platform the app is running on
  private async readAsBase64(cameraPhoto: Photo) {
    // "hybrid" will detect Cordova or Capacitor
    if (this.platform.is("hybrid")) {
      // Read the file into base64 format
      const file = await Filesystem.readFile({
        path: cameraPhoto.path,
      });

      return file.data;
    } else {
      // Fetch the photo, read as a blob, then convert to base64 format
      const response = await fetch(cameraPhoto.webPath!);
      const blob = await response.blob();

      return (await this.convertBlobToBase64(blob)) as string;
    }
  }

  // Delete picture by removing it from reference data and the filesystem
  public async deletePicture(photo: UserPhoto, position: number) {
    // Remove this photo from the Photos reference data array
    this.photos.splice(position, 1);

    // Update photos array cache by overwriting the existing photo array
    Storage.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos),
    });

    // delete photo file from filesystem
    const filename = photo.filepath.substr(photo.filepath.lastIndexOf("/") + 1);
    await Filesystem.deleteFile({
      path: filename,
      directory: Directory.Data,
    });
  }

  convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
}

export interface UserPhoto {
  filepath: string;
  webviewPath: string;
}
