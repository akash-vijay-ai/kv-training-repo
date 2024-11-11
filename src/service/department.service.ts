import Department from "../entity/department.entity";
import Employee from "../entity/employee.entity";
import HttpException from "../exeption/http.excption";
import DepartmentRepository from "../repository/department.repository";

class DepartmentService {
    constructor(private departmentRepository: DepartmentRepository) {}

    createDepartment = async (
        name: string,
        description: string
    ): Promise<Department> => {
        const department = new Department();
        department.name = name;
        department.description = description;
        return this.departmentRepository.save(department);
    };

    getDepartments = async (): Promise<Department[]> => {
        return this.departmentRepository.findAllDepartments();
    };

    updateDepartment = async (
        id: number,
        employees: Employee[]
    ): Promise<Department> => {
        const dept = await this.departmentRepository.findOneBy({ id });
        employees.forEach((employee) => {
            dept.employees.push(employee);
        });
        return this.departmentRepository.save(dept);
    };

    getDepartmentById = async (id: number): Promise<Department | null> => {
        return this.departmentRepository.findOneBy({ id });
    };

    deleteDepartment = async (id: number) => {
        const department = await this.departmentRepository.findOneBy({ id });
        if (department.employees.length > 0) {
            throw new HttpException(
                409,
                "Department with active employees cannot be deleted"
            );
        }
        return this.departmentRepository.softRemove(department);
    };
}

export default DepartmentService;
