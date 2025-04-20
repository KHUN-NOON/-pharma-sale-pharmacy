import { Item } from "@/generated/prisma"

export type ClientItem = Omit<Item, 'price'> & {
    price: string
}