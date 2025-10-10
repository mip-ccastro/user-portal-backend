import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToOne, ManyToMany } from "typeorm";
import { Template } from "./Template";

@Entity()
export class Recipient extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255, nullable: true, default: "" })
    name: string;

    @Column({ type: 'varchar', length: 255, nullable: true, default: "" })
    email: string;

    @Column({ type: 'varchar', length: 255, nullable: true, default: "" })
    phone: string;

    @ManyToMany(() => Template, (template) => template.recipients)
    templates: Template[]

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
    updated_at: Date;
}