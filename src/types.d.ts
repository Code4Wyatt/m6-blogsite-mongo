type RoleType = "Admin" | "Moderator" | "Author" | "User"

// Convert Objects to their own interfaces to be used inside any interface needed

interface User {
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: Date;
    role: string;
    password: string;
    topics_covered: string;
    tokens: string;
    checkCredentials: Promise<User | null>;
}

interface Blog {
    category: string;
    title: string;
    cover: string;
    readTime: Object;
    authors: string;
    content: string;
    comments: Comment[];
}

interface Comment {
    comment: string;
    user: Object;
}

interface Author {
    firstName: string;
    lastName: string;
}

interface Error {
    status?: number;
}
