import { MigrationInterface, QueryRunner } from "typeorm";

export class InvestmentStageEnumStyle1745316603390 implements MigrationInterface {
    name = 'InvestmentStageEnumStyle1745316603390'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "investment" ALTER COLUMN "stage" TYPE TEXT;`);
        await queryRunner.query(`UPDATE "investment" SET "stage" = UPPER("stage");`);

        await queryRunner.query(`ALTER TYPE "public"."investment_stage_enum" RENAME TO "investment_stage_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."investment_stage_enum" AS ENUM('PENDING_REVIEW', 'COMMITTED', 'COMPLETED', 'REJECTED')`);
        await queryRunner.query(`ALTER TABLE "investment" ALTER COLUMN "stage" TYPE "public"."investment_stage_enum" USING "stage"::"text"::"public"."investment_stage_enum"`);
        await queryRunner.query(`DROP TYPE "public"."investment_stage_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "investment" ALTER COLUMN "stage" TYPE TEXT;`);
        await queryRunner.query(`UPDATE "investment" SET "stage" = LOWER("stage");`);

        await queryRunner.query(`CREATE TYPE "public"."investment_stage_enum_old" AS ENUM('pending_review', 'committed', 'completed', 'rejected')`);
        await queryRunner.query(`ALTER TABLE "investment" ALTER COLUMN "stage" TYPE "public"."investment_stage_enum_old" USING "stage"::"text"::"public"."investment_stage_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."investment_stage_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."investment_stage_enum_old" RENAME TO "investment_stage_enum"`);
    }

}
