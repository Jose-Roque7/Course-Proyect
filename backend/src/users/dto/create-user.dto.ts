import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum, isInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
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
    @ApiProperty({ example: 'student'})
    role:UserRole;

    @IsString()
    @IsNotEmpty()
    lastName:string;

    @IsString()
    @IsNotEmpty()
    cellphone:string;

    @IsBoolean()
    @IsOptional()
    status:boolean;

}
