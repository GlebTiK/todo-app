import { IsInt, IsOptional, IsString, Max, Min, IsObject, IsNotEmpty } from 'class-validator'

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  description: string

  @IsInt()
  @Min(0)
  @Max(10)
  severity: number

  @IsOptional()
  @IsObject()
  customFields?: any
}
