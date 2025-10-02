import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, OneToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from "typeorm";
import { User_Credentials } from "./User_Credential";
import { user_role } from "../core/constants/enum";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    user_id: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    first_name: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    last_name: string;

    @Column({ 
        type: 'enum', 
        nullable: false,
        enum: user_role,
        enumName: 'user_role'
    })
    user_role: user_role;

    @Column({ type: 'integer', nullable: false, default: 0 })
    user_status: number;

    @Column({ type: 'boolean', nullable: false, default: false })
    is_authorized: boolean;

    @OneToOne(() => User_Credentials, (user_credentials) => user_credentials.user , { nullable: false })
    user_credentials: User_Credentials

    @Column({ type: 'varchar', length: 100, nullable: true })
    updated_by: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
    updated_at: Date;
}