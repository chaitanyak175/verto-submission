"use client";

import { useState, useEffect } from "react";
import { Employee } from "@/types/employee";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Loader2,
    User,
    Mail,
    Briefcase,
    Calendar,
    Edit,
    X,
    Building,
    DollarSign,
} from "lucide-react";

interface EmployeeDetailDialogProps {
    employeeId: number | null;
    open: boolean;
    onClose: () => void;
    onEdit?: (employee: Employee) => void;
}

export default function EmployeeDetailDialog({
    employeeId,
    open,
    onClose,
    onEdit,
}: EmployeeDetailDialogProps) {
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    const fetchEmployeeDetails = async (id: number) => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(`/api/employees/${id}`);
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error("Employee not found");
                }
                throw new Error("Failed to fetch employee details");
            }

            const employeeData = await response.json();
            setEmployee(employeeData);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
            setEmployee(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open && employeeId) {
            fetchEmployeeDetails(employeeId);
        } else {
            setEmployee(null);
            setError("");
        }
    }, [open, employeeId]);

    if (!open || !employeeId) {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
                <DialogHeader className="space-y-2 sm:space-y-3">
                    <DialogTitle className="flex items-center gap-2 text-lg sm:text-2xl">
                        <User className="h-4 w-4 sm:h-5 sm:w-5" />
                        Employee Details
                    </DialogTitle>
                    <DialogDescription className="text-sm">
                        Detailed information about the selected employee.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 sm:space-y-4">
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-6 sm:py-8">
                            <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-muted-foreground" />
                            <span className="text-xs sm:text-sm text-muted-foreground mt-2">
                                Loading employee details...
                            </span>
                        </div>
                    )}

                    {error && (
                        <Card className="border-red-200 bg-red-50">
                            <CardContent className="pt-4 sm:pt-6">
                                <div className="flex items-center gap-2 text-red-700">
                                    <X className="h-4 w-4" />
                                    <span className="text-sm">{error}</span>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {employee && !loading && (
                        <div className="space-y-6">
                            <Card>
                                <CardHeader className="pb-4 sm:pb-6">
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                                        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                                            <div className="h-12 w-12 sm:h-16 sm:w-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                                <User className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <CardTitle className="text-base sm:text-2xl font-bold truncate">
                                                    {employee.name}
                                                </CardTitle>
                                                <CardDescription className="text-sm sm:text-lg mt-1">
                                                    <div className="flex flex-wrap gap-2">
                                                        <Badge
                                                            variant="secondary"
                                                            className="text-xs sm:text-sm"
                                                        >
                                                            {employee.position}
                                                        </Badge>
                                                        <Badge
                                                            variant="outline"
                                                            className="text-xs sm:text-sm capitalize"
                                                        >
                                                            {employee.department.replace(
                                                                "-",
                                                                " "
                                                            )}
                                                        </Badge>
                                                    </div>
                                                </CardDescription>
                                            </div>
                                        </div>
                                        {onEdit && (
                                            <Button
                                                onClick={() => onEdit(employee)}
                                                size="sm"
                                                className="gap-2 w-full sm:w-auto mt-2 sm:mt-0"
                                            >
                                                <Edit className="h-4 w-4" />
                                                Edit
                                            </Button>
                                        )}
                                    </div>
                                </CardHeader>
                            </Card>

                            <div className="grid grid-cols-1 gap-4 sm:gap-6">
                                <Card>
                                    <CardHeader className="pb-3 sm:pb-4">
                                        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                            <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
                                            Contact Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3 sm:space-y-4">
                                        <div>
                                            <label className="text-xs sm:text-sm font-medium text-muted-foreground">
                                                Email Address
                                            </label>
                                            <div className="mt-1">
                                                <a
                                                    href={`mailto:${employee.email}`}
                                                    className="text-blue-600 hover:underline font-medium text-sm break-all inline-block max-w-full"
                                                    title={employee.email}
                                                >
                                                    {employee.email}
                                                </a>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-3 sm:pb-4">
                                        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                            <Briefcase className="h-4 w-4 sm:h-5 sm:w-5" />
                                            Job Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3 sm:space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                            <div>
                                                <label className="text-xs sm:text-sm font-medium text-muted-foreground">
                                                    Position
                                                </label>
                                                <div className="mt-1">
                                                    <Badge
                                                        variant="outline"
                                                        className="font-medium text-xs sm:text-sm"
                                                    >
                                                        {employee.position}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs sm:text-sm font-medium text-muted-foreground">
                                                    Department
                                                </label>
                                                <div className="mt-1">
                                                    <Badge
                                                        variant="secondary"
                                                        className="font-medium text-xs sm:text-sm capitalize"
                                                    >
                                                        <Building className="h-3 w-3 mr-1" />
                                                        {employee.department.replace(
                                                            "-",
                                                            " "
                                                        )}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs sm:text-sm font-medium text-muted-foreground">
                                                Salary
                                            </label>
                                            <div className="mt-1">
                                                <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-green-600">
                                                    <DollarSign className="h-4 w-4 sm:h-5 sm:w-5" />
                                                    {employee.salary.toLocaleString()}
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Annual salary
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <Card>
                                <CardHeader className="pb-3 sm:pb-4">
                                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                        <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                                        System Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 sm:space-y-4">
                                    <div className="grid grid-cols-1 gap-3 sm:gap-4">
                                        <div>
                                            <label className="text-xs sm:text-sm font-medium text-muted-foreground">
                                                Employee ID
                                            </label>
                                            <p className="mt-1 font-mono text-xs sm:text-sm bg-muted px-2 py-1 rounded">
                                                #
                                                {employee.id
                                                    .toString()
                                                    .padStart(4, "0")}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-xs sm:text-sm font-medium text-muted-foreground">
                                                Date Created
                                            </label>
                                            <p className="mt-1 text-xs sm:text-sm">
                                                {new Date(
                                                    employee.createdAt
                                                ).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-xs sm:text-sm font-medium text-muted-foreground">
                                                Last Updated
                                            </label>
                                            <p className="mt-1 text-xs sm:text-sm">
                                                {new Date(
                                                    employee.updatedAt
                                                ).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>

                <div className="flex justify-end pt-4">
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
