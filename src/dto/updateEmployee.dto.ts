import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateNested,
} from "class-validator";
import { AddressDto } from "./createAddress.dto";
import { Type } from "class-transformer";
import { Role } from "../utils/role.enum";
import { Department } from "../utils/department.enum";

export class UpdateEmployeeDto {
    @IsOptional()
    @IsNotEmpty()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    name?: string;

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => AddressDto)
    address?: AddressDto;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    password: string;

    @IsOptional()
    @IsNotEmpty()
    @IsEnum(Role)
    role: Role;

    @IsOptional()
    @IsNotEmpty()
    @IsEnum(Department)
    department: Department;
}
