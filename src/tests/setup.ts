import 'dotenv/config';

process.env['NODE_ENV'] = 'test';
process.env['JWT_SECRET'] = 'test-secret-key';
process.env['FIREBASE_PROJECT_ID'] = 'test-project';
process.env['GOOGLE_APPLICATION_CREDENTIALS'] = 'test-credentials.json';

jest.mock('firebase-admin', () => ({
    initializeApp: jest.fn(),
    apps: [],
    credential: {
        applicationDefault: jest.fn(),
    },
    firestore: jest.fn(() => ({
        collection: jest.fn(() => ({
            doc: jest.fn(() => ({
                get: jest.fn().mockResolvedValue({
                    exists: false,
                    data: () => null,
                }),
                set: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
            })),
            add: jest.fn().mockResolvedValue({
                id: 'mock-id',
            }),
            where: jest.fn(() => ({
                limit: jest.fn(() => ({
                    get: jest.fn().mockResolvedValue({
                        empty: true,
                        docs: [],
                    }),
                })),
                orderBy: jest.fn(() => ({
                    get: jest.fn().mockResolvedValue({
                        empty: true,
                        docs: [],
                    }),
                })),
            })),
        })),
        Timestamp: {
            fromDate: jest.fn((date: Date) => ({ toDate: () => date })),
        },
    })),
    Timestamp: {
        fromDate: jest.fn((date: Date) => ({ toDate: () => date })),
    },
}));
