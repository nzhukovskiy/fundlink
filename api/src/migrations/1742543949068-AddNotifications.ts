import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNotifications1742543949068 implements MigrationInterface {
    name = 'AddNotifications1742543949068'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."notification_usertype_enum" AS ENUM('startup', 'investor')`);
        await queryRunner.query(`CREATE TYPE "public"."notification_type_enum" AS ENUM('MESSAGE', 'INVESTMENT')`);
        await queryRunner.query(`CREATE TABLE "notification" ("id" SERIAL NOT NULL, "userId" character varying NOT NULL, "userType" "public"."notification_usertype_enum" NOT NULL, "type" "public"."notification_type_enum" NOT NULL, "message" character varying NOT NULL, "read" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "notification"`);
        await queryRunner.query(`DROP TYPE "public"."notification_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."notification_usertype_enum"`);
    }

}
