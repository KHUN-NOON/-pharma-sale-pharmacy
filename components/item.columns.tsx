'use client';

import { ColumnDef } from "@tanstack/react-table"
import { Pencil, Trash2 } from "lucide-react";

type ItemRow = {
    id: number;
    name: string;
    price: number;
    stockQuantity: number;
}

type columnProps = {
    edit: (id: number) => void;
    deleteItem: (id: number) => void;
}

export const columns = ({edit, deleteItem}: columnProps): ColumnDef<ItemRow>[] => {
    return  [
        {
            accessorKey: "id",
            header: "ID",
            size: 50,
        },
        {
            accessorKey: "name",
            header: "Name",
            size: 150,
        },
        {
            accessorKey: "price",
            header: "Price",
            size: 100,
            cell({row}) {
                return row.original.price.toLocaleString();
            }
        },
        {
            accessorKey: "stockQuantity",
            header: "Quantity",
            size: 100,
        },
        {
            accessorKey: "actions",
            header: "Actions",
            size: 100,
            cell({row}) {
                return (
                    <div className="flex gap-4">
                        <button onClick={() => edit(row.original.id)}>
                            <Pencil size={16}/>
                        </button>
                        <button onClick={() => deleteItem(row.original.id)} className="text-red-500">
                            <Trash2 size={16}/>
                        </button>
                    </div>
                )
            }
        }
    ];
}