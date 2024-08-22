import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit{
    async onModuleInit() {
        await this.$connect(); //assim que inicia o prisma já estabelece uma conexão com o banco
    }

    async enableShutdownHooks(app: INestApplication){
        this.$on('beforeExit', async () =>{
            await app.close();
        });//BP: fecha a conexão quando não está mais em uso
    }
}