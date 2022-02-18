type RoleType = "Admin" | "Moderator" | "Author" | "User"


interface User {
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: Date;
    role: string;
    password: string;
    topics_covered: string;
    tokens: string;
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
