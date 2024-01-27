import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimations(), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"ringoffire-e357a","appId":"1:696382858209:web:30df4f088dd7655407e8a0","storageBucket":"ringoffire-e357a.appspot.com","apiKey":"AIzaSyAT7TdIwnLQ6qSh0jXXe7dXCqKvZz4bapk","authDomain":"ringoffire-e357a.firebaseapp.com","messagingSenderId":"696382858209"}))), importProvidersFrom(provideFirestore(() => getFirestore()))]
};
