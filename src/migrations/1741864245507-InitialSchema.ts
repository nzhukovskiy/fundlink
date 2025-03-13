import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1741864245507 implements MigrationInterface {
    name = 'InitialSchema1741864245507'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "investor" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "name" character varying NOT NULL, "surname" character varying NOT NULL, CONSTRAINT "UQ_f1416299e077e942f6eb37604d8" UNIQUE ("email"), CONSTRAINT "PK_c60a173349549955c39d3703551" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."investment_approvaltype_enum" AS ENUM('auto_approve', 'startup_approve')`);
        await queryRunner.query(`CREATE TYPE "public"."investment_stage_enum" AS ENUM('pending_review', 'committed', 'completed', 'rejected')`);
        await queryRunner.query(`CREATE TABLE "investment" ("id" SERIAL NOT NULL, "amount" numeric NOT NULL, "date" TIMESTAMP NOT NULL, "approvalType" "public"."investment_approvaltype_enum" NOT NULL DEFAULT 'auto_approve', "stage" "public"."investment_stage_enum" NOT NULL, "investorId" integer, "fundingRoundId" integer, CONSTRAINT "PK_ad085a94bd56e031136925f681b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."funding_round_stage_enum" AS ENUM('seed', 'series_a', 'series_b', 'series_c', 'series_d', 'series_e')`);
        await queryRunner.query(`CREATE TABLE "funding_round" ("id" SERIAL NOT NULL, "stage" "public"."funding_round_stage_enum" NOT NULL DEFAULT 'seed', "fundingGoal" numeric NOT NULL, "currentRaised" numeric NOT NULL DEFAULT '0', "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, "isCurrent" boolean NOT NULL DEFAULT false, "startupId" integer, CONSTRAINT "PK_a5db54d291c8a60a8c6670662fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tag" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "startup" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "fundingGoal" numeric NOT NULL, "teamExperience" integer NOT NULL, "tamMarket" numeric NOT NULL, "samMarket" numeric NOT NULL, "somMarket" numeric NOT NULL, "debtAmount" numeric NOT NULL DEFAULT '0', "revenuePerYear" json, "capitalExpenditures" json, "changesInWorkingCapital" json, "deprecationAndAmortization" json, "presentationPath" character varying, "logoPath" character varying, "autoApproveInvestments" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_ae167163374742264b632571c9d" UNIQUE ("email"), CONSTRAINT "PK_fc34fd7f4318a675291138e4f1b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."message_sendertype_enum" AS ENUM('startup', 'investor')`);
        await queryRunner.query(`CREATE TABLE "message" ("id" SERIAL NOT NULL, "senderType" "public"."message_sendertype_enum" NOT NULL, "senderId" integer NOT NULL, "text" text NOT NULL, "timestamp" TIMESTAMP NOT NULL, "readAt" TIMESTAMP, "chatId" integer, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat" ("id" SERIAL NOT NULL, "startupId" integer, "investorId" integer, CONSTRAINT "PK_9d0b2ba74336710fd31154738a5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "startup_tags_tag" ("startupId" integer NOT NULL, "tagId" integer NOT NULL, CONSTRAINT "PK_4284b397211e5edfbb2852b40c9" PRIMARY KEY ("startupId", "tagId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e7bac1b59a889fceb95960850c" ON "startup_tags_tag" ("startupId") `);
        await queryRunner.query(`CREATE INDEX "IDX_50a4e7a66d097ec2d836531b5f" ON "startup_tags_tag" ("tagId") `);
        await queryRunner.query(`ALTER TABLE "investment" ADD CONSTRAINT "FK_5ba755def7b1652c6033f309834" FOREIGN KEY ("investorId") REFERENCES "investor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "investment" ADD CONSTRAINT "FK_14b24eb3c0fb6f2a044c23e2c22" FOREIGN KEY ("fundingRoundId") REFERENCES "funding_round"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "funding_round" ADD CONSTRAINT "FK_cad7385a39566468b780e0e17c8" FOREIGN KEY ("startupId") REFERENCES "startup"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_619bc7b78eba833d2044153bacc" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat" ADD CONSTRAINT "FK_488f431707fb157970719333b38" FOREIGN KEY ("startupId") REFERENCES "startup"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat" ADD CONSTRAINT "FK_28d7d5470462c679895fa1715e9" FOREIGN KEY ("investorId") REFERENCES "investor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "startup_tags_tag" ADD CONSTRAINT "FK_e7bac1b59a889fceb95960850c2" FOREIGN KEY ("startupId") REFERENCES "startup"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "startup_tags_tag" ADD CONSTRAINT "FK_50a4e7a66d097ec2d836531b5fb" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "startup_tags_tag" DROP CONSTRAINT "FK_50a4e7a66d097ec2d836531b5fb"`);
        await queryRunner.query(`ALTER TABLE "startup_tags_tag" DROP CONSTRAINT "FK_e7bac1b59a889fceb95960850c2"`);
        await queryRunner.query(`ALTER TABLE "chat" DROP CONSTRAINT "FK_28d7d5470462c679895fa1715e9"`);
        await queryRunner.query(`ALTER TABLE "chat" DROP CONSTRAINT "FK_488f431707fb157970719333b38"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_619bc7b78eba833d2044153bacc"`);
        await queryRunner.query(`ALTER TABLE "funding_round" DROP CONSTRAINT "FK_cad7385a39566468b780e0e17c8"`);
        await queryRunner.query(`ALTER TABLE "investment" DROP CONSTRAINT "FK_14b24eb3c0fb6f2a044c23e2c22"`);
        await queryRunner.query(`ALTER TABLE "investment" DROP CONSTRAINT "FK_5ba755def7b1652c6033f309834"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_50a4e7a66d097ec2d836531b5f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e7bac1b59a889fceb95960850c"`);
        await queryRunner.query(`DROP TABLE "startup_tags_tag"`);
        await queryRunner.query(`DROP TABLE "chat"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`DROP TYPE "public"."message_sendertype_enum"`);
        await queryRunner.query(`DROP TABLE "startup"`);
        await queryRunner.query(`DROP TABLE "tag"`);
        await queryRunner.query(`DROP TABLE "funding_round"`);
        await queryRunner.query(`DROP TYPE "public"."funding_round_stage_enum"`);
        await queryRunner.query(`DROP TABLE "investment"`);
        await queryRunner.query(`DROP TYPE "public"."investment_stage_enum"`);
        await queryRunner.query(`DROP TYPE "public"."investment_approvaltype_enum"`);
        await queryRunner.query(`DROP TABLE "investor"`);
    }

}
