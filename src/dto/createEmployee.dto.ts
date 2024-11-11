import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsString,
    ValidateNested,
} from "class-validator";
import { AddressDto } from "./createAddress.dto";
import { Type } from "class-transformer";
import { Role } from "../utils/role.enum";
import CreateDepartmentDto from "./createDepartment.dto";
import { Department } from "../utils/department.enum";

export class EmployeeDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => AddressDto)
    address: AddressDto;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsEnum(Role)
    role: Role;

    @IsNotEmpty()
    @IsEnum(Department)
    department: Department;
}
