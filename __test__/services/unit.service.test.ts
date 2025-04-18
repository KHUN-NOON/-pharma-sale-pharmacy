import { getUnits } from "@pharmacy/services/unit.service";
import { getUnitDTO } from "@pharmacy/zod";
import { describe, expect, it } from "vitest";

describe("Pharmacy Unit Services", () => {
    it("should return a list of units", async () => {
        const params: getUnitDTO = {
            page: 1,
            limit: 20
        };

        const res = await getUnits(params);

        console.log(res);

        expect(res).toBeInstanceOf(Object);
    });
});