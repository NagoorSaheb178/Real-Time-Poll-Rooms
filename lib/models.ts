export interface PollOption {
    id: string;
    text: string;
    votes: number;
}

export interface Poll {
    shareId: string;
    question: string;
    options: PollOption[];
    createdAt: Date;
}

export interface Vote {
    pollId: string;
    optionId: string;
    ip: string;
    fingerprint: string;
    createdAt: Date;
}
