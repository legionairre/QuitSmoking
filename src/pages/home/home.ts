import { Component } from '@angular/core';

import { NavController, AlertController, ActionSheetController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {

	public smokeCount: number = 0;

	constructor(
		public navCtrl: NavController,
		public alertCtrl: AlertController,
		public actionSheetCtrl: ActionSheetController,
		public storage: Storage) {

		this.storage.get('smokeCount').then((val)=>{
			this.smokeCount = val;
		})

	}

	smokeCigar() {
		let alert = this.alertCtrl.create({
			title: 'Confirm smoking?',
			message: 'Do you want to smoke really?',
			buttons: [
				{
					text: 'Cancel',
					role: 'cancel',
					handler: () => {
					}
				},
				{
					text: 'Smoke!',
					handler: () => {
						this.smokeCount += 1;
						this.storage.set('smokeCount', this.smokeCount);
					}
				}
			]
		});
		alert.present();
	}

	resetCigar() {
		this.smokeCount = 0;
		this.storage.set('smokeCount', this.smokeCount);
	}

	removeSmokeCigar() {
		this.smokeCount -= 1;
		this.storage.set('smokeCount', this.smokeCount);
	}

	openActionSheetCtrl() {
		let actionSheet = this.actionSheetCtrl.create({
			buttons: [
				{
					text: 'Remove Smoking',
					icon: 'remove',
					cssClass: 'actionSheet',
					handler: () => {
						this.removeSmokeCigar();
					}
				},
				{
					text: 'Reset Smoking',
					icon: 'refresh',
					cssClass: 'actionSheet',
					handler: () => {
						let alert = this.alertCtrl.create({
							title: 'Confirm reset?',
							message: 'Do you want to reset smoke really?',
							buttons: [
								{
									text: 'Cancel',
									role: 'cancel',
									handler: () => {
									}
								},
								{
									text: 'Reset Please :)',
									handler: () => {
										this.resetCigar();
									}
								}
							]
						});
						alert.present();
					}
				}, {
					text: 'Cancel',
					role: 'cancel',
					handler: () => {
						console.log('Cancel clicked');
					}
				}
			]
		});
		actionSheet.present();
	}

}
