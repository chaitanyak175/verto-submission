import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search");

        const employees = await prisma.employee.findMany({
            where: search
                ? {
                      OR: [
                          { name: { contains: search } },
                          { email: { contains: search } },
                          { position: { contains: search } },
                          { department: { contains: search } },
                      ],
                  }
                : undefined,
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(employees);
    } catch (error) {
        console.error("Error fetching employees:", error);
        return NextResponse.json(
            { error: "Failed to fetch employees" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const result = employeeSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: "Validation failed", issues: result.error.issues },
                { status: 400 }
            );
        }

        const employee = await prisma.employee.create({
            data: result.data,
        });

        return NextResponse.json(employee, { status: 201 });
    } catch (error: unknown) {
        console.error("Error creating employee:", error);

        if (
            error &&
            typeof error === "object" &&
            "code" in error &&
            error.code === "P2002"
        ) {
            return NextResponse.json(
                { error: "Email already exists" },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: "Failed to create employee" },
            { status: 500 }
        );
    }
}
