import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { Recipient } from "./Recipient";
import { template_type } from "../core/constants/enum";

@Entity()
export class Template extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255, nullable: true, default: "" })
    template_name: string;

    @Column({ 
        type: 'enum', 
        nullable: false,
        enum: template_type,
        enumName: 'template_type'
    })
    type: template_type;

    @Column({ type: 'text', nullable: true, default: "" })
    content: string;

    @ManyToMany(() => Recipient, (recipient) => recipient.templates)
    @JoinTable()
    recipients: Recipient[]

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
    updated_at: Date;
}