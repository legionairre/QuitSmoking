import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/*
  Generated class for the Settings page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

	public oneBoxCost: number;
	public oneCigarCost: number;

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	public storage: Storage) {
  		this.storage.get('oneBoxCost').then((val)=>{
  			this.oneBoxCost = val;
  			console.log(val);
  		});
  		this.storage.get('oneCigarCost').then((val)=>{
  			this.oneCigarCost = val;
  			console.log(val);
  		});
  }

  saveInformation(){
  	this.oneCigarCost = this.oneBoxCost / 20;
  	this.storage.set('oneBoxCost', this.oneBoxCost);
  	this.storage.set('oneCigarCost', this.oneCigarCost);
  	this.navCtrl.pop();
  }

}
