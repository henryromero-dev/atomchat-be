export interface User {
    id: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateUserData {
    email: string;
}

export interface UpdateUserData {
    email?: string | undefined;
}
