import { createCategoryAction } from "@pharmacy/actions/category.action";
import { describe, expect, it, vi } from "vitest";


vi.mock('next/headers', () => {
    return {
        cookies: () => ({
            toString: () => 'next-auth.session-token=fakeToken',
        }),
    };
});

vi.mock('next-auth/jwt', async () => {
    return {
        getToken: async () => ({
            email: 'test@example.com',
        }),
    };
});

describe("Category Actions", () => {
    it("should create a category", async () => {
        // Mock the form data
        const formData = new FormData();
        formData.append("name", "Test Category With Auth false");
        formData.append("description", "This is a test category");

        // Call the action
        const response = await createCategoryAction({
            success: false,
            message: null,
            data: null
        }, formData);

        console.log(response)

        // Check the response
        expect(response.success).toBe(false);
        expect(response.data).toHaveProperty("id");
    });
});
