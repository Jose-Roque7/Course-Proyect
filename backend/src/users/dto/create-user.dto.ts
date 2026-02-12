import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, isInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { UserRole } from "src/common/enums/userRole.enum";

export class CreateUserDto {

    @IsString()
    @IsNotEmpty()
    user:string;

    @IsString()
    @IsNotEmpty()
    password:string;

    @IsString()
    @IsNotEmpty()
    name:string;

    @IsEnum(UserRole)
    @IsNotEmpty()
    @ApiProperty({ example: 'user'})
    role:UserRole;

    @IsString()
    @IsNotEmpty()
    lastName:string;

    @IsString()
    @IsNotEmpty()
    cellphone:string;

}
