'use server';
import { Category } from "@/generated/prisma";
import { createCategory, deleteCategory, getAllCategories, updateCategory } from "@pharmacy/services/category.service";
import { createCategoryDTO, createCategorySchema } from "@pharmacy/zod";
import { ActionResponseType } from "@/types/action.type";
import { withAuth } from "@/lib/server.action.wrapper";

export const createCategoryAction = async (prevState:ActionResponseType<Category> ,formData: FormData): Promise<ActionResponseType<Category>> => {
    const validation = createCategorySchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description')
    });

    if (!validation.success) {
        const errors = validation.error.flatten();
        return {
            success: false,
            message: null,
            errors: errors.fieldErrors,
            data: null
        };
    }

    const res = await withAuth({
        action: (token) => createCategory(validation.data as createCategoryDTO),
        // requireAuth: false
    });

    return res;
}

export const updateCategoryAction = async (prevState: ActionResponseType<Category>, formData: FormData): Promise<ActionResponseType<Category>> => {
    const id = formData.get('id') as unknown as number;
    
    const validation = createCategorySchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description')
    });

    if (!validation.success && !id ) {
        const errors = validation.error.flatten();
        return {
            success: false,
            message: null,
            errors: errors.fieldErrors,
            data: null
        };
    }

    const res = await withAuth({
        action: () => updateCategory(id, validation.data as createCategoryDTO),
        requireAuth: false
    });

    return res;
}

export const deleteCategoryAction = async (prevState: ActionResponseType<Category>, formData: FormData): Promise<ActionResponseType<Category>> => {
    const id = formData.get('id') as unknown as number;

    const res = await withAuth({
        action: () => deleteCategory(id)
    });

    return res;
}

export const getAllCategoriesAction = async (prevState: ActionResponseType<Category[]>, formData: FormData): Promise<ActionResponseType<Category[]>> => {
    return await withAuth({
        action: () => getAllCategories(),
        requireAuth: false
    });
}