import { z } from "zod";

const employeeValidationSchema = z.object({
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

describe("Employee CRUD API Business Logic", () => {
    describe("Employee Creation Validation", () => {
        it("should accept valid employee data", () => {
            const validEmployee = {
                name: "Chaitanya Karmalkar",
                email: "karmalkarchaitanya@gmail.com",
                position: "Software Engineer",
                department: "engineering",
                salary: 90000,
            };

            const result = employeeValidationSchema.safeParse(validEmployee);
            expect(result.success).toBe(true);
        });

        it("should reject employee with invalid data types", () => {
            const invalidEmployee = {
                name: 123, // Should be a string
                email: "karmalkarchaitanya@gmail.com",
                position: "Software Engineer",
                department: "engineering",
                salary: 90000,
            };

            const result = employeeValidationSchema.safeParse(invalidEmployee);
            expect(result.success).toBe(false);
        });

        it("should enforce business rule: name cannot be empty", () => {
            const employee = {
                name: "",
                email: "karmalkarchaitanya@gmail.com",
                position: "Engineer",
                department: "engineering",
                salary: 70000,
            };

            const result = employeeValidationSchema.safeParse(employee);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(
                    result.error.issues.some(
                        (issue) =>
                            issue.path.includes("name") &&
                            issue.message === "Name is required"
                    )
                ).toBe(true);
            }
        });

        it("should enforce business rule: email must be valid format", () => {
            const employee = {
                name: "Chaitanya Karmalkar",
                email: "invalid.email",
                position: "Engineer",
            };

            const result = employeeValidationSchema.safeParse(employee);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(
                    result.error.issues.some(
                        (issue) =>
                            issue.path.includes("email") &&
                            issue.message === "Invalid email address"
                    )
                ).toBe(true);
            }
        });

        it("should enforce business rule: position cannot be empty", () => {
            const employee = {
                name: "Chaitanya Karmalkar",
                email: "karmalkarchaitanya@gmail.com",
                position: "",
            };

            const result = employeeValidationSchema.safeParse(employee);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(
                    result.error.issues.some(
                        (issue) =>
                            issue.path.includes("position") &&
                            issue.message === "Position is required"
                    )
                ).toBe(true);
            }
        });

        it("should enforce business rule: field length limits", () => {
            const longName = "A".repeat(101);
            const longPosition = "B".repeat(101);

            const employeeWithLongName = {
                name: longName,
                email: "karmalkarchaitanya@gmail.com",
                position: "Engineer",
            };

            const employeeWithLongPosition = {
                name: "Chaitanya Karmalkar",
                email: "karmalkarchaitanya@gmail.com",
                position: longPosition,
            };

            const nameResult =
                employeeValidationSchema.safeParse(employeeWithLongName);
            const positionResult = employeeValidationSchema.safeParse(
                employeeWithLongPosition
            );

            expect(nameResult.success).toBe(false);
            expect(positionResult.success).toBe(false);
        });
    });

    describe("Employee Search Functionality", () => {
        const mockEmployees = [
            {
                id: 1,
                name: "Chaitanya Karmalkar",
                email: "karmalkarchaitanya@gmail.com",
                position: "Software Engineer",
                department: "engineering",
                salary: 95000,
            },
            {
                id: 2,
                name: "Pranav Sawant",
                email: "pranav@company.com",
                position: "Product Manager",
                department: "product",
                salary: 105000,
            },
            {
                id: 3,
                name: "Aditya Karmalkar",
                email: "aditya@company.com",
                position: "UX Designer",
                department: "design",
                salary: 80000,
            },
            {
                id: 4,
                name: "Rahul Bale",
                email: "rahul@company.com",
                position: "Data Scientist",
                department: "engineering",
                salary: 110000,
            },
        ];

        const simulateSearch = (
            employees: typeof mockEmployees,
            searchTerm: string
        ) => {
            if (!searchTerm) return employees;

            return employees.filter(
                (emp) =>
                    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    emp.email
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    emp.position
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    emp.department
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
        };

        it("should find employees by department", () => {
            const engineeringResults = simulateSearch(
                mockEmployees,
                "engineering"
            );
            expect(engineeringResults.length).toBe(2); // Chaitanya and Rahul is used here
            expect(
                engineeringResults.every(
                    (emp) => emp.department === "engineering"
                )
            ).toBe(true);

            const designResults = simulateSearch(mockEmployees, "design");
            expect(designResults.length).toBe(1);
            expect(designResults[0].department).toBe("design");
        });

        it("should find employees by email domain", () => {
            const results = simulateSearch(mockEmployees, "@company.com");
            expect(results.length).toBe(3);
        });

        it("should find employees by position keywords", () => {
            const results = simulateSearch(mockEmployees, "manager");
            expect(results.length).toBe(1);
            expect(results[0].position).toBe("Product Manager");
        });

        it("should handle case-insensitive search", () => {
            const lowerCaseResults = simulateSearch(mockEmployees, "pranav");
            const upperCaseResults = simulateSearch(mockEmployees, "PRANAV");
            const mixedCaseResults = simulateSearch(mockEmployees, "PrAnAv");

            expect(lowerCaseResults.length).toBe(upperCaseResults.length);
            expect(upperCaseResults.length).toBe(mixedCaseResults.length);
            expect(lowerCaseResults.length).toBe(1); // Pranav Sawant is used here
        });

        it("should return empty results for non-matching search", () => {
            const results = simulateSearch(mockEmployees, "nonexistent");
            expect(results.length).toBe(0);
        });

        it("should return all employees when search is empty", () => {
            const results = simulateSearch(mockEmployees, "");
            expect(results.length).toBe(mockEmployees.length);
        });
    });

    describe("Employee Data Processing", () => {
        it("should handle email normalization (as done in forms)", () => {
            const emails = [
                "KARMALKARCHAITANYA@GMAIL.COM",
                "  karmalkarchaitanya@gmail.com  ",
                "KarmalkarChaitanya@Gmail.Com",
            ];

            const normalizedEmails = emails.map((email) =>
                email.trim().toLowerCase()
            );

            expect(normalizedEmails).toEqual([
                "karmalkarchaitanya@gmail.com",
                "karmalkarchaitanya@gmail.com",
                "karmalkarchaitanya@gmail.com",
            ]);
        });

        it("should validate email uniqueness constraint (business rule)", () => {
            const existingEmails = [
                "karmalkarchaitanya@gmail.com",
                "rahul@company.com",
            ];
            const newEmail = "rahul@company.com";

            const isDuplicate = existingEmails.includes(newEmail.toLowerCase());
            expect(isDuplicate).toBe(true);
        });

        it("should validate required field presence", () => {
            const requiredFields = [
                "name",
                "email",
                "position",
                "department",
                "salary",
            ];
            const incompleteData = {
                name: "Chaitanya Karmalkar",
                email: "karmalkarchaitanya@gmail.com",
                department: "engineering",
                salary: 75000,
            };

            const hasAllRequiredFields = requiredFields.every(
                (field) =>
                    incompleteData.hasOwnProperty(field) &&
                    (incompleteData as any)[field] !== "" &&
                    (incompleteData as any)[field] !== null &&
                    (incompleteData as any)[field] !== undefined
            );

            expect(hasAllRequiredFields).toBe(false);
        });
    });

    describe("Error Handling Logic", () => {
        it("should identify validation errors correctly", () => {
            const invalidData = {
                name: "", // Invalid: empty
                email: "invalid-email", // Invalid: format
                position: "A".repeat(101), // Invalid: too long
            };

            const result = employeeValidationSchema.safeParse(invalidData);
            expect(result.success).toBe(false);

            if (!result.success) {
                const errorMessages = result.error.issues.map(
                    (issue) => issue.message
                );
                expect(errorMessages).toContain("Name is required");
                expect(errorMessages).toContain("Invalid email address");
                expect(errorMessages).toContain(
                    "Position must be less than 100 characters"
                );
            }
        });

        it("should handle partial validation failures", () => {
            const partiallyValidData = {
                name: "Chaitanya Karmalkar", // Valid
                email: "invalid-email", // Invalid
                position: "Engineer", // Valid
                department: "engineering", // Valid
                salary: 75000, // Valid
            };

            const result =
                employeeValidationSchema.safeParse(partiallyValidData);
            expect(result.success).toBe(false);

            if (!result.success) {
                expect(result.error.issues.length).toBe(1);
                expect(result.error.issues[0].path).toContain("email");
            }
        });
    });

    describe("API Response Structure Validation", () => {
        it("should structure success responses correctly", () => {
            const mockSuccessResponse = {
                id: 1,
                name: "Chaitanya Karmalkar",
                email: "karmalkarchaitanya@gmail.com",
                position: "Software Engineer",
                department: "engineering",
                salary: 90000,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const requiredFields = [
                "id",
                "name",
                "email",
                "position",
                "department",
                "salary",
                "createdAt",
                "updatedAt",
            ];
            const hasAllFields = requiredFields.every((field) =>
                mockSuccessResponse.hasOwnProperty(field)
            );

            expect(hasAllFields).toBe(true);
            expect(typeof mockSuccessResponse.id).toBe("number");
            expect(typeof mockSuccessResponse.name).toBe("string");
            expect(typeof mockSuccessResponse.email).toBe("string");
            expect(typeof mockSuccessResponse.position).toBe("string");
            expect(mockSuccessResponse.createdAt).toBeInstanceOf(Date);
            expect(mockSuccessResponse.updatedAt).toBeInstanceOf(Date);
        });

        it("should structure error responses correctly", () => {
            const mockErrorResponse = {
                error: "Validation failed",
                issues: [
                    { path: ["name"], message: "Name is required" },
                    { path: ["email"], message: "Invalid email address" },
                ],
            };

            expect(mockErrorResponse).toHaveProperty("error");
            expect(mockErrorResponse).toHaveProperty("issues");
            expect(Array.isArray(mockErrorResponse.issues)).toBe(true);
            expect(mockErrorResponse.issues.length).toBeGreaterThan(0);
        });
    });
});
