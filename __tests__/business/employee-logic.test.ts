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

const validateEmployeeData = (data: any) => {
    return employeeSchema.safeParse(data);
};

const sanitizeEmployeeData = (data: any) => {
    return {
        name: data.name?.trim(),
        email: data.email?.trim().toLowerCase(),
        position: data.position?.trim(),
        department: data.department?.trim(),
        salary:
            typeof data.salary === "string"
                ? parseFloat(data.salary)
                : data.salary,
    };
};

const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

describe("Employee Business Logic", () => {
    describe("Employee Data Validation", () => {
        it("should validate complete employee data", () => {
            const validData = {
                name: "Chaitanya Karmalkar",
                email: "karmalkarchaitanya@gmail.com",
                position: "Software Engineer",
                department: "engineering",
                salary: 85000,
            };

            const result = validateEmployeeData(validData);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toEqual(validData);
            }
        });

        it("should reject employee with missing required fields", () => {
            const invalidData = {
                name: "",
                email: "",
                position: "",
                department: "",
                salary: undefined,
            };

            const result = validateEmployeeData(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues).toHaveLength(5);
                expect(result.error.issues.map((i) => i.code)).toContain(
                    "too_small"
                );
            }
        });

        it("should reject employee with invalid email format", () => {
            const testCases = [
                "invalid-email",
                "user@",
                "@domain.com",
                "user@domain",
                "user space@domain.com",
            ];

            testCases.forEach((email) => {
                const result = validateEmployeeData({
                    name: "Test User",
                    email,
                    position: "Developer",
                    department: "engineering",
                    salary: 50000,
                });
                expect(result.success).toBe(false);
                if (!result.success) {
                    expect(result.error.issues[0].code).toBe("invalid_format");
                }
            });
        });

        it("should reject employee with fields exceeding maximum length", () => {
            const longString = "A".repeat(101);

            const testCases = [
                { field: "name", value: longString },
                { field: "position", value: longString },
            ];

            testCases.forEach(({ field, value }) => {
                const data = {
                    name: "Chaitanya Karmalkar",
                    email: "karmalkarchaitanya@gmail.com",
                    position: "Developer",
                    department: "engineering",
                    salary: 50000,
                    [field]: value,
                };

                const result = validateEmployeeData(data);
                expect(result.success).toBe(false);
                if (!result.success) {
                    expect(result.error.issues[0].code).toBe("too_big");
                }
            });
        });
    });

    describe("Data Sanitization", () => {
        it("should trim whitespace from all fields", () => {
            const dirtyData = {
                name: "  Chaitanya Karmalkar  ",
                email: "  KARMALKARCHAITANYA@GMAIL.COM  ",
                position: "  Software Engineer  ",
            };

            const sanitized = sanitizeEmployeeData(dirtyData);

            expect(sanitized.name).toBe("Chaitanya Karmalkar");
            expect(sanitized.email).toBe("karmalkarchaitanya@gmail.com");
            expect(sanitized.position).toBe("Software Engineer");
        });

        it("should convert email to lowercase", () => {
            const data = {
                name: "Chaitanya Karmalkar",
                email: "KARMALKARCHAITANYA@GMAIL.COM",
                position: "Engineer",
            };

            const sanitized = sanitizeEmployeeData(data);
            expect(sanitized.email).toBe("karmalkarchaitanya@gmail.com");
        });

        it("should handle undefined/null values gracefully", () => {
            const data = {
                name: null,
                email: undefined,
                position: "   ",
            };

            const sanitized = sanitizeEmployeeData(data);

            expect(sanitized.name).toBeUndefined();
            expect(sanitized.email).toBeUndefined();
            expect(sanitized.position).toBe("");
        });
    });

    describe("Email Validation Logic", () => {
        it("should validate correct email formats", () => {
            const validEmails = [
                "user@domain.com",
                "test.email@example.org",
                "user+tag@company.co.uk",
                "firstname.lastname@subdomain.example.com",
            ];

            validEmails.forEach((email) => {
                expect(isValidEmail(email)).toBe(true);
            });
        });

        it("should reject invalid email formats", () => {
            const invalidEmails = [
                "plainaddress",
                "@missingdomain.com",
                "missing@.com",
                "missing.domain@.com",
                "two@@domain.com",
                "user name@domain.com",
            ];

            invalidEmails.forEach((email) => {
                expect(isValidEmail(email)).toBe(false);
            });
        });
    });

    describe("Employee Search Logic", () => {
        const employees = [
            {
                id: 1,
                name: "Chaitanya Karmalkar",
                email: "karmalkarchaitanya@gmail.com",
                position: "Software Engineer",
            },
            {
                id: 2,
                name: "Pranav Sawant",
                email: "pranav@gmail.com",
                position: "Product Manager",
            },
            {
                id: 3,
                name: "Rahul Bale",
                email: "rahul@gmail.com",
                position: "Designer",
            },
        ];

        const searchEmployees = (employees: any[], searchTerm: string) => {
            if (!searchTerm) return employees;

            return employees.filter(
                (emp) =>
                    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    emp.email
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    emp.position
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
        };

        it("should find employees by name", () => {
            const results = searchEmployees(employees, "Chaitanya");
            expect(results).toHaveLength(1); // Chaitanya Karmalkar
            expect(results.map((r) => r.name)).toContain("Chaitanya Karmalkar");
        });

        it("should find employees by email", () => {
            const results = searchEmployees(employees, "pranav@");
            expect(results).toHaveLength(1);
            expect(results[0].name).toBe("Pranav Sawant");
        });

        it("should find employees by position", () => {
            const results = searchEmployees(employees, "manager");
            expect(results).toHaveLength(1);
            expect(results[0].position).toBe("Product Manager");
        });

        it("should be case insensitive", () => {
            const results = searchEmployees(employees, "SOFTWARE");
            expect(results).toHaveLength(1);
            expect(results[0].position).toBe("Software Engineer");
        });

        it("should return all employees when search term is empty", () => {
            const results = searchEmployees(employees, "");
            expect(results).toHaveLength(3);
        });

        it("should return empty array when no matches found", () => {
            const results = searchEmployees(employees, "nonexistent");
            expect(results).toHaveLength(0);
        });
    });

    describe("Employee Data Transformation", () => {
        it("should format employee data for display", () => {
            const rawEmployee = {
                id: 1,
                name: "chaitanya karmalkar",
                email: "KARMALKARCHAITANYA@GMAIL.COM",
                position: "software engineer",
                createdAt: new Date("2024-01-01"),
                updatedAt: new Date("2024-01-01"),
            };

            const formatEmployeeForDisplay = (emp: any) => ({
                ...emp,
                name: emp.name
                    .split(" ")
                    .map(
                        (word: string) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase()
                    )
                    .join(" "),
                email: emp.email.toLowerCase(),
                position: emp.position
                    .split(" ")
                    .map(
                        (word: string) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase()
                    )
                    .join(" "),
            });

            const formatted = formatEmployeeForDisplay(rawEmployee);

            expect(formatted.name).toBe("Chaitanya Karmalkar");
            expect(formatted.email).toBe("karmalkarchaitanya@gmail.com");
            expect(formatted.position).toBe("Software Engineer");
        });
    });

    describe("Employee Validation Rules", () => {
        it("should enforce minimum name length", () => {
            const result = validateEmployeeData({
                name: "A",
                email: "test@company.com",
                position: "Developer",
                department: "engineering",
                salary: 50000,
            });

            expect(result.success).toBe(true); // Single character is valid only
        });

        it("should enforce maximum name length", () => {
            const longName = "A".repeat(100); // Exactly 100 characters
            const result = validateEmployeeData({
                name: longName,
                email: "test@company.com",
                position: "Developer",
                department: "engineering",
                salary: 50000,
            });

            expect(result.success).toBe(true); // 100 characters should be valid

            const tooLongName = "A".repeat(101); // 101 characters
            const result2 = validateEmployeeData({
                name: tooLongName,
                email: "test@company.com",
                position: "Developer",
                department: "engineering",
                salary: 50000,
            });

            expect(result2.success).toBe(false); // 101 characters should be invalid
        });

        it("should require all fields to be present", () => {
            const requiredFields = [
                "name",
                "email",
                "position",
                "department",
                "salary",
            ];

            requiredFields.forEach((field) => {
                const data = {
                    name: "Chaitanya Karmalkar",
                    email: "karmalkarchaitanya@gmail.com",
                    position: "Developer",
                    department: "engineering",
                    salary: 50000,
                };

                delete (data as any)[field];

                const result = validateEmployeeData(data);
                expect(result.success).toBe(false);
            });
        });
    });
});
