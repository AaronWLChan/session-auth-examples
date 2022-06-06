export interface User {
    _id: string,
    email: string
}

export type PageState = "loading" | "error" | "success"