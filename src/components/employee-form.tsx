"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { EmployeeFormData, DEPARTMENTS, Department } from "@/types/employee";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";

const employeeFormSchema = z.object({
    name: z
        .string()
        .min(1, "Name is required")
        .max(100, "Name must be less than 100 characters")
        .trim(),
    email: z
        .string()
        .email("Please enter a valid email address")
        .max(255, "Email must be less than 255 characters")
        .trim(),
    position: z
        .string()
        .min(1, "Position is required")
        .max(100, "Position must be less than 100 characters")
        .trim(),
    department: z.string().min(1, "Please select a department"),
    salary: z.string().min(1, "Salary is required"),
});

type FormData = z.infer<typeof employeeFormSchema>;

interface EmployeeFormProps {
    initialData?: EmployeeFormData;
    onSubmit: (data: EmployeeFormData) => Promise<void>;
    onCancel: () => void;
    loading: boolean;
}

export default function EmployeeForm({
    initialData,
    onSubmit,
    onCancel,
    loading,
}: EmployeeFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(employeeFormSchema),
        defaultValues: {
            name: initialData?.name || "",
            email: initialData?.email || "",
            position: initialData?.position || "",
            department: initialData?.department || "",
            salary: initialData?.salary?.toString() || "",
        },
    });

    const handleSubmit = async (data: FormData) => {
        try {
            setIsSubmitting(true);

            const salaryNumber = parseFloat(data.salary);
            if (isNaN(salaryNumber) || salaryNumber < 0) {
                throw new Error("Salary must be a positive number");
            }
            if (salaryNumber > 10000000) {
                throw new Error("Salary must be less than 10,000,000");
            }

            const employeeData: EmployeeFormData = {
                name: data.name,
                email: data.email,
                position: data.position,
                department: data.department as Department,
                salary: salaryNumber,
            };
            await onSubmit(employeeData);
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-6"
                >
                    <div className="space-y-4">
                        <div className="border-b pb-2">
                            <h3 className="text-lg font-semibold text-foreground">
                                Personal Information
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Basic employee details
                            </p>
                        </div>

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter employee's full name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="Enter work email address"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="border-b pb-2">
                            <h3 className="text-lg font-semibold text-foreground">
                                Job Information
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Role and organizational details
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="position"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Job Position</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g. Senior Developer"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="department"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Department</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select department" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {DEPARTMENTS.map((dept) => (
                                                    <SelectItem
                                                        key={dept.value}
                                                        value={dept.value}
                                                    >
                                                        {dept.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="salary"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Annual Salary</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                                                $
                                            </div>
                                            <Input
                                                type="number"
                                                placeholder="50000"
                                                min="0"
                                                step="1000"
                                                className="pl-8"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <div className="text-xs text-muted-foreground">
                                        Enter the annual salary amount
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
                        <Button
                            type="submit"
                            disabled={isSubmitting || loading}
                            className="flex-1 sm:flex-none sm:min-w-[140px]"
                        >
                            {isSubmitting || loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {initialData
                                        ? "Updating..."
                                        : "Creating..."}
                                </>
                            ) : initialData ? (
                                "Update Employee"
                            ) : (
                                "Create Employee"
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={isSubmitting || loading}
                            className="flex-1 sm:flex-none sm:min-w-[100px]"
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
