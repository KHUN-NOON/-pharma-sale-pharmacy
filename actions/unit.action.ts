'use server'

import { Unit } from "@/generated/prisma";
import { withAuth } from "@/lib/server.action.wrapper";
import { ActionResponseType } from "@/types/action.type";
import { createUnit, deleteUnit, updateUnit } from "@pharmacy/services/unit.service";
import { createUnitDTO, createUnitSchema } from "@pharmacy/zod";

export const createUnitAction = async (prevState: ActionResponseType<Unit>, formData: FormData): Promise<ActionResponseType<Unit>> => {
    const validation = createUnitSchema.safeParse({
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
        action: () => createUnit(validation.data as createUnitDTO)
    });

    return res;
}

export const updateUnitAction = async (prevState: ActionResponseType<Unit>, formData: FormData): Promise<ActionResponseType<Unit>> => {
    const id = formData.get('id') as unknown as number;

    const validation = createUnitSchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description')
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
        action: () => updateUnit(id, validation.data as createUnitDTO)
    });

    return res;
}

export const deleteUnitAction = async (prevState: ActionResponseType<Unit>, formData: FormData): Promise<ActionResponseType<Unit>> => {
    const id = formData.get('id') as unknown as number;

    const res = await withAuth({
        action: () => deleteUnit(id)
    });

    return res;
}