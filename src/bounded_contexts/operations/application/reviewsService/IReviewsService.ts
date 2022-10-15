import { Locale } from "../../domain/locale/Locale";

export type ReviewDto = {
    id: string
    name: string
    avatar: string
    text: string
    stars: number
    date: Date
}

export interface IReviewsService {
    getAll(locale: Locale): Promise<ReviewDto[]>
}