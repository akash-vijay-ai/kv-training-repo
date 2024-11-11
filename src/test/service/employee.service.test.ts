import Employee from "../../entity/employee.entity";
import EmployeeService from "../../service/employee.service";
import EmployeeRepository from "../../repository/employee.repository";
import { when } from "jest-when";
import bcrypt from "bcrypt";
import { Role } from "../../utils/role.enum";
import { UpdateEmployeeDto } from "../../dto/updateEmployee.dto";
import { plainToInstance } from "class-transformer";

describe("Employee Service Test", () => {
    let employeeService: EmployeeService;
    let employeeRepository: EmployeeRepository;

    beforeAll(() => {
        const dataSource = {
            getRepository: jest.fn(),
        };
        employeeRepository = new EmployeeRepository(
            dataSource.getRepository(Employee)
        ) as jest.Mocked<EmployeeRepository>;
        employeeService = new EmployeeService(employeeRepository);
    });

    it("should get empty response", async () => {
        employeeRepository.find = jest.fn().mockResolvedValueOnce([]);
        const employees = await employeeService.findAll();
        expect(employees).toEqual([]);
    });

    it("should return employee details as per given id", async () => {
        const mockedFunction = jest.fn();
        when(mockedFunction).calledWith({ id: 1 }).mockResolvedValue({
            id: 1,
            name: "Alexnader",
            email: "alex@gmail.com",
        });
        employeeRepository.findOneBy = mockedFunction;
        const user = await employeeService.findById(1);
        expect(user).toEqual({
            id: 1,
            name: "Alexnader",
            email: "alex@gmail.com",
        });
        expect(mockedFunction).toHaveBeenCalledTimes(1);
    });

    it("should delete and return deleted status", async () => {
        const mockedDelete = jest.fn();
        when(mockedDelete)
            .calledWith({
                id: 1,
                name: "Alexnader",
                email: "alex@gmail.com",
            })
            .mockResolvedValue({ status: "deleted" });
        employeeRepository.softRemove = mockedDelete;
        const deleted = await employeeService.deleteEmployee(1);
        expect(deleted).toEqual({
            status: "deleted",
        });
    });

    it("should create an employee with given details", async () => {
        const mockedSave = jest.fn();
        const testEmployee = {
            id: 2,
            name: "Test name",
            email: "test@gmail.com",
            password: "password",
            role: Role.HR,
            department: 1,
            address: {
                line1: "Address",
                pincode: "12345",
            },
        };
        const expectedResult = {
            id: 2,
            createdAt: "2024-11-07T03:48:39.674Z",
            updatedAt: "2024-11-11T02:32:36.941Z",
            deletedAt: null,
            email: "test@gmail.com",
            name: "Test name",
            password:
                "$2b$10$NULnuGssYbD8q/l26s3Ebu/swHnkhF.BuvlsA1M5tKTaXRMG0U1dG",
            role: "HR",
            address: {
                id: 1,
                createdAt: "2024-11-07T03:48:39.674Z",
                updatedAt: "2024-11-07T03:48:39.674Z",
                deletedAt: null,
                line1: "Address",
                pincode: "12345",
                employeeId: 2,
            },
            department: {
                id: 1,
                createdAt: "2024-11-10T11:26:22.932Z",
                updatedAt: "2024-11-10T11:26:22.932Z",
                deletedAt: null,
                name: "HR",
                description: "Human Resources",
            },
        };
        when(mockedSave).mockResolvedValue(expectedResult);
        employeeRepository.save = mockedSave;

        const bcryptMock = jest.fn();
        when(bcryptMock).mockResolvedValue(true);
        bcrypt.compare = bcryptMock;

        const newEmployee = await employeeService.createEmployee(
            testEmployee.name,
            testEmployee.email,
            testEmployee.address,
            testEmployee.password,
            testEmployee.role,
            testEmployee.department
        );

        expect(newEmployee).toEqual(expectedResult);
    });

    it("should update employee with given details", async () => {
        const findResult = {
            id: 2,
            createdAt: "2024-11-07T03:48:39.674Z",
            updatedAt: "2024-11-11T02:32:36.941Z",
            deletedAt: null,
            email: "test@gmail.com",
            name: "Test name",
            password:
                "$2b$10$NULnuGssYbD8q/l26s3Ebu/swHnkhF.BuvlsA1M5tKTaXRMG0U1dG",
            role: "HR",
            address: {
                id: 1,
                createdAt: "2024-11-07T03:48:39.674Z",
                updatedAt: "2024-11-07T03:48:39.674Z",
                deletedAt: null,
                line1: "Address",
                pincode: "12345",
                employeeId: 2,
            },
            department: {
                id: 1,
                createdAt: "2024-11-10T11:26:22.932Z",
                updatedAt: "2024-11-10T11:26:22.932Z",
                deletedAt: null,
                name: "HR",
                description: "Human Resources",
            },
        };
        const mockedFind = jest.fn();
        when(mockedFind).calledWith({ id: 2 }).mockResolvedValue(findResult);
        employeeRepository.findOneBy = mockedFind;

        const updatesToBeDone = {
            name: "New Name",
            address: {
                line1: "New Address",
                pincode: "111111",
            },
        };
        const newEmp = plainToInstance(UpdateEmployeeDto, updatesToBeDone);
        const expectedResult = {
            id: 2,
            createdAt: "2024-11-07T03:48:39.674Z",
            updatedAt: "2024-11-11T02:32:36.941Z",
            deletedAt: null,
            email: "test@gmail.com",
            name: "New Name",
            password: "hashedNewPassword",
            role: "HR",
            address: {
                id: 1,
                createdAt: "2024-11-07T03:48:39.674Z",
                updatedAt: "2024-11-07T03:48:39.674Z",
                deletedAt: null,
                line1: "New Address",
                pincode: "111111",
                employeeId: 2,
            },
            department: {
                id: 1,
                createdAt: "2024-11-10T11:26:22.932Z",
                updatedAt: "2024-11-10T11:26:22.932Z",
                deletedAt: null,
                name: "HR",
                description: "Human Resources",
            },
        };

        const mockedHash = jest.fn();
        when(mockedHash)
            .calledWith("password", 10)
            .mockResolvedValue("hashedNewPassword");
        bcrypt.hash = mockedHash;

        const mockedSave = jest.fn();
        when(mockedSave)
            .calledWith(expectedResult)
            .mockResolvedValue(expectedResult);
        employeeRepository.save = mockedSave;

        const mockedAssign = jest.fn();
        when(mockedAssign)
            .calledWith(findResult, updatesToBeDone)
            .mockResolvedValue(expectedResult);
        Object.assign = mockedAssign;

        const result = await employeeService.updateEmployee(2, newEmp);
        expect(result).toEqual(expectedResult);
    });

    it("should throw not found exception when employee not found", async () => {
        const mockedFunction = jest.fn();
        when(mockedFunction)
            .calledWith({ email: "abc@yopmail.com" })
            .mockResolvedValue(null);
        employeeRepository.findOneBy = mockedFunction;
        try {
            await employeeService.loginEmployee("abc@yopmail.com", "password");
        } catch (err) {
            expect(err).toEqual(new Error("Employee not found"));
        }
    });

    it("should throw password mismatch if password mismatch", async () => {
        const bcryptMock = jest.fn();
        when(bcryptMock)
            .calledWith("password", "11111111")
            .mockResolvedValue(false);
        bcrypt.compare = bcryptMock;

        const mockedFunction = jest.fn();
        when(mockedFunction)
            .calledWith({ email: "abc@yopmail.com" })
            .mockResolvedValue({
                email: "abc@yopmail.com",
                password: "password",
            });
        employeeRepository.findOneBy = mockedFunction;
        try {
            await employeeService.loginEmployee("abc@yopmail.com", "password");
        } catch (err) {
            expect(err).toEqual(new Error("Incorrect Password"));
        }
    });
});
