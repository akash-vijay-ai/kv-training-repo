import express, { NextFunction, Request, Response } from "express";
import EmployeeService from "../service/employee.service";
import HttpException from "../exeption/http.excption";
import { EmployeeDto } from "../dto/createEmployee.dto";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { UpdateEmployeeDto } from "../dto/updateEmployee.dto";
import authorize from "../middleware/authorize.middleware";
import { RequestWithUser } from "../utils/requestWithUser";
import { Role } from "../utils/role.enum";
import IncorrectPasswordException from "../exeption/incorrectPassword.exception";
import { ErrorCodes } from "../utils/error.code";

class EmployeeController {
    public router: express.Router;

    constructor(private employeeService: EmployeeService) {
        this.router = express.Router();

        this.router.get("/", this.getAllEmployees);
        this.router.get("/:id", this.getEmployeeById);
        this.router.post("/", authorize, this.createEmployee);
        this.router.put("/:id", authorize, this.updateEmployee);
        this.router.delete("/:id", authorize, this.deleteEmployee);
        this.router.post("/login", this.loginEmployee);
    }

    getAllEmployees = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const employees = await this.employeeService.findAll();
            if (!employees) {
                throw new HttpException(404, "No Employees Found");
            }
            res.status(200).send(employees);
        } catch (error) {
            next(error);
        }
    };

    getEmployeeById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const employeeId = Number(req.params.id);
            const employee = await this.employeeService.findById(employeeId);
            if (!employee) {
                const error = new HttpException(
                    404,
                    `No employee found with id: ${req.params.id}`
                );
                throw error;
            }
            res.status(200).send(employee);
        } catch (error) {
            next(error);
        }
    };

    createEmployee = async (
        req: RequestWithUser,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const role = req.role;
            if (role != Role.HR) {
                throw new IncorrectPasswordException(ErrorCodes.UNAUTHORIZED);
            }

            const employee = plainToInstance(EmployeeDto, req.body);
            const errors = await validate(employee);

            if (errors.length > 0) {
                console.log(JSON.stringify(errors));
                throw new HttpException(400, JSON.stringify(errors));
            }
            const newEmployee = await this.employeeService.createEmployee(
                employee.name,
                employee.email,
                employee.address,
                employee.password,
                employee.role,
                employee.department
            );
            res.status(200).send(newEmployee);
        } catch (err) {
            next(err);
        }
    };

    updateEmployee = async (
        req: RequestWithUser,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const role = req.role;
            if (role != Role.HR) {
                throw new IncorrectPasswordException(ErrorCodes.UNAUTHORIZED);
            }

            const employee = plainToInstance(UpdateEmployeeDto, req.body);
            const errors = await validate(employee);

            if (errors.length > 0) {
                console.log(JSON.stringify(errors));
                throw new HttpException(400, JSON.stringify(errors));
            }

            // const changes: any = { ...req.body };
            const id = Number(req.params.id);

            const updatedEmp = await this.employeeService.updateEmployee(
                id,
                employee
            );
            res.status(200).send(updatedEmp);
        } catch (error) {
            next(error);
        }
    };

    deleteEmployee = async (
        req: RequestWithUser,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const role = req.role;
            if (role != Role.HR) {
                throw new IncorrectPasswordException(ErrorCodes.UNAUTHORIZED);
            }
            const empid = Number(req.params.id);
            const deleteResult = await this.employeeService.deleteEmployee(
                empid
            );
            res.status(200).send(deleteResult);
        } catch (error) {
            next(error);
        }
    };

    loginEmployee = async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;
        try {
            const token = await this.employeeService.loginEmployee(
                email,
                password
            );
            res.status(200).send({ data: token });
        } catch (error) {
            next(error);
        }
    };
}

export default EmployeeController;
