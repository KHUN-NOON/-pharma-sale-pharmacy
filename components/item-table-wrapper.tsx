'use client';

import { DataTable } from '@/components/ui/data-table';
import { PaginationControlsProps } from '@/components/ui/pagination-control';
import { columns } from './item.columns';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import ItemFormModal from './item.form.modal';
import { Item } from '@/generated/prisma';
import { deleteItemAction, getItemByIdAction } from '@pharmacy/actions/item.action';
import { ActionResponseType } from '@/types/action.type';
import { dismissableToaster } from '@/lib/toaster';
import { ClientItem } from '@pharmacy/types';
import { Input } from '@/components/ui/input';
import { useRouter, useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';
import ConfirmDeleteDialog from "@/components/ui/confirm-delete-dialog";
import FullscreenLoading from "@/components/ui/fullscreen-loading";

export default function ItemTableWrapper({ data, paginationProps }: { data: any, paginationProps: PaginationControlsProps }) {
    const [open, setOpen] = useState(false);
    const [currItem, setCurrItem] = useState<ClientItem | null>(null);
    const [search, setSearch] = useState('');
    const [alertOpen, setAlertOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();

    const handleEdit = async (id: number) => {
        const formData = new FormData();
        formData.append('id', id.toString());
        const item = await getItemByIdAction({} as ActionResponseType<Item>, formData);

        if (!item.success) {
            dismissableToaster({
                title: "Fetch Item Error!",
                description: item.message ?? ''
            });

            return;
        }

        setCurrItem(item.data)
        setOpen(true);
    }

    const handleDelete = async (id: number) => {
        // Handle delete action
        setDeleteId(id);
        setAlertOpen(true);
    }

    const handleCreate = () => {
        setOpen(true);
    }

    const tableColumns = columns({
        edit: handleEdit,
        deleteItem: handleDelete
    });

    const handleSearch = (value: string) => {
        const params = new URLSearchParams(searchParams);

        if (value.trim()) {
            params.set('page', '1');
            params.set('limit', '10');
            params.set('search', value.trim());
        } else {
            params.delete('search');
            params.delete('page');
            params.delete('limit');
        }

        router.push(`?${params.toString()}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch(search);
        }
    };

    const handleClear = () => {
        setSearch('');
        handleSearch('');
    }

    const deleteCallback = async (id: number) => {
        try {
            const formData = new FormData();
            formData.append('id', id.toString());

            const res = await deleteItemAction({} as ActionResponseType<Item>, formData);

            if (res.success) {
                dismissableToaster({
                    title: "Delete Item",
                    description: res.message ?? "Success!"
                })

                router.refresh();
            } else {
                throw new Error(res.message ?? "Unknown Error!");
            }
        } catch (error) {
            dismissableToaster({
                title: "Delete Item",
                description: error instanceof Error ? error.message : ""
            })
        }
    }

    return (
        <>
            <FullscreenLoading
                text='Loading'
                isLoading={isLoading}
            />
            <div className="flex justify-end mb-3">
                <Button onClick={handleCreate}>
                    Create New Item
                </Button>
            </div>
            <div className="flex gap-4 items-center mb-3">
                <Input
                    className='sm:w-2/4 md:w-2/5'
                    placeholder='Enter Name To Search'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <Button
                    onClick={() => handleSearch(search)}
                >
                    Search
                </Button>
                <Button
                    onClick={handleClear}
                    variant='outline'
                >
                    <X size={18} />
                </Button>
            </div>
            <DataTable
                columns={tableColumns}
                data={data}
                paginationProps={paginationProps}
            />
            <ItemFormModal open={open} setOpen={setOpen}
                currItem={currItem}
                setCurrItem={setCurrItem}
            />
            <ConfirmDeleteDialog
                id={deleteId}
                open={alertOpen}
                onOpenChange={setAlertOpen}
                callback={() => deleteCallback(deleteId as number)}
            />
        </>
    )
}