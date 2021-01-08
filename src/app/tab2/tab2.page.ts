import {Component, OnDestroy, OnInit} from '@angular/core';
import {ModalController, Platform} from '@ionic/angular';
import {PhysicalmapComponent} from './physicalmap/physicalmap.component';
import {AngularFireAuth} from '@angular/fire/auth';
import {environment} from '../../environments/environment';
import * as mapboxgl from 'mapbox-gl';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {AngularFireStorage} from '@angular/fire/storage';
import {AngularFirestore} from '@angular/fire/firestore';
import {QrcodePage} from './qrcode/qrcode.page';
import {AngularFireDatabase} from '@angular/fire/database';
import {FCM} from '@ionic-native/fcm/ngx';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss'],
    providers: [AngularFireDatabase, AngularFireAuth, Geolocation, AngularFireStorage, AngularFirestore, PhysicalmapComponent]
})

export class Tab2Page implements OnInit, OnDestroy {
    currentUserId: string;
    currentUserRef: any;
    unreadPings: number;
    private unreadPingSub: Subscription;

    constructor(private pm: PhysicalmapComponent, private platform: Platform, private firestore: AngularFirestore, private auth: AngularFireAuth,
                private geo: Geolocation, private modalController: ModalController, private fcm: FCM) {

        mapboxgl.accessToken = environment.mapbox.accessToken;
        this.currentUserId = this.auth.auth.currentUser.uid;
        this.currentUserRef = this.firestore.collection('users').doc(this.currentUserId);
    }

    ngOnInit(): void {
        this.unreadPingSub = this.firestore.collection('pings', ref => ref.where('userRec', '==', this.currentUserRef.ref)
        ).valueChanges().subscribe(res => {
            if (res !== null) {
                this.unreadPings = res.length;
            }
        });

        if (this.platform.is('cordova')) {
            this.fcm.getToken().then(token => {
                this.firestore.collection('notifTokens').doc(this.currentUserId).update({
                    notifToken: token
                });
            });
        }
    }

    ngOnDestroy() {
        this.unreadPingSub.unsubscribe();
    }

    async presentQRModal() {
        const modal = await this.modalController.create({
            component: QrcodePage
        });
        return await modal.present();
    }


    presentFilter() {
        this.pm.presentFilter();
    }


    presentEventCreatorModal(s: string) {
        this.pm.presentEventCreatorModal('');
    }
}
