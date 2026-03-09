export type Role =
    | 'ROLE_DACPA'
    | 'ROLE_DG'
    | 'ROLE_FINANCE'
    | 'ROLE_BIBLIOTHEQUE'
    | 'ROLE_PUBLIC'
    | 'ROLE_ADMIN';

export interface User {
    id: string;
    role: Role;
    direction_id: string;
}

export const CROSS_DIRECTION_ROLES: Role[] = ['ROLE_DG'];
