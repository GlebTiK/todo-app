import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards, ParseIntPipe, Delete } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt.guard'
import { TasksService } from './tasks.service'
import { CreateTaskDto } from './dto/create-task.dto'
import { UpdateTaskDto } from './dto/update-task.dto'
import { ReorderDto } from './dto/reorder.dto'

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private tasks: TasksService) {}

  @Get()
  async list(@Req() req: any, @Query('page') page = '1', @Query('limit') limit = '10') {
    return this.tasks.paginate(req.user.userId, Number(page), Number(limit))
  }

  @Get(':id')
  async one(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.tasks.findOne(req.user.userId, id)
  }

  @Post()
  async create(@Req() req: any, @Body() dto: CreateTaskDto) {
    return this.tasks.create(req.user.userId, dto)
  }

  @Patch(':id')
  async update(@Req() req: any, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTaskDto) {
    return this.tasks.update(req.user.userId, id, dto)
  }

  @Delete(':id')
  async remove(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.tasks.remove(req.user.userId, id)
  }

  @Patch('reorder/list')
  async reorder(@Req() req: any, @Body() dto: ReorderDto) {
    return this.tasks.reorder(req.user.userId, dto.orderedIds, dto.offset)
  }
}
