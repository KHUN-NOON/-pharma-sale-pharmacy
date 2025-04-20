import { Item } from "@/generated/prisma";
import { ClientItem } from "@pharmacy/types";

export const convertItemForClient = (item: Item): ClientItem => {
    return {
        ...item,
        price: item.price.toString()
    }
}