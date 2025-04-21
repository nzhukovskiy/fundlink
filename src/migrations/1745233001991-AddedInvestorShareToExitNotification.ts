import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedInvestorShareToExitNotification1745233001991 implements MigrationInterface {
    name = 'AddedInvestorShareToExitNotification1745233001991'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" ADD "exitInvestorShare" numeric`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "exitInvestorShare"`);
    }

}
