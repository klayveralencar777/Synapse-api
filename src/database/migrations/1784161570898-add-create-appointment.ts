import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreateAppointment1784161570898 implements MigrationInterface {
    name = 'AddCreateAppointment1784161570898'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "cpf" character varying(11) NOT NULL, "status" character varying NOT NULL DEFAULT 'active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "crmv" character varying, "cnpj" character varying, "address" character varying, "phone" character varying, "userType" character varying NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_230b925048540454c8b4c481e1c" UNIQUE ("cpf"), CONSTRAINT "UQ_3c4690d10180e9350a782cae4df" UNIQUE ("crmv"), CONSTRAINT "UQ_a7815967475d0accd76feba8a1e" UNIQUE ("cnpj"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_82bbcdb9c42c5fe140291785c1" ON "users"  ("userType") `);
        await queryRunner.query(`CREATE TABLE "appointments" ("id" SERIAL NOT NULL, "scheduledAt" TIMESTAMP WITH TIME ZONE NOT NULL, "reason" character varying NOT NULL, "petInformation" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'scheduled', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "guardianId" integer NOT NULL, "veterinarianId" integer NOT NULL, CONSTRAINT "PK_4a437a9a27e948726b8bb3e36ad" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_4295352155a8eaf52bd92ef6dbd" FOREIGN KEY ("guardianId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_b9e492c0dd1bc7ed427bdd2aa93" FOREIGN KEY ("veterinarianId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_b9e492c0dd1bc7ed427bdd2aa93"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_4295352155a8eaf52bd92ef6dbd"`);
        await queryRunner.query(`DROP TABLE "appointments"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_82bbcdb9c42c5fe140291785c1"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
