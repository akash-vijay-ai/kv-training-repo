import { Repository } from "typeorm";
import Department from "../entity/department.entity";

class DepartmentRepository {
    constructor(private repository: Repository<Department>) {}

    findAllDepartments = async (): Promise<Department[]> => {
        return this.repository.find({ relations: ["employees"] });
    };

    findOneBy = async (
        deptId: Partial<Department>
    ): Promise<Department | null> => {
        return this.repository.findOne({
            where: deptId,
            relations: ["employees"],
        });
    };

    save = async (department: Partial<Department>): Promise<Department> => {
        return this.repository.save(department);
    };

    update = async (department: Partial<Department>) => {
        return this.repository.update({ id: department.id }, department);
    };

    softRemove = (department: Department) => {
        return this.repository.softRemove(department);
    };
}

export default DepartmentRepository;
