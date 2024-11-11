import { IsNotEmpty, IsString } from "class-validator";

export class AddressDto {
    @IsNotEmpty()
    @IsString()
    line1: string;

    @IsNotEmpty()
    @IsString()
    pincode: string;
}
