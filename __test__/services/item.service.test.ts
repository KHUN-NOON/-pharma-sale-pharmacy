import { createItemDTO, getItemDTO } from "@pharmacy/zod";
import { describe, it, expect } from "vitest";
import { createItem, getItem } from "@pharmacy/services/item.service";

describe("Pharmacy Item Services", () => {
    it("should return a list of items", async () => {
        const params: getItemDTO = {
            page: 1,
            limit: 20
        };
    
        const res = await getItem(params);
    
        console.log(res);
    
        expect(res).toBeInstanceOf(Object);
    });

    it("should creae a new item", async () => {
        const payload: createItemDTO = {
            name: "Test Item",
            price: 100,
            stockQuantity: 100,
            unitId: 1,
            categoryId: 1
        };

        const res = await createItem(payload);

        console.log(res);
        expect(res).toBeInstanceOf(Object);
        expect(res.success).toBe(true);
    })
} )

