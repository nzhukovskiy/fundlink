import { MigrationInterface, QueryRunner } from "typeorm";

export class InvestmentApprovalEnumStyle1745316190526 implements MigrationInterface {
    name = 'InvestmentApprovalEnumStyle1745316190526'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "investment" ALTER COLUMN "approvalType" TYPE TEXT;`);
        await queryRunner.query(`UPDATE "investment" SET "approvalType" = UPPER("approvalType");`);

        await queryRunner.query(`ALTER TYPE "public"."investment_approvaltype_enum" RENAME TO "investment_approvaltype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."investment_approvaltype_enum" AS ENUM('AUTO_APPROVE', 'STARTUP_APPROVE')`);
        await queryRunner.query(`ALTER TABLE "investment" ALTER COLUMN "approvalType" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "investment" ALTER COLUMN "approvalType" TYPE "public"."investment_approvaltype_enum" USING "approvalType"::"text"::"public"."investment_approvaltype_enum"`);
        await queryRunner.query(`ALTER TABLE "investment" ALTER COLUMN "approvalType" SET DEFAULT 'AUTO_APPROVE'`);
        await queryRunner.query(`DROP TYPE "public"."investment_approvaltype_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "investment" ALTER COLUMN "approvalType" TYPE TEXT;`);
        await queryRunner.query(`UPDATE "investment" SET "approvalType" = LOWER("approvalType");`);

        await queryRunner.query(`CREATE TYPE "public"."investment_approvaltype_enum_old" AS ENUM('auto_approve', 'startup_approve')`);
        await queryRunner.query(`ALTER TABLE "investment" ALTER COLUMN "approvalType" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "investment" ALTER COLUMN "approvalType" TYPE "public"."investment_approvaltype_enum_old" USING "approvalType"::"text"::"public"."investment_approvaltype_enum_old"`);
        await queryRunner.query(`ALTER TABLE "investment" ALTER COLUMN "approvalType" SET DEFAULT 'auto_approve'`);
        await queryRunner.query(`DROP TYPE "public"."investment_approvaltype_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."investment_approvaltype_enum_old" RENAME TO "investment_approvaltype_enum"`);
    }

}
