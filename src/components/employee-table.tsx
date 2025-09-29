"use client";

import { Employee } from "@/types/employee";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    Edit,
    Trash2,
    Mail,
    User,
    Briefcase,
    Eye,
    Building,
    DollarSign,
} from "lucide-react";

interface EmployeeTableProps {
    employees: Employee[];
    loading: boolean;
    onEdit: (employee: Employee) => void;
    onDelete: (employee: Employee) => void;
    onViewDetails?: (employeeId: number) => void;
}

export default function EmployeeTable({
    employees,
    loading,
    onEdit,
    onDelete,
    onViewDetails,
}: EmployeeTableProps) {
    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="text-muted-foreground">
                    Loading employees...
                </div>
            </div>
        );
    }

    if (employees.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-semibold mb-2">No employees found</p>
                <p>Get started by adding your first employee.</p>
            </div>
        );
    }

    return (
        <>
            {/* Mobile Card View */}
            <div className="block sm:hidden space-y-4">
                {employees.map((employee) => (
                    <div
                        key={employee.id}
                        className="border rounded-lg p-4 bg-card"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                                    <User className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-base">
                                        {employee.name}
                                    </h3>
                                    <Badge
                                        variant="secondary"
                                        className="text-xs mt-1"
                                    >
                                        {employee.position}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4 space-y-2">
                            <a
                                href={`mailto:${employee.email}`}
                                className="text-blue-600 hover:underline flex items-center gap-2 text-sm"
                            >
                                <Mail className="h-4 w-4" />
                                {employee.email}
                            </a>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Building className="h-4 w-4" />
                                <Badge
                                    variant="outline"
                                    className="text-xs capitalize"
                                >
                                    {employee.department.replace("-", " ")}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <DollarSign className="h-4 w-4" />
                                <span className="font-medium">
                                    ${employee.salary.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-1 pt-2 border-t">
                            {onViewDetails && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onViewDetails(employee.id)}
                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex-1 text-xs"
                                >
                                    <Eye className="h-3 w-3 mr-1" />
                                    View
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onEdit(employee)}
                                className="flex-1 text-xs"
                            >
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onDelete(employee)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-1 text-xs"
                            >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Delete
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block rounded-md border overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px]">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Name
                                </div>
                            </TableHead>
                            <TableHead>
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    Email
                                </div>
                            </TableHead>
                            <TableHead>
                                <div className="flex items-center gap-2">
                                    <Briefcase className="h-4 w-4" />
                                    Position
                                </div>
                            </TableHead>
                            <TableHead>
                                <div className="flex items-center gap-2">
                                    <Building className="h-4 w-4" />
                                    Department
                                </div>
                            </TableHead>
                            <TableHead>
                                <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4" />
                                    Salary
                                </div>
                            </TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {employees.map((employee) => (
                            <TableRow key={employee.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 bg-muted rounded-full flex items-center justify-center">
                                            <User className="h-4 w-4" />
                                        </div>
                                        {employee.name}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <a
                                        href={`mailto:${employee.email}`}
                                        className="text-blue-600 hover:underline flex items-center gap-1"
                                    >
                                        {employee.email}
                                    </a>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant="secondary"
                                        className="font-normal"
                                    >
                                        {employee.position}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className="font-normal capitalize"
                                    >
                                        {employee.department.replace("-", " ")}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <span className="font-medium">
                                        ${employee.salary.toLocaleString()}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {onViewDetails && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    onViewDetails(employee.id)
                                                }
                                                className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                title="View Details"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        )}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onEdit(employee)}
                                            className="h-8 w-8 p-0"
                                            title="Edit Employee"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onDelete(employee)}
                                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                            title="Delete Employee"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}
