import { z } from "zod";

export const createCategorySchema = z.object({
    name: z.string(),
    description: z.string().optional()
});

export type createCategoryDTO = z.infer<typeof createCategorySchema>;

export const getCategorySchema = z.object({
    search: z.string().optional(),
    page: z.number().int().min(1).optional().default(1),
    limit: z.number().int().min(1).max(100).optional().default(10),
});

export type getCategoryDTO = z.infer<typeof getCategorySchema>;

export const createUnitSchema = z.object({
    name: z.string(),
    description: z.string().optional()
});

export type createUnitDTO = z.infer<typeof createCategorySchema>;

export const getUnitSchema = z.object({
    search: z.string().optional(),
    page: z.number().int().min(1).optional().default(1),
    limit: z.number().int().min(1).max(100).optional().default(10),
}); 

export type getUnitDTO = z.infer<typeof getUnitSchema>;

export const createItemSchema = z.object({
    name: z.string(),
    categoryId: z.number(),
    unitId: z.number(),
    stockQuantity: z.number().min(0).int(),
    price: z.number()
});

export type createItemDTO = z.infer<typeof createItemSchema>;

export const getItemSchema = z.object({
    search: z.string().optional(),
    page: z.number().int().min(1).optional().default(1),
    limit: z.number().int().min(1).max(100).optional().default(10),
});

export type getItemDTO = z.infer<typeof getItemSchema>;
