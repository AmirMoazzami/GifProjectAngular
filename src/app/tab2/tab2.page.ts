import { Component } from "@angular/core";
import { ActionSheetController } from "@ionic/angular";
import { UserPhoto, PhotoService } from "../services/photo.service";
import { AddImageComponent } from "../add-image/add-image.component";

@Component({
  selector: "app-tab2",
  templateUrl: "tab2.page.html",
  styleUrls: ["tab2.page.scss"],
})
export class Tab2Page {
  constructor(
    public photoService: PhotoService,
    public actionSheetController: ActionSheetController
  ) {}

  async ngOnInit() {
    await this.photoService.loadSaved();
  }

  public async showActionSheet(photo: UserPhoto, position: number) {
    const actionSheet = await this.actionSheetController.create({
      header: "Photos",
      buttons: [
        {
          text: "Delete",
          role: "destructive",
          icon: "trash",
          handler: () => {
            this.photoService.deletePicture(photo, position);
          },
        },
        {
          text: "Cancel",
          icon: "close",
          role: "cancel",
          handler: () => {
            // Nothing to do, action sheet is automatically closed
          },
        },
      ],
    });
    await actionSheet.present();
  }
  // async addMyImage() {
  //   const Addphotos = await this.modalController.create({
  //     component: AddImageComponent,
  //     componentProps: {
  //       // EditKitchen: this.homeKitchen
  //     },
  //   });
  //   Addphotos.onDidDismiss().then(async (res) => {
  //     // await this.loadSvc.presentLoading('Updating your kitchen information...');
  //     // await this.ionViewWillEnter();
  //     // await this.loadSvc.dismissLoading();
  //   });
  //   return await Addphotos.present();
  // }
}
