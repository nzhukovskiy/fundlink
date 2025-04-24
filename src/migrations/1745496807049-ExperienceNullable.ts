import { MigrationInterface, QueryRunner } from "typeorm";

export class ExperienceNullable1745496807049 implements MigrationInterface {
    name = 'ExperienceNullable1745496807049'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "startup" ALTER COLUMN "teamExperience" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "startup" ALTER COLUMN "teamExperience" SET NOT NULL`);
    }

}
