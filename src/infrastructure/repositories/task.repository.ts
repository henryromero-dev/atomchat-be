import * as admin from 'firebase-admin';
import { Task, CreateTaskData, UpdateTaskData } from '../../domain/entities';
import { TaskRepository } from '../../domain/repositories';
import { getFirestore } from '../database/firestore.config';

export class FirestoreTaskRepository implements TaskRepository {
    private readonly collection = 'tasks';

    async findById(id: string): Promise<Task | null> {
        const firestore = getFirestore();
        const doc = await firestore.collection(this.collection).doc(id).get();

        if (!doc.exists) {
            return null;
        }

        const data = doc.data()!;
        return {
            id: doc.id,
            title: data['title'],
            description: data['description'],
            completed: data['completed'],
            userId: data['userId'],
            createdAt: data['createdAt'].toDate(),
            updatedAt: data['updatedAt'].toDate(),
        };
    }

    async findByUserId(userId: string): Promise<Task[]> {
        const firestore = getFirestore();
        const snapshot = await firestore
            .collection(this.collection)
            .where('userId', '==', userId)
            .get();

        return snapshot.docs
            .map((doc: any) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    title: data['title'],
                    description: data['description'],
                    completed: data['completed'],
                    userId: data['userId'],
                    createdAt: data['createdAt'].toDate(),
                    updatedAt: data['updatedAt'].toDate(),
                };
            })
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    async findAll(): Promise<Task[]> {
        const firestore = getFirestore();
        const snapshot = await firestore
            .collection(this.collection)
            .orderBy('createdAt', 'desc')
            .get();

        return snapshot.docs.map((doc: any) => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data['title'],
                description: data['description'],
                completed: data['completed'],
                userId: data['userId'],
                createdAt: data['createdAt'].toDate(),
                updatedAt: data['updatedAt'].toDate(),
            };
        });
    }

    async create(data: CreateTaskData): Promise<Task> {
        const firestore = getFirestore();
        const now = new Date();

        const taskData = {
            title: data.title,
            description: data.description || '',
            completed: false,
            userId: data.userId,
            createdAt: admin.firestore.Timestamp.fromDate(now),
            updatedAt: admin.firestore.Timestamp.fromDate(now),
        };

        const docRef = await firestore.collection(this.collection).add(taskData);

        return {
            id: docRef.id,
            title: data.title,
            description: data.description || '',
            completed: false,
            userId: data.userId,
            createdAt: now,
            updatedAt: now,
        };
    }

    async update(id: string, data: UpdateTaskData): Promise<Task | null> {
        const firestore = getFirestore();
        const docRef = firestore.collection(this.collection).doc(id);

        const updateData: any = {
            updatedAt: admin.firestore.Timestamp.fromDate(new Date()),
        };

        if (data.title !== undefined) {
            updateData.title = data.title;
        }
        if (data.description !== undefined) {
            updateData.description = data.description;
        }
        if (data.completed !== undefined) {
            updateData.completed = data.completed;
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
