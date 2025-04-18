import { Prisma, PrismaClient, Unit } from "@/generated/prisma";
import { createUnitDTO, getUnitDTO } from "@pharmacy/zod";
import { PaginatedServiceResponse, ServiceResponseType } from "@/types/service.type";

const prisma = new PrismaClient();

export async function getUnits(params: getUnitDTO): Promise<PaginatedServiceResponse<Unit[]>> {
    try {
        const skip = (params.page - 1) * params.limit;

        const searchFilters: Prisma.UnitWhereInput[] = [];

        if (params.search) {
            searchFilters.push({ name: { contains: params.search, mode: "insensitive" } });
        }

        const whereClause = params.search
            ? {
                OR: searchFilters
            }
            : {};

        const [units, total] = await Promise.all([
            prisma.unit.findMany({
                where: whereClause,
                skip,
                take: params.limit,
                orderBy: {
                    name: 'desc'
                }
            }),
            prisma.unit.count({ where: whereClause })
        ]);

        return {
            message: "Success Retriving!",
            success: true,
            data: {
                result: units,
                page: params.page,
                total,
                totalPages: Math.ceil(total / params.page)
            }
        };
    } catch (error) {
        const res: ServiceResponseType<null> = {
            message: error instanceof Error ? error.message : "Unknown Error!",
            success: false,
            data: null
        };
        return res;
    }
}

export async function createUnit(payload: createUnitDTO): Promise<ServiceResponseType<Unit>> {
    try {
        const res = await prisma.unit.create({
            data: { ...payload }
        });

        return {
            message: "Success!",
            success: true,
            data: res
        };
    } catch (error) {
        return {
            message: error instanceof Error ? error.message : "Unkown Error!",
            success: true,
            data: null
        };
    }
}

export async function getUnitById(id: number): Promise<ServiceResponseType<Unit>> {
    try {
        const res = await prisma.unit.findFirst({
            where: { id }
        });

        return {
            message: "Success!",
            success: true,
            data: res
        };
    } catch (error) {
        return {
            message: error instanceof Error ? error.message : "Unkown Error!",
            success: true,
            data: null
        };
    }
}

export async function updateUnit(id: number, payload: createUnitDTO): Promise<ServiceResponseType<Unit>> {
    try {
        const res = await prisma.unit.update({
            where: { id },
            data: { ...payload }
        });

        return {
            message: "Success!",
            success: true,
            data: res
        };
    } catch (error) {
        return {
            message: error instanceof Error ? error.message : "Unkown Error!",
            success: true,
            data: null
        };
    }
}

export async function deleteUnit(id: number): Promise<ServiceResponseType<Unit>> {
    try { 
        const unit = await prisma.unit.findUnique({ where: { id } });

        let res = null;

        if (unit) {
            res = await prisma.unit.delete({ where: { id } });
        }

        return {
            message: "Success!",
            success: true,
            data: res
        };
    } catch (error) {
        return {
            message: error instanceof Error ? error.message : "Unkown Error!",
            success: true,
            data: null
        };
    }
}