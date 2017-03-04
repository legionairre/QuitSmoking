import { Component } from '@angular/core';

import { NavController, AlertController, ActionSheetController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SettingsPage } from '../settings/settings';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {

	public smokeCount: number = 0;
	public boxCount: number = 0;
	public totalCost: number = 0;
	public oneBoxCost: number = 0;
	public oneCigarCost: number = 0;
	public totalBoxCost: number;
	public totalSmokeCost: number;

	constructor(
		public navCtrl: NavController,
		public alertCtrl: AlertController,
		public actionSheetCtrl: ActionSheetController,
		public storage: Storage) {

		this.storage.get('smokeCount').then((val) => {
			this.smokeCount = val;
		})
		this.storage.get('boxCount').then((val) => {
			this.boxCount = val;
		})
		this.storage.get('oneBoxCost').then((val) => {
			console.log(val);
			this.oneBoxCost = val;
		})
		this.storage.get('oneCigarCost').then((val) => {
			console.log(val);
			this.oneCigarCost = val;
		})
		this.evaluateBox();

	}

	evaluateBox() {
		this.storage.get('smokeCount').then((val) => {
			console.log('smoke=>', val);
			if (val >= 20) {
				this.boxCount += 1;
				this.smokeCount = 0;
				this.storage.set('smokeCount', this.smokeCount);
				this.storage.set('boxCount', this.boxCount);
			} if (val < 0) {
				this.smokeCount = 0;
				this.storage.set('smokeCount', this.smokeCount);
			}
		})
		this.storage.get('boxCount').then((val) => {
			console.log('box=>', val);
			if (val < 0) {
				this.boxCount = 0;
				this.storage.set('boxCount', this.boxCount);
			}
		})
		setTimeout(() => {
			this.evaluatePrice();
    	}, 500);
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
		this.evaluateBox();
	}

	removeSmokeCigar() {
		this.storage.get('smokeCount').then((val) => {
			if (val == 0 || val == null) {
				this.storage.get('boxCount').then((box) => {
					if (box == 0 || box == null) {
						return;
					}
					if (box > 0) {
						this.boxCount -= 1;
						this.smokeCount = 19;
						this.storage.set('smokeCount', this.smokeCount);
						this.storage.set('boxCount', this.boxCount);
						return;
					}
				})
			}
			if( val > 0 ) {
				this.smokeCount -= 1;
				this.storage.set('smokeCount', this.smokeCount);
				this.evaluateBox();
			}
		})
		this.evaluateBox();
	}

	removeBoxCigar() {
		this.storage.get('boxCount').then((val) => {
			if (val == 0 || val == null) {
				this.boxCount = 0;
				this.storage.set('boxCount', this.boxCount);
				this.evaluateBox();
				return;
			} else {
				this.boxCount -= 1;
				this.storage.set('boxCount', this.boxCount);
				this.evaluateBox();
				return;
			}
		})
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

	evaluatePrice(){
		this.totalBoxCost = this.oneBoxCost * this.boxCount;
		this.storage.set('totalBoxCost', this.totalBoxCost);
		console.log(this.totalBoxCost);
		this.totalSmokeCost = this.oneCigarCost * this.smokeCount;
		this.storage.set('totalSmokeCost', this.totalSmokeCost);
		console.log(this.totalSmokeCost);
		this.totalCost = this.totalBoxCost + this.totalSmokeCost;
		this.storage.set('totalCost', this.totalCost);
		console.log(this.totalCost);
	}

	openSettingsPage(){
		this.navCtrl.push(SettingsPage);
	}

}
