import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from "typeorm";
import { Schema } from "../core/constants/types/form.types";
import { Template } from "./Template";

@Entity()
export class Form extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255, nullable: true, default: "" })
    form_name: string;

    @Column({ type: 'varchar', length: 255, nullable: true, default: "" })
    form_description: string;

    @Column({ type: 'jsonb', nullable: true, default: () => "'[]'" })
    form_fields: Schema[];

    @OneToMany(() => Template, (template) => template.form)
    templates: Template[];

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
    updated_at: Date;
}