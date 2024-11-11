import { IsNotEmpty, IsString } from "class-validator";

class CreateDepartmentDto {
    @IsString()
    name: string;

    @IsString()
    description: string;
}

export default CreateDepartmentDto;
