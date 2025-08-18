import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm'
import { User } from '../users/user.entity'

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number

  @Index()
  @Column()
  userId: number

  @ManyToOne(() => User, u => u.tasks, { onDelete: 'CASCADE' })
  user: User

  @Column({ type: 'int', default: 0 })
  position: number

  @Column()
  name: string

  @Column({ type: 'text', default: '' })
  description: string

  @Column({ type: 'int', default: 0 })
  severity: number

  @Column({ type: 'jsonb', default: {} })
  customFields: any

  @Column({ type: 'bool', default: false })
  completed: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
