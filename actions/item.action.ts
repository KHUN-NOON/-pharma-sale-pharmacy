'use server';

import { Item } from "@/generated/prisma";
import { withAuth } from "@/lib/server.action.wrapper";
import { ActionResponseType } from "@/types/action.type";
import { createItem, deleteItem, getItemById, getItemSelect, updateItem } from "@pharmacy/services/item.service";
import { ClientItem } from "@pharmacy/types";
import { convertItemForClient } from "@pharmacy/utils";
import { createItemDTO, createItemSchema } from "@pharmacy/zod";

export const getItemByIdAction = async (prevState: ActionResponseType<Item>, formData: FormData): Promise<ActionResponseType<ClientItem>> => {
    const id = formData.get('id')?.toString();
    const res = await withAuth({
        action: () => getItemById(parseInt(id || '0'))
    });

    return {
        ...res,
        data: res.data ? convertItemForClient(res.data) : null
    }
}

export const createItemAction = async (prevState: ActionResponseType<Item>, formData: FormData): Promise<ActionResponseType<ClientItem>> => {
    const validation = createItemSchema.safeParse({
        name: formData.get('name') as string,
        categoryId: parseInt(formData.get('categoryId') as string),
        unitId: parseInt(formData.get('unitId') as string),
        stockQuantity: parseInt(formData.get('stockQuantity') as string),
        price: parseFloat(formData.get('price') as string),
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

    return {
        ...res,
        data: res.data ? convertItemForClient(res.data) : null
    }
}

export const updateItemAction = async (prevState: ActionResponseType<Item>, formData: FormData): Promise<ActionResponseType<ClientItem>> => { 
    const id = formData.get('id')?.toString();

    const validation = createItemSchema.safeParse({
        name: formData.get('name') as string,
        categoryId: parseInt(formData.get('categoryId') as string),
        unitId: parseInt(formData.get('unitId') as string),
        stockQuantity: parseInt(formData.get('stockQuantity') as string),
        price: parseFloat(formData.get('price') as string)
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
        action: () => updateItem(parseInt(id ?? '0'), validation.data as createItemDTO)
    });

    return {
        ...res,
        data: res.data ? convertItemForClient(res.data) : null
    }
}

export const deleteItemAction = async (prevState: ActionResponseType<Item>, formData: FormData): Promise<ActionResponseType<ClientItem>> => {
    const id = formData.get('id')?.toString();

    const res = await withAuth({
        action: () => deleteItem(parseInt(id ?? '0'))
    });

    return {
        ...res,
        data: res.data ? convertItemForClient(res.data) : null
    }
}

export const getItemSelectAction = async (prevState: ActionResponseType<Item[]>, formData: FormData): Promise<ActionResponseType<ClientItem[]>> => {
    const query = formData.get('query') as string;

    const res = await getItemSelect(query);

    return res;
}  