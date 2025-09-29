import { z } from "zod";

const employeeSchema = z.object({
    name: z
        .string()
        .min(1, "Name is required")
        .max(100, "Name must be less than 100 characters"),
    email: z.string().email("Invalid email address"),
    position: z
        .string()
        .min(1, "Position is required")
        .max(100, "Position must be less than 100 characters"),
    department: z.string().min(1, "Department is required"),
    salary: z
        .number()
        .min(0, "Salary must be greater than or equal to 0")
        .max(10000000, "Salary must be less than 10,000,000"),
});

describe("Employee API Validation", () => {
    describe("Employee schema validation", () => {
        it("should validate a correct employee", () => {
            const validEmployee = {
                name: "Chaitanya Karmalkar",
                email: "karmalkarchaitanya@gmail.com",
                position: "Software Developer",
                department: "engineering",
                salary: 75000,
            };

            const result = employeeSchema.safeParse(validEmployee);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toEqual(validEmployee);
            }
        });

        it("should reject empty name", () => {
            const invalidEmployee = {
                name: "",
                email: "karmalkarchaitanya@gmail.com",
                position: "Software Developer",
                department: "engineering",
                salary: 75000,
            };

            const result = employeeSchema.safeParse(invalidEmployee);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe("Name is required");
            }
        });

        it("should reject invalid email", () => {
            const invalidEmployee = {
                name: "Chaitanya Karmalkar",
                email: "invalid-email",
                position: "Software Developer",
                department: "engineering",
                salary: 75000,
            };

            const result = employeeSchema.safeParse(invalidEmployee);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(
                    "Invalid email address"
                );
            }
        });

        it("should reject empty position", () => {
            const invalidEmployee = {
                name: "Chaitanya Karmalkar",
                email: "karmalkarchaitanya@gmail.com",
                position: "",
                department: "engineering",
                salary: 75000,
            };

            const result = employeeSchema.safeParse(invalidEmployee);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(
                    "Position is required"
                );
            }
        });

        it("should reject name that is too long", () => {
            const invalidEmployee = {
                name: "A".repeat(101), // 101 characters
                email: "karmalkarchaitanya@gmail.com",
                position: "Software Developer",
                department: "engineering",
                salary: 75000,
            };

            const result = employeeSchema.safeParse(invalidEmployee);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(
                    "Name must be less than 100 characters"
                );
            }
        });

        it("should reject position that is too long", () => {
            const invalidEmployee = {
                name: "Chaitanya Karmalkar",
                email: "karmalkarchaitanya@gmail.com",
                position: "A".repeat(101), // 101 characters
                department: "engineering",
                salary: 75000,
            };

            const result = employeeSchema.safeParse(invalidEmployee);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(
                    "Position must be less than 100 characters"
                );
            }
        });

        it("should handle multiple validation errors", () => {
            const invalidEmployee = {
                name: "",
                email: "invalid-email",
                position: "",
                department: "",
                salary: -1000,
            };

            const result = employeeSchema.safeParse(invalidEmployee);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues).toHaveLength(5);
                expect(
                    result.error.issues.map((issue) => issue.message)
                ).toContain("Name is required");
                expect(
                    result.error.issues.map((issue) => issue.message)
                ).toContain("Invalid email address");
                expect(
                    result.error.issues.map((issue) => issue.message)
                ).toContain("Position is required");
                expect(
                    result.error.issues.map((issue) => issue.message)
                ).toContain("Department is required");
                expect(
                    result.error.issues.map((issue) => issue.message)
                ).toContain("Salary must be greater than or equal to 0");
            }
        });

        it("should reject empty department", () => {
            const invalidEmployee = {
                name: "Chaitanya Karmalkar",
                email: "karmalkarchaitanya@gmail.com",
                position: "Software Developer",
                department: "",
                salary: 75000,
            };

            const result = employeeSchema.safeParse(invalidEmployee);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(
                    "Department is required"
                );
            }
        });

        it("should reject negative salary", () => {
            const invalidEmployee = {
                name: "Chaitanya Karmalkar",
                email: "karmalkarchaitanya@gmail.com",
                position: "Software Developer",
                department: "engineering",
                salary: -5000,
            };

            const result = employeeSchema.safeParse(invalidEmployee);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(
                    "Salary must be greater than or equal to 0"
                );
            }
        });

        it("should reject salary that is too high", () => {
            const invalidEmployee = {
                name: "Chaitanya Karmalkar",
                email: "karmalkarchaitanya@gmail.com",
                position: "Software Developer",
                department: "engineering",
                salary: 15000000, // Above 10M limit
            };

            const result = employeeSchema.safeParse(invalidEmployee);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe(
                    "Salary must be less than 10,000,000"
                );
            }
        });

        it("should accept valid department values", () => {
            const departments = [
                "engineering",
                "design",
                "product",
                "marketing",
                "sales",
                "human-resources",
            ];

            departments.forEach((department) => {
                const validEmployee = {
                    name: "Chaitanya Karmalkar",
                    email: "karmalkarchaitanya@gmail.com",
                    position: "Software Developer",
                    department: department,
                    salary: 75000,
                };

                const result = employeeSchema.safeParse(validEmployee);
                expect(result.success).toBe(true);
            });
        });

        it("should accept salary at boundary values", () => {
            const salaryTestCases = [0, 1, 50000, 100000, 9999999, 10000000];

            salaryTestCases.forEach((salary) => {
                const validEmployee = {
                    name: "Chaitanya Karmalkar",
                    email: "karmalkarchaitanya@gmail.com",
                    position: "Software Developer",
                    department: "engineering",
                    salary: salary,
                };

                const result = employeeSchema.safeParse(validEmployee);
                expect(result.success).toBe(true);
            });
        });
    });
});
