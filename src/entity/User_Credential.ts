import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";


@Entity()
export class User_Credentials extends BaseEntity {
    @PrimaryGeneratedColumn()
    user_credential_id: number;
    
    @OneToOne(() => User, { cascade: true, onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'user_id' })
    user: User

    @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
    username: string;

    @Column({ type: 'varchar', length: 100, nullable: false })
    password: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    updated_by: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
    updated_at: Date;
}