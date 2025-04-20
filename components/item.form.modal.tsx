import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ClientItem } from "@pharmacy/types"
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import { createItemSchema } from "@pharmacy/zod"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { getAllCategoriesAction } from "@pharmacy/actions/category.action"
import { ActionResponseType } from "@/types/action.type"
import { Category, Item, Unit } from "@/generated/prisma"
import { dismissableToaster } from "@/lib/toaster"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormField } from "@/components/ui/form";
import { devLogger } from "@/lib/utils";
import { createItemAction, updateItemAction } from "@pharmacy/actions/item.action"
import { getAllUnitsAction } from "@pharmacy/actions/unit.action"
import { useRouter } from "next/navigation"

type Props = {
    open: boolean
    setOpen: (open: boolean) => void,
    currItem?: ClientItem | null,
    setCurrItem?: Dispatch<SetStateAction<ClientItem | null>>
}

export default function ItemFormModal({ open = false, setOpen, currItem, setCurrItem }: Props) {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const { register, handleSubmit, formState: { errors }, control, setValue, reset, getValues } = useForm({
        resolver: zodResolver(createItemSchema),
        defaultValues: {
            name: undefined,
            price: 0,
            stockQuantity: 0,
            unitId: undefined,
            categoryId: undefined
        }
    });

    const handleOpen = (open: boolean) => {
        setOpen(open);

        if (open == false) {
            setCurrItem && setCurrItem(null);
            reset();
        }
    }

    const submitFunc = async () => {
        try {
            const data = getValues();
            const formData = new FormData();

            let res;

            const fields: Record<string, any> = {
                name: data.name,
                categoryId: data.categoryId,
                unitId: data.unitId,
                price: data.price,
                stockQuantity: data.stockQuantity,
            };

            Object.entries(fields).forEach(([key, value]) => {
                formData.set(key, value.toString());
            });

            if (currItem) {
                // Update 
                devLogger.log("Update");
                formData.set('id', currItem.id.toString());

                res = await updateItemAction({} as ActionResponseType<Item>, formData);

                devLogger.log(res);
            } else {
                // Create 
                res = await createItemAction({} as ActionResponseType<Item>, formData);

                devLogger.log(res);
            }

            if ( res.success ) {
                dismissableToaster({
                    title: currItem ? "Update Item!" : "Create New Item",
                    description: res.message ?? "Success"
                });

                router.refresh();
                setOpen(false);
                reset();
            } else {
                dismissableToaster({
                    title: currItem ? "Update Item!" : "Create New Item",
                    description: res.message ?? "Failed"
                });
            }

        } catch (error) {
            dismissableToaster({
                title: currItem ? "Update Item!" : "Create New Item!",
                description: error instanceof Error ? error.message : "Failed!"
            });
        }
    }

    const categoryInit = async () => {
        const formData = new FormData();
        const res = await getAllCategoriesAction({} as ActionResponseType<Category[]>, formData);

        if (res.success) {
            setCategories(res.data ?? [])
        } else {
            dismissableToaster({
                title: "Categories Fetch!",
                description: res.message ?? 'Unknown Error.'
            });
        }
    }

    const unitInit = async () => {
        const formData = new FormData();
        const res = await getAllUnitsAction({} as ActionResponseType<Unit[]>, formData);

        if (res.success) {
            setUnits(res.data ?? [])
        } else {
            dismissableToaster({
                title: "Units Fetch!",
                description: res.message ?? 'Unknown Error.'
            });
        }
    }

    useEffect(() => {
        if (currItem) {
            setValue('name', currItem.name);
            setValue('categoryId', Number(currItem.categoryId));
            setValue('unitId', Number(currItem.unitId));
            setValue('price', Number(currItem.price));
            setValue('stockQuantity', Number(currItem.stockQuantity));
        }
    }, [currItem, setValue])

    useEffect(() => {
        categoryInit();
        unitInit();
    }, []);

    return (
        <Dialog open={open} onOpenChange={handleOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {
                            currItem
                                ? "Update Item"
                                : "Create Item"
                        }
                    </DialogTitle>
                    <DialogDescription>
                        Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(submitFunc)}>
                    <div className="grid gap-4 py-4">
                        <div className="flex flex-col gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input {...register('name')} id="name" name="name" />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                        </div>
                        <div className="flex flex-col gap-4">
                            <Label htmlFor="category" className="text-right">
                                Category
                            </Label>
                            <FormField
                                control={control}
                                name="categoryId"
                                render={({ field }) => (
                                    <Select onValueChange={(value) => setValue('categoryId', Number(value))} value={String(field.value)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories?.map((c) => (
                                                <SelectItem key={c.id} value={c.id.toString()}>
                                                    {c.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId.message}</p>}
                        </div>
                        <div className="flex flex-col gap-4">
                            <Label htmlFor="unit" className="text-right">
                                Unit
                            </Label>
                            <FormField
                                control={control}
                                name="unitId"
                                render={({ field }) => (
                                    <Select onValueChange={(value) => setValue('unitId', Number(value))} value={String(field.value)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Unit" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {units?.map((u) => (
                                                <SelectItem key={u.id} value={u.id.toString()}>
                                                    {u.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.unitId && <p className="text-red-500 text-sm">{errors.unitId.message}</p>}
                        </div>
                        <div className="flex flex-col gap-4">
                            <Label htmlFor="unit" className="text-right">
                                Price
                            </Label>
                            <FormField
                                control={control}
                                name="price"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="number"
                                        step="0.01"
                                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                    />
                                )}
                            />
                            {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
                        </div>
                        <div className="flex flex-col gap-4">
                            <Label htmlFor="stockQuantity" className="text-right">
                                Stock Qty
                            </Label>
                            <Input {...register('stockQuantity', { valueAsNumber: true })} type="number" name="stockQuantity" id="stockQuantity" />
                            {errors.stockQuantity && <p className="text-red-500 text-sm">{errors.stockQuantity.message}</p>}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">
                            {
                                currItem
                                    ? "Update"
                                    : "Add"
                            }
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
