import * as admin from 'firebase-admin';
import { User, CreateUserData, UpdateUserData } from '../../domain/entities';
import { UserRepository } from '../../domain/repositories';
import { getFirestore } from '../database/firestore.config';

// Firestore implementation of the UserRepository contract.
export class FirestoreUserRepository implements UserRepository {
    private readonly collection = 'users';

    async findById(id: string): Promise<User | null> {
        const firestore = getFirestore();
        const doc = await firestore.collection(this.collection).doc(id).get();

        if (!doc.exists) {
            return null;
        }

        const data = doc.data()!;
        return {
            id: doc.id,
            email: data['email'],
            createdAt: data['createdAt'].toDate(),
            updatedAt: data['updatedAt'].toDate(),
        };
    }

    async findByEmail(email: string): Promise<User | null> {
        const firestore = getFirestore();
        const snapshot = await firestore
            .collection(this.collection)
            .where('email', '==', email)
            .limit(1)
            .get();

        if (snapshot.empty) {
            return null;
        }

        const doc = snapshot.docs[0];
        if (!doc) {
            return null;
        }

        const data = doc.data();

        return {
            id: doc.id,
            email: data['email'],
            createdAt: data['createdAt'].toDate(),
            updatedAt: data['updatedAt'].toDate(),
        };
    }

    async create(data: CreateUserData): Promise<User> {
        const firestore = getFirestore();
        const now = new Date();

        const userData = {
            email: data.email,
            createdAt: admin.firestore.Timestamp.fromDate(now),
            updatedAt: admin.firestore.Timestamp.fromDate(now),
        };

        const docRef = await firestore.collection(this.collection).add(userData);

        return {
            id: docRef.id,
            email: data.email,
            createdAt: now,
            updatedAt: now,
        };
    }

    async update(id: string, data: UpdateUserData): Promise<User | null> {
        const firestore = getFirestore();
        const docRef = firestore.collection(this.collection).doc(id);

        const updateData: any = {
            updatedAt: admin.firestore.Timestamp.fromDate(new Date()),
        };

        if (data.email !== undefined) {
            updateData.email = data.email;
        }

        await docRef.update(updateData);

        return await this.findById(id);
    }

    async delete(id: string): Promise<boolean> {
        const firestore = getFirestore();
        const docRef = firestore.collection(this.collection).doc(id);

        const doc = await docRef.get();
        if (!doc.exists) {
            return false;
        }

        await docRef.delete();
        
        return true;
    }
}
