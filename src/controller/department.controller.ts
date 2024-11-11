import { plainToClass } from "class-transformer";
import DepartmentService from "../service/department.service";
import { validate } from "class-validator";
import CreateDepartmentDto from "../dto/createDepartment.dto";
import express, { NextFunction, Request, Response, Router } from "express";
import HttpException from "../exeption/http.excption";
import { RequestWithUser } from "../utils/requestWithUser";
import { Role } from "../utils/role.enum";
import IncorrectPasswordException from "../exeption/incorrectPassword.exception";
import { ErrorCodes } from "../utils/error.code";
import EntityNotFoundException from "../exeption/entityNotFound.exception";
import authorize from "../middleware/authorize.middleware";
import Employee from "../entity/employee.entity";

class DepartmentController {
    public router: Router;

    constructor(private departmentService: DepartmentService) {
        this.router = express.Router();
        this.router.get("/", this.getDepartments);
        this.router.get("/:id", this.getDepartmentById);
        this.router.post("/", authorize, this.createDepartment);
        this.router.put("/:id", authorize, this.updateDepartment);
        this.router.delete("/:id", authorize, this.deleteDepartment);
    }

    createDepartment = async (
        req: RequestWithUser,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const department = plainToClass(CreateDepartmentDto, req.body);
            const errors = await validate(department);

            const role = req.role;
            if (role != Role.HR) {
                throw new IncorrectPasswordException(ErrorCodes.UNAUTHORIZED);
            }

            if (errors.length > 0) {
                throw new HttpException(400, JSON.stringify(errors));
            }
            const newDepartment = await this.departmentService.createDepartment(
                department.name,
                department.description
            );
            if (!newDepartment) {
                throw new HttpException(500, "Internal Server Error");
            }
            res.status(201).send(newDepartment);
        } catch (error) {
            next(error);
        }
    };

    getDepartments = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const departments = await this.departmentService.getDepartments();
            if (!departments) {
                throw new HttpException(404, "Departments not found");
            }
            res.status(200).send(departments);
        } catch (error) {
            next(error);
        }
    };

    getDepartmentById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const deptId = parseInt(req.params.id);
            const department = await this.departmentService.getDepartmentById(
                deptId
            );
            if (!department) {
                throw new EntityNotFoundException(
                    ErrorCodes.DEPARTMENT_WITH_ID_NOT_FOUND
                );
            }
            res.status(200).send(department);
        } catch (error) {
            next(error);
        }
    };
    updateDepartment = async (
        req: RequestWithUser,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const role = req.role;
            if (role != Role.HR) {
                throw new IncorrectPasswordException(ErrorCodes.UNAUTHORIZED);
            }
            const deptId = Number(req.params.id);
            const changes = req.body.employees as Employee[];
            const dept = this.departmentService.updateDepartment(
                deptId,
                changes
            );
            res.status(200).send(dept);
        } catch (error) {
            next(error);
        }
    };
    deleteDepartment = async (
        req: RequestWithUser,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const role = req.role;
            if (role != Role.HR) {
                throw new IncorrectPasswordException(ErrorCodes.UNAUTHORIZED);
            }
            const id = Number(req.params.id);
            const deletedDepartment =
                await this.departmentService.deleteDepartment(id);
            res.status(200).send(deletedDepartment);
        } catch (error) {
            next(error);
        }
    };
}

export default DepartmentController;
