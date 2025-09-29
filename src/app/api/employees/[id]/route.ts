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

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const employeeId = parseInt(id);

        if (isNaN(employeeId)) {
            return NextResponse.json(
                { error: "Invalid employee ID" },
                { status: 400 }
            );
        }

        const employee = await prisma.employee.findUnique({
            where: { id: employeeId },
        });

        if (!employee) {
            return NextResponse.json(
                { error: "Employee not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(employee);
    } catch (error) {
        console.error("Error fetching employee:", error);
        return NextResponse.json(
            { error: "Failed to fetch employee" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const employeeId = parseInt(id);

        if (isNaN(employeeId)) {
            return NextResponse.json(
                { error: "Invalid employee ID" },
                { status: 400 }
            );
        }

        const body = await request.json();

        const result = employeeSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: "Validation failed", issues: result.error.issues },
                { status: 400 }
            );
        }

        const employee = await prisma.employee.update({
            where: { id: employeeId },
            data: result.data,
        });

        return NextResponse.json(employee);
    } catch (error: unknown) {
        console.error("Error updating employee:", error);

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

        if (
            error &&
            typeof error === "object" &&
            "code" in error &&
            error.code === "P2025"
        ) {
            return NextResponse.json(
                { error: "Employee not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { error: "Failed to update employee" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const employeeId = parseInt(id);

        if (isNaN(employeeId)) {
            return NextResponse.json(
                { error: "Invalid employee ID" },
                { status: 400 }
            );
        }

        await prisma.employee.delete({
            where: { id: employeeId },
        });

        return NextResponse.json({ message: "Employee deleted successfully" });
    } catch (error: unknown) {
        console.error("Error deleting employee:", error);

        if (
            error &&
            typeof error === "object" &&
            "code" in error &&
            error.code === "P2025"
        ) {
            return NextResponse.json(
                { error: "Employee not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { error: "Failed to delete employee" },
            { status: 500 }
        );
    }
}
