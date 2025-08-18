import { IsInt, IsOptional, IsString, Max, Min, IsObject, IsBoolean, IsNotEmpty } from 'class-validator'

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  severity?: number

  @IsOptional()
  @IsObject()
  customFields?: any

  @IsOptional()
  @IsBoolean()
  completed?: boolean
}
