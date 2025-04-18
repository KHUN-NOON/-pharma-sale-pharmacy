import { Item, PrismaClient, Prisma } from "@/generated/prisma";
import { PaginatedServiceResponse, ServiceResponseType } from "@/types/service.type";
import { createItemDTO, getItemDTO } from "@pharmacy/zod";

const prisma = new PrismaClient();

export async function getItem(params: getItemDTO): Promise<PaginatedServiceResponse<Item[]>> {
    try {
        const skip = (params.page - 1) * params.limit;

        const searchFilters: Prisma.ItemWhereInput[] = [];

        if (params.search) {
            searchFilters.push({ name: { contains: params.search, mode: "insensitive" } });
        }

        const whereClause = params.search
            ? {
                OR: searchFilters
            }
            : {};

        const [items, total] = await Promise.all([
            prisma.item.findMany({
                where: whereClause,
                include: {
                    unit: true,
                    category: true
                },
                skip,
                take: params.limit,
                orderBy: {
                    name: 'desc'
                }
            }),
            prisma.item.count({ where: whereClause })
        ]);

        return {
            message: "Success Retriving!",
            success: true,
            data: {
                result: items,
                page: params.page,
                total,
                totalPages: Math.ceil(total / params.limit)}
        };
    } catch (error) {
        return {
            message: error instanceof Error ? error.message : "Unknown Error!",
            success: false,
            data: null
        };
    }

}

export async function createItem(payload: createItemDTO): Promise<ServiceResponseType<Item>> {
    try {
        const res = await prisma.item.upsert({
            where: { name: payload.name },
            create: {...payload},
            update: {...payload}
        });

        return {
            success: true,
            message: "Success!",
            data: res
        }
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "",
            data: null
        }
    }
}

export async function getItemById(id: number): Promise<ServiceResponseType<Item>> {
    try {
        const res = await prisma.item.findFirst({
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
            message: error instanceof Error ? error.message : "",
            data: null
        }
    }

}

export async function updateItem(id: number, payload: createItemDTO): Promise<ServiceResponseType<Item>> {
    try {
        const res = await prisma.item.update({
            where: { id },
            data: { ...payload }
        });

        return {
            success: true,
            message: "Success!",
            data: res
        }
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "",
            data: null
        }
    }

}

export async function deleteItem(id: number): Promise<ServiceResponseType<Item>> {
    try {
        const res = await prisma.item.delete({
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
            message: error instanceof Error ? error.message : "",
            data: null
        }
    }
}