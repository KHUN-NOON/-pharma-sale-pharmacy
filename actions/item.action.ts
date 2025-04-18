'use server';

import { Item } from "@/generated/prisma";
import { withAuth } from "@/lib/server.action.wrapper";
import { ActionResponseType } from "@/types/action.type";
import { createItem, deleteItem, updateItem } from "@pharmacy/services/item.service";
import { createItemDTO, createItemSchema } from "@pharmacy/zod";

export const createItemAction = async (prevState: ActionResponseType<Item>, formData: FormData): Promise<ActionResponseType<Item>> => {
    const validation = createItemSchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description'),
        unitId: formData.get('unitId'),
        categoryId: formData.get('categoryId')
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
        action: () => createItem(validation.data as createItemDTO)
    });

    return res;
}

export const updateItemAction = async (prevState: ActionResponseType<Item>, formData: FormData): Promise<ActionResponseType<Item>> => { 
    const id = formData.get('id') as unknown as number;

    const validation = createItemSchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description'),
        unitId: formData.get('unitId'),
        categoryId: formData.get('categoryId')
    });

    if (!validation.success && !id) {
        const errors = validation.error.flatten();
        return {
            success: false,
            message: null,
            errors: errors.fieldErrors,
            data: null
        };
    }

    const res = await withAuth({
        action: () => updateItem(id, validation.data as createItemDTO)
    });

    return res;
}

export const deleteItemAction = async (prevState: ActionResponseType<Item>, formData: FormData): Promise<ActionResponseType<Item>> => {
    const id = formData.get('id') as unknown as number;

    const res = await withAuth({
        action: () => deleteItem(id)
    });

    return res;
}