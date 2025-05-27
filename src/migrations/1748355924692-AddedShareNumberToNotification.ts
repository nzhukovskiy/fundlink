import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedShareNumberToNotification1748355924692 implements MigrationInterface {
    name = 'AddedShareNumberToNotification1748355924692'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" ADD "exitInvestorShareNumber" numeric`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "exitInvestorShareNumber"`);
    }

}
