import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1784077282496 implements MigrationInterface {
    name = 'Init1784077282496'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "type" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "crmv" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_3c4690d10180e9350a782cae4df" UNIQUE ("crmv")`);
        await queryRunner.query(`ALTER TABLE "users" ADD "cnpj" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_a7815967475d0accd76feba8a1e" UNIQUE ("cnpj")`);
        await queryRunner.query(`ALTER TABLE "users" ADD "address" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "userType" character varying NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_82bbcdb9c42c5fe140291785c1" ON "users"  ("userType") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_82bbcdb9c42c5fe140291785c1"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "userType"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_a7815967475d0accd76feba8a1e"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "cnpj"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_3c4690d10180e9350a782cae4df"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "crmv"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "type"`);
    }

}
