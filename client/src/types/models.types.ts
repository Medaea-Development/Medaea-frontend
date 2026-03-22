export interface IUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    avatarUrl?: string;
}

export interface IOrganization {
    id: string;
    name: string;
    type: 'Hospital - Inpatient' | 'Clinic' | 'Private Practice';
    role: string;
}