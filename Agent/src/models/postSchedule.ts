export interface postSchedule {
    userId: string;
    username: string;
    repo: string;
    type: 'daily' | 'weekly'; 
    time: string; 
    postUTCHour: number; 
    day?: string; 
    createdAt: string;
}

export default postSchedule;