
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Auth extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 500 })
    access_token: string;

    @Column({ type: 'varchar', length: 500 })
    refresh_token: string;
    
    @Column({ type: 'varchar', length: 500 })
    id_token: string;

    @OneToOne(() => User, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @CreateDateColumn()
    created_date: Date;

    @UpdateDateColumn({
        nullable: true,
    })
    updated_date: Date;
}