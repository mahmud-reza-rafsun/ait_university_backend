export interface TCreateSubject {
    title: string;
    description: string;
    thumbnail?: string;
    price: number;
    durationDays?: number;
}

export interface TUpdateSubject {
    title?: string;
    description?: string;
    thumbnail?: string;
    price?: number;
    durationDays?: number;
    isPublished?: boolean;
}
