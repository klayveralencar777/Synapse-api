import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGuardian1784132083337 implements MigrationInterface {
    name = 'AddGuardian1784132083337'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "cpf" character varying(11) NOT NULL, "status" character varying NOT NULL DEFAULT 'active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "crmv" character varying, "cnpj" character varying, "address" character varying, "phone" character varying, "userType" character varying NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_230b925048540454c8b4c481e1c" UNIQUE ("cpf"), CONSTRAINT "UQ_3c4690d10180e9350a782cae4df" UNIQUE ("crmv"), CONSTRAINT "UQ_a7815967475d0accd76feba8a1e" UNIQUE ("cnpj"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_82bbcdb9c42c5fe140291785c1" ON "users"  ("userType") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_82bbcdb9c42c5fe140291785c1"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
