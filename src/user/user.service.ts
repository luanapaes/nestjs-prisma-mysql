import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdatePutUserDTO } from "./dto/update-put.user.dto";
import { UpdatePatchUserDTO } from "./dto/update-patch-user.dto";
import * as bcrypt from "bcrypt";


@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: CreateUserDTO) {
        const salt = await bcrypt.genSalt();

        data.password = await bcrypt.hash(data.password, salt);

        return this.prisma.user.create({
            data,
        })
    }

    async list() {

        return this.prisma.user.findMany();

    }

    async listOne(id: number) {
        await this.exists(id)

        return this.prisma.user.findUnique({
            where: {
                id
            }
        })

    }

    async update(id: number, { username, email, password, birthAt, role }: UpdatePutUserDTO) {

        await this.exists(id)

        
        const salt = await bcrypt.genSalt();
        password = await bcrypt.hash(password, salt);

        return this.prisma.user.update({
            data: {
                username, email, password, birthAt: birthAt ? new Date(birthAt) : null, role
            },
            where: {
                id
            }
        })

    }

    async updatePartial(id: number, { username, email, password, birthAt, role }: UpdatePatchUserDTO) {

        await this.exists(id)

        const data: any = {};

        if (birthAt) {
            data.birthAt = new Date(birthAt);
        }

        if (username) {
            data.username = username
        }

        if (email) {
            data.email = email;
        }

        if (password) {
            const salt = await bcrypt.genSalt();
            data.password = await bcrypt.hash(password, salt);
        }

        if (role) {
            data.role = role;
        }

        return this.prisma.user.update({
            data,
            where: {
                id
            }
        })
    }

    async delete(id: number) {

        await this.exists(id)

        return this.prisma.user.delete({
            where: {
                id
            }
        })
    }

    //verifica se o id existe no banco para não derrubar a aplicação.
    async exists(id: number) {
        if (!(await this.prisma.user.count({
            where: {
                id
            }
        }))) {
            throw new NotFoundException(`Usuário ${id} não encontrado.`)
        }
    }
}