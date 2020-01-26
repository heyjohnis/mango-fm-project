import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { UserData } from './user-data';

@Injectable({
  providedIn: 'root'
})
export class MyfireService {

  constructor(private user: UserData) { }

  getUserFromDatabase(uid) {
    console.log(uid);
    const ref = firebase.database().ref('users/' + uid);
    const userdata = ref.once('value').then(snapshot => snapshot.val());
    console.log('userdata :');
    console.log(userdata);
    return userdata;
  }

  generateRandomName() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 5; i++) {
      text += possible.charAt(Math.random() * possible.length);
    }
    return text;
  }

  uploadFile(file) {
    const fileName = this.generateRandomName();
    const fileRef = firebase.storage().ref().child('image/' + fileName);
    const uploadTask = fileRef.put(file);

    return new Promise((resolve, reject) => {
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, snapshot => {
      }, error => {
        reject(error);
      }, () => {
        const fileUrl = uploadTask.snapshot.ref.getDownloadURL()
          .then((download) => {
            console.log(download);
            resolve({ name: fileName, fileUrl: download });
          });
      });
    });
  }

  handleImageUpload(data) {
    const user = this.user.getUserId();

    const newPersonalPostKey = firebase.database().ref().child('myposts').push().key;
    const personalPostDetails = {
      fileURL: data.fileUrl,
      name: data.name,
      creationDate: new Date().toString()
    };

    const allPostKey = firebase.database().ref().child('allposts').push().key;
    const allPostDetails = {
      fileURL: data.fileUrl,
      name: data.name,
      creationDate: new Date().toString(),
      uploadedBy: user
    };

    const imageDetails = {
      fileURL: data.fileUrl,
      name: data.name,
      creationDate: new Date().toString(),
      uploadedBy: user,
      favoriteCount: 0
    };

    const updates = {};
    updates['/images/' + data.name] = imageDetails;

    return firebase.database().ref().update(updates);
  }

  getUserPostsRef(uid) {
    return firebase.database().ref('myposts').child(uid);
  }

  handleFavoriteClicked(imageData) {
    const uid = firebase.auth().currentUser.uid;
    const updates = {};
    updates['/images/' + imageData.name + '/oldFavoriteCount'] = imageData.favoriteCount;
    updates['/images/' + imageData.name + '/favoriteCount'] = imageData.favoriteCount + 1;
    updates['/favorites/' + uid + '/' + imageData.name] = imageData;

    return firebase.database().ref().update(updates);
  }

}
