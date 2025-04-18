import { Category, Prisma, PrismaClient } from "@/generated/prisma";
import { createCategoryDTO, getCategoryDTO } from "@pharmacy/zod"
import { PaginatedServiceResponse, ServiceResponseType } from "@/types/service.type";

const prisma = new PrismaClient();

export async function getCategories(params: getCategoryDTO): Promise<PaginatedServiceResponse<Category[]>> {
    try {
        const skip = (params.page - 1) * params.limit;

        const searchFilters: Prisma.CategoryWhereInput[] = [];

        if ( params.search ) {
            searchFilters.push({ name: { contains: params.search, mode: 'insensitive' }});
        }

        const whereClause = params.search 
        ? { 
            OR: searchFilters
        }
        : {};

        const [categories, total] = await Promise.all([
            prisma.category.findMany({
                where: whereClause,
                skip,
                take: params.limit,
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            prisma.category.count({where: whereClause})
        ]);

        return {
            message: "Success!",
            success: true,
            data: {
                total,
                result: categories,
                page: params.page,
                totalPages: Math.ceil(total / params.limit)
            }
        };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Unknown Error!",
            data: null
        }
    }
}

export async function createCategory(payload: createCategoryDTO): Promise<ServiceResponseType<Category>> {
    try {
        const res = await prisma.category.upsert({
            where: { name: payload.name },
            create: {
                ...payload
            },
            update: {
                ...payload
            }
        });

        return {
            success: true,
            message: "Success!",
            data: res
        }
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Unknown Error!",
            data: null
        }
    }
}

export async function getCategoryById(id: number): Promise<ServiceResponseType<Category>> {
    try {
        const res = await prisma.category.findFirst({
            where: { id }
        });

        return {
            success: true,
            message: "Success!",
            data: res
        }
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Unknown Error!",
            data: null
        }
    }
}

export async function updateCategory(id: number, payload: createCategoryDTO): Promise<ServiceResponseType<Category>> {
    try {
        const res = await prisma.category.update({
            where: { id },
            data: {
                ...payload
            }
        });

        return {
            success: true,
            message: "Success!",
            data: res
        }
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Unknown Error!",
            data: null
        }
    }
}

export async function deleteCategory(id: number): Promise<ServiceResponseType<Category>> {
    try {
        const category = await prisma.category.findUnique({
            where: { id }
        });

        let res = null;
    
        if ( category ) {
            res = await prisma.category.delete({
                where: { id }
            });
        }

        return {
            success: true,
            message: "Success!",
            data: res
        }
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Unknown Error!",
            data: null
        }
    }
}