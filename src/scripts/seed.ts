import { initializeFirestore } from '../infrastructure/database/firestore.config';
import { FirestoreUserRepository } from '../infrastructure/repositories';

async function seedDatabase(): Promise<void> {
    console.log('Starting database seed...');

    try {
        initializeFirestore();

        const userRepository = new FirestoreUserRepository();

        const users = [
            { email: 'official.henryromero@gmail.com' },
        ];

        for (const userData of users) {
            try {
                const user = await userRepository.create(userData);
                console.log(`Created user: ${user.email} (ID: ${user.id})`);
            } catch (error) {
                console.error(`Error creating user ${userData.email}:`, error);
            }
        }

        console.log('Database seed completed successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    seedDatabase();
}

export { seedDatabase };
