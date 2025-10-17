import 'dotenv/config';
import * as admin from 'firebase-admin';

let firestore: admin.firestore.Firestore;

export const initializeFirestore = (): admin.firestore.Firestore => {
    // Lazy initialisation avoids repeated firebase-admin setup during hot reloads.
    if (!firestore) {
        if (admin.apps.length === 0) {
            if (!process.env['FIREBASE_PROJECT_ID'] || !process.env['GOOGLE_APPLICATION_CREDENTIALS']) {
                throw new Error('Firebase project ID and Google application credentials are required');
            }

            try {
                const config: admin.AppOptions = {
                    projectId: process.env['FIREBASE_PROJECT_ID'] || '',
                    credential: admin.credential.applicationDefault(),
                };

                admin.initializeApp(config);
            } catch (error) {
                console.error('Firebase Admin SDK initialization failed:', error);
                throw error;
            }
        }

        firestore = admin.firestore();
    }
    return firestore;
};

export const getFirestore = (): admin.firestore.Firestore => {
    if (!firestore) {
        throw new Error('Firestore not initialized.');
    }
    // Always return the singleton instance so repositories share the same connection pool.
    return firestore;
};
