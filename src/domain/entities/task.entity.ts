export interface Task {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateTaskData {
    title: string;
    description?: string | undefined;
    userId: string;
}

export interface UpdateTaskData {
    title?: string | undefined;
    description?: string | undefined;
    completed?: boolean | undefined;
}
