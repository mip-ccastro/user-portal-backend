import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { Form } from "./Form";
import { User } from "./User";

@Entity()
export class Submission extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'jsonb', nullable: true, default: () => "'{}'" })
    submission_data: string;

    @ManyToOne(() => Form, (form) => form.submissions)
    form: Form

    @ManyToOne(() => User, (user) => user.submissions, { nullable: false })
    user: User

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
    updated_at: Date;
}