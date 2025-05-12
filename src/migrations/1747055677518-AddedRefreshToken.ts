import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedRefreshToken1747055677518 implements MigrationInterface {
    name = 'AddedRefreshToken1747055677518'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."refresh_token_usertype_enum" AS ENUM('STARTUP', 'INVESTOR')`);
        await queryRunner.query(`CREATE TABLE "refresh_token" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, "userType" "public"."refresh_token_usertype_enum" NOT NULL, "userId" integer NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "revoked" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_c31d0a2f38e6e99110df62ab0af" UNIQUE ("token"), CONSTRAINT "PK_b575dd3c21fb0831013c909e7fe" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "refresh_token"`);
        await queryRunner.query(`DROP TYPE "public"."refresh_token_usertype_enum"`);
    }

}
