import { Injectable, OnInit } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, orderBy, query } from '@angular/fire/firestore';
import { deleteDoc, doc, updateDoc, getDoc, DocumentSnapshot, DocumentData, CollectionReference } from 'firebase/firestore';
import { Storage } from '@angular/fire/storage';
import { ref, getStorage, uploadBytesResumable, getDownloadURL, FirebaseStorage, listAll } from 'firebase/storage';
import { Observable, from, map } from 'rxjs';
interface Post {
  id: string, // Assuming the ID is a string
  body: string,
  imageUrl: string[],
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  body: any;
  imageUrl: string[] = [];
  reader: any;
  commandText: string = '';
  constructor(private fire: Firestore, private storage: Storage) { }

  getData(): Observable<any[]> {
    //collection -> refers to collection at the specified path
    const itemCollection = collection(this.fire, 'notes');
    //query -> query is extended additional query constraints
    const itemQuery = query(itemCollection, orderBy('createdAt', 'desc'));
    return collectionData(itemQuery, { idField: 'id' })
  }
  formatTimestamp(timestamp: any) {
    if (timestamp) {
      const now = new Date();
      const postDate = timestamp.toDate();
      const diff = now.getTime() - postDate.getTime();
      const diffHours = diff / (1000 * 60 * 60);

      if (diffHours < 1) {
        // Less than 1 hour, display minutes
        const diffMinutes = Math.round(diff / (1000 * 60));
        return diffMinutes + ' minutes ago';
      } else if (diffHours >= 1 && diffHours < 24) {
        return Math.round(diffHours) + ' hours ago';
      } else {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return postDate.toLocaleDateString('en-US', options);
      }
    } else {
      return '';
    }
  }
  async onFileChange(event: any): Promise<void> {
    const file = event.target.files[0];
    if (file) {
      console.log(file);
      // Display preview image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const previewImage = document.getElementById('previewImage') as HTMLImageElement;
        previewImage.src = e.target.result;
        previewImage.style.display = 'block';
      };
      reader.readAsDataURL(file);
      //storage -> Gets a FirebaseStorage instance for the given Firebase app.
      const storage = getStorage();
      const path = `fbpost/${file.name}`;
      //ref  using the reference path in the firebase storage
      const storageRef = ref(storage, path);

      try {
        // Upload the file and get a task for monitoring the progress
        //differene b/w
        //uploadbytes ->upload data into data location. can't not resumable.
        // uploadbytesResumable -> Uploads data to this object's location. The upload can be paused and resumed, and exposes progress updates.
        const uploadTask = uploadBytesResumable(storageRef, file);

        // returns the download URL
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        console.log(url);

        // Ensure this.imageUrl is initialized as an array
        if (!Array.isArray(this.imageUrl)) {
          this.imageUrl = [];
        }
        this.imageUrl.push(url); // Store the URL in the array
        console.log(this.imageUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  }

  addPost() {
    //trim remove whitspace
    if (this.body.trim() !== '') {
      const previewImage = document.getElementById('previewImage') as HTMLImageElement;
      previewImage.style.display = 'none';
      const post = {
        body: this.body,
        imageUrl: this.imageUrl,
        createdAt: new Date()
      };
      //collection -> get the absolute path for reference
      const itemCollection = collection(this.fire, 'notes')
      
      //addDoc ->Add a new document, assigning it a document ID automatically.
      addDoc(itemCollection, post)
      this.body = ''; // Clear the input field after adding post
      this.imageUrl = [];
      this.reader = '';
      console.warn('body is empty', this.body.trim == '');
    } else {
      console.warn('Body cannot be empty!');
    }
  }
  async deletePost(postId: string): Promise<void> {

    //doc -> Gets a DocumentReference instance that refers to the document at the specified absolute path.
    const postRef = doc(this.fire, 'notes', postId)

    //deleteDoc -> Deletes the document referred to by the specified DocumentReference.
    await deleteDoc(postRef)
    alert('post deleted succesfully');
    console.log('post deleted succesfully', 'postid->', postId, 'postobj->', postRef);
  }
  async commandPost(postId: string): Promise<void> {

    //doc -> document reference for specified path.
    const postReference = doc(this.fire, 'notes', postId)

    //updateDoc ->Updates fields in the document referred to by the specified DocumentReference. The update will fail if applied to a document that does not exist.
    await updateDoc(postReference, {
      command: this.commandText
    })
  }
  async toggleLike(postId: string): Promise<void> {

    //doc -> document reference for specified path.
    const postReff = doc(this.fire, 'notes', postId)
    console.log(postReff);

    //getDoc->Reads the document referred to by this DocumentReference.
    const docSnap = getDoc(postReff)
    if ((await docSnap).exists()) {
      const postData = (await docSnap).data() as { likes: number, liked: boolean };
      if (isNaN(postData.likes)) {
        postData.likes = 0;
      }
      postData.likes += postData.likes ? -1 : 1;
      console.log(postData.likes ? 'liked' : 'unliked');
      await updateDoc(postReff, { likes: postData.likes })
      console.log(postReff ? 'post liked' : 'unliked successfully');
    }
  }
}
