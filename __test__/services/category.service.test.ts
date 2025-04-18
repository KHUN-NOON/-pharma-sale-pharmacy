import { describe, expect, it } from "vitest";
import { getCategories, getCategoryById } from "@pharmacy/services/category.service";
import { getCategoryDTO } from "@pharmacy/zod";

describe('Pharmacy Category Services', () => {
    it("should return list of categories", async () => {
        const params: getCategoryDTO = {
            search: 'Heart',
            page: 1,
            limit: 10
        };

        const res = await getCategories(params);

        console.log(res);

        expect(res).toBeInstanceOf(Object);
    });

    it("should return a category by id", async () => {
        const res = await getCategoryById(4);

        console.log(res);

        expect(res).toBeInstanceOf(Object);
    });
});