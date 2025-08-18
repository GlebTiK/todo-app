import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { Task } from './task.entity'
import { CreateTaskDto } from './dto/create-task.dto'
import { UpdateTaskDto } from './dto/update-task.dto'

@Injectable()
export class TasksService {
  constructor(@InjectRepository(Task) private repo: Repository<Task>) {}

  async paginate(userId: number, page: number, limit: number) {
    const [items, total] = await this.repo.findAndCount({
      where: { userId },
      order: { position: 'ASC', id: 'ASC' },
      skip: (page - 1) * limit,
      take: limit
    })
    return { items, total, page, limit }
  }

  async findOne(userId: number, id: number) {
    const task = await this.repo.findOne({ where: { id, userId } })
    if (!task) throw new NotFoundException()
    return task
  }

  async create(userId: number, dto: CreateTaskDto) {
    const max = await this.repo
      .createQueryBuilder('t')
      .select('MAX(t.position)', 'max')
      .where('t.userId = :userId', { userId })
      .getRawOne<{ max: number | null }>()
    const position = (max?.max ?? -1) + 1
    const task = this.repo.create({ ...dto, userId, position })
    return this.repo.save(task)
  }

  async update(userId: number, id: number, dto: UpdateTaskDto) {
    const t = await this.findOne(userId, id)
    const next = { ...t, ...dto }
    Object.assign(t, next)
    return this.repo.save(t)
  }

  async remove(userId: number, id: number) {
    const t = await this.findOne(userId, id)
    await this.repo.remove(t)
    return { ok: true }
  }

  async reorder(userId: number, orderedIds: number[], offset: number) {
    const tasks = await this.repo.find({ where: { id: In(orderedIds), userId } })
    const byId = new Map(tasks.map(t => [t.id, t]))
    orderedIds.forEach((id, i) => {
      const t = byId.get(id)
      if (t) t.position = offset + i
    })
    await this.repo.save(Array.from(byId.values()))
    return { ok: true }
  }
}
