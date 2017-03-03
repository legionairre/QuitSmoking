import { Component } from '@angular/core';

import { NavController, AlertController, ActionSheetController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {

	public smokeCount: number = 0;
	public boxCount: number = 0;

	constructor(
		public navCtrl: NavController,
		public alertCtrl: AlertController,
		public actionSheetCtrl: ActionSheetController,
		public storage: Storage) {

		this.storage.get('smokeCount').then((val) => {
			this.smokeCount = val;
		});

		this.storage.get('boxCount').then((val) => {
			this.boxCount = val;
		})

		this.evaluateBox();

	}

	evaluateBox() {
		this.storage.get('smokeCount').then((val)=> {
			if(val>=20){
				this.boxCount += 1;
				this.smokeCount = 0;
				this.storage.set('smokeCount', this.smokeCount);
				this.storage.set('boxCount', this.boxCount);
			}if(val<0){
				this.smokeCount = 0;
				this.storage.set('smokeCount', this.smokeCount);
			}
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
						this.evaluateBox();
					}
				}
			]
		});
		alert.present();
	}

	resetCigar() {
		this.smokeCount = 0;
		this.boxCount = 0;
		this.storage.set('smokeCount', this.smokeCount);
		this.storage.set('boxCount', this.boxCount);
	}

	removeSmokeCigar() {
		this.smokeCount -= 1;
		this.storage.set('smokeCount', this.smokeCount);
		this.storage.get('smokeCount').then((val)=>{
			if(val<=0){
				this.storage.get('boxCount').then((box)=>{
					if(box!=0){
						this.removeBoxCigar();
					}
					if(box==0){
						return;
					}
				})
			}
		})
		this.evaluateBox();
	}

	removeBoxCigar() {
		this.boxCount -= 1;
		this.storage.set('boxCount', this.boxCount);
		this.evaluateBox();
	}

	openActionSheetCtrl() {
		let actionSheet = this.actionSheetCtrl.create({
			buttons: [
				{
					text: 'Remove Smoke',
					icon: 'remove',
					cssClass: 'actionSheet',
					handler: () => {
						this.removeSmokeCigar();
					}
				},
				{
					text: 'Remove Box',
					icon: 'remove',
					cssClass: 'actionSheet',
					handler: () => {
						this.removeBoxCigar();
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
