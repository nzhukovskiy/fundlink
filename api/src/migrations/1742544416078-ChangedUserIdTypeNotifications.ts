import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangedUserIdTypeNotifications1742544416078 implements MigrationInterface {
    name = 'ChangedUserIdTypeNotifications1742544416078'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "userId" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "userId" character varying NOT NULL`);
    }

}
