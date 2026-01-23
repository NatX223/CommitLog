export interface userData {
    id: string,
    profile: {
        displayName: string;
        avatarUrl: string;
        email?: string
    };
    createdAt: Date;
    updatedAt: Date;
    connectedAccounts: {
        x?: {
            accessToken: string;
            expiresAt: number;
            refreshToken: string;
            tokenType: string;
            updatedAt: number;
        };
        github?: {
            accessToken: string;
        }
    }
}

export interface userSchedule { repo: string, type: string }