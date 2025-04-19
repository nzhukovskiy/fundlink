import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedExitToNotification1745085042008 implements MigrationInterface {
    name = 'AddedExitToNotification1745085042008'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" ADD "exitId" integer`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_5bbaca47a95509c5aa0938520df" FOREIGN KEY ("exitId") REFERENCES "exit"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_5bbaca47a95509c5aa0938520df"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "exitId"`);
    }

}
