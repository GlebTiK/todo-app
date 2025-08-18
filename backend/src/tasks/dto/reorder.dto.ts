import { ArrayNotEmpty, IsArray, IsInt, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class ReorderDto {
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Number)
  orderedIds: number[]

  @IsInt()
  @Min(0)
  @Type(() => Number)
  offset: number
}
