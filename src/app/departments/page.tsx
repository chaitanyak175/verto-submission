"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Building2,
    Users,
    DollarSign,
    Search,
    Filter,
    MoreVertical,
    UserPlus,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Employee {
    id: number;
    name: string;
    email: string;
    position: string;
    department: string;
    salary: number;
}

interface DepartmentStats {
    name: string;
    employeeCount: number;
    averageSalary: number;
    totalSalary: number;
    employees: Employee[];
}

export default function DepartmentsPage() {
    const [departments, setDepartments] = useState<DepartmentStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("name");

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await fetch("/api/employees");
                const employees = await response.json();

                if (Array.isArray(employees)) {
                    const departmentMap = new Map<string, Employee[]>();

                    employees.forEach((emp: Employee) => {
                        if (!departmentMap.has(emp.department)) {
                            departmentMap.set(emp.department, []);
                        }
                        departmentMap.get(emp.department)!.push(emp);
                    });

                    const departmentStats: DepartmentStats[] = Array.from(
                        departmentMap.entries()
                    ).map(([name, employeeList]) => {
                        const totalSalary = employeeList.reduce(
                            (sum, emp) => sum + emp.salary,
                            0
                        );
                        const averageSalary = totalSalary / employeeList.length;

                        return {
                            name,
                            employeeCount: employeeList.length,
                            averageSalary,
                            totalSalary,
                            employees: employeeList,
                        };
                    });

                    setDepartments(departmentStats);
                }
            } catch (error) {
                console.error("Error fetching departments:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDepartments();
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    const formatDepartmentName = (department: string) => {
        return department
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    const getDepartmentColor = (department: string) => {
        const colors = {
            engineering: "bg-blue-100 text-blue-800",
            product: "bg-green-100 text-green-800",
            design: "bg-purple-100 text-purple-800",
            marketing: "bg-pink-100 text-pink-800",
            sales: "bg-orange-100 text-orange-800",
            "human resources": "bg-yellow-100 text-yellow-800",
        };
        return (
            colors[department as keyof typeof colors] ||
            "bg-gray-100 text-gray-800"
        );
    };

    const filteredDepartments = departments.filter((dept) =>
        dept.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedDepartments = [...filteredDepartments].sort((a, b) => {
        switch (sortBy) {
            case "employees":
                return b.employeeCount - a.employeeCount;
            case "salary":
                return b.averageSalary - a.averageSalary;
            case "total":
                return b.totalSalary - a.totalSalary;
            default:
                return a.name.localeCompare(b.name);
        }
    });

    if (loading) {
        return (
            <div>
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div
                                key={i}
                                className="h-48 bg-gray-200 rounded"
                            ></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Departments
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Manage organizational departments and track employee
                    distribution
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search departments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-48">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="employees">
                            Employee Count
                        </SelectItem>
                        <SelectItem value="salary">Average Salary</SelectItem>
                        <SelectItem value="total">Total Salary</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {sortedDepartments.map((dept) => (
                    <Card
                        key={dept.name}
                        className="hover:shadow-lg transition-shadow"
                    >
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Building2 className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">
                                            {formatDepartmentName(dept.name)}
                                        </CardTitle>
                                        <Badge
                                            variant="secondary"
                                            className={getDepartmentColor(
                                                dept.name
                                            )}
                                        >
                                            {dept.employeeCount} employee
                                            {dept.employeeCount !== 1
                                                ? "s"
                                                : ""}
                                        </Badge>
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                            <Users className="h-4 w-4 mr-2" />
                                            View Employees
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <UserPlus className="h-4 w-4 mr-2" />
                                            Add Employee
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center justify-center mb-1">
                                        <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                                    </div>
                                    <div className="text-lg font-semibold text-gray-900">
                                        {formatCurrency(dept.averageSalary)}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Avg. Salary
                                    </div>
                                </div>
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center justify-center mb-1">
                                        <DollarSign className="h-4 w-4 text-blue-600 mr-1" />
                                    </div>
                                    <div className="text-lg font-semibold text-gray-900">
                                        {formatCurrency(dept.totalSalary)}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Total Cost
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="text-sm font-medium text-gray-700 mb-2 dark:text-white">
                                    Recent Employees
                                </div>
                                <div className="space-y-2">
                                    {dept.employees
                                        .slice(0, 3)
                                        .map((employee) => (
                                            <div
                                                key={employee.id}
                                                className="flex items-center justify-between p-2 bg-white border rounded dark:text-black"
                                            >
                                                <div>
                                                    <div className="font-medium text-sm">
                                                        {employee.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {employee.position}
                                                    </div>
                                                </div>
                                                <div className="text-sm font-medium">
                                                    {formatCurrency(
                                                        employee.salary
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    {dept.employees.length > 3 && (
                                        <div className="text-xs text-gray-500 text-center py-1">
                                            +{dept.employees.length - 3} more
                                            employees
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {sortedDepartments.length === 0 && !loading && (
                <div className="text-center py-12">
                    <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No departments found
                    </h3>
                    <p className="text-gray-500">
                        {searchTerm
                            ? "Try adjusting your search criteria."
                            : "Start by adding employees to create departments."}
                    </p>
                </div>
            )}
        </div>
    );
}
