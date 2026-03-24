export interface JobPost {
    id: number
    title: string
    description: string
    location: string
    salaryMin: number
    salaryMax: number
    status: string
    createdAt: string
    companyName: string
    employerId: number
}

export interface PagedResult<T> {
    items: T[]
    currentPage: number
    totalPages: number
    totalCount: number
    hasNextPage: boolean
    hasPreviousPage: boolean
}

export interface JobPostQuery {
    title?: string
    location?: string
    status?: string
    salaryMin?: number
    salaryMax?: number
    sortBy?: string
    sortOrder?: string
    page?: number
    pageSize?: number
}