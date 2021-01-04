import {Component, Input, OnInit} from '@angular/core';
import {EventcreatorComponent} from './eventcreator/eventcreator.component';
import {Calendar} from '@ionic-native/calendar/ngx';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireStorage} from '@angular/fire/storage';

@Component({
    selector: 'app-markercreator',
    templateUrl: './markercreator.page.html',
    styleUrls: ['./markercreator.page.scss'],
    providers: [EventcreatorComponent, Calendar, AngularFirestore, AngularFireStorage]
})

export class MarkercreatorPage implements OnInit {
    @Input() eventID: string;
    segmentShown: string;
    editMode: boolean;

    constructor(private eventCreator: EventcreatorComponent) {
    }

    ngOnInit() {
        this.editMode = this.eventID !== '';
        this.segmentShown = this.editMode ? 'event' : 'geo-ping';
    }

    closeModal(){
        this.eventCreator.closeModal();
    }

    segmentChanged($event: any) {
        this.segmentShown = $event.detail.value;
    }
}
