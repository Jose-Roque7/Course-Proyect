import { UserRole } from "src/common/enums/userRole.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('Users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', unique: true })
    user: string;

    @Column({ type: 'text' })
    password: string;

    @Column({ type: 'text' })
    name: string;

    @Column({ type: 'text' })
    lastName: string;

    @Column({ type: 'text' })
    cellphone: string;
    
    @Column({ type: 'enum', enum: Object.values(UserRole), default: UserRole.STUDENT })
    role: UserRole;

    @Column({ type: 'boolean', default: true })
    status: boolean;

    @Column({ 
        type: 'int', 
        default: 1 
    })
    tokenVersion: number;

    @UpdateDateColumn()
    updatedAt: Date;

    @CreateDateColumn()
    createdAt: Date;
}
