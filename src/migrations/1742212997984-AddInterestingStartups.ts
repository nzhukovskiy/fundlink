import { MigrationInterface, QueryRunner } from "typeorm";

export class AddInterestingStartups1742212997984 implements MigrationInterface {
    name = 'AddInterestingStartups1742212997984'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "investor_interesting_startups_startup" ("investorId" integer NOT NULL, "startupId" integer NOT NULL, CONSTRAINT "PK_a22003c85f040eddc2202300273" PRIMARY KEY ("investorId", "startupId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_bcd6c594b1cc75bac9676e5af0" ON "investor_interesting_startups_startup" ("investorId") `);
        await queryRunner.query(`CREATE INDEX "IDX_54fb13828acb3fa375170ac8f3" ON "investor_interesting_startups_startup" ("startupId") `);
        await queryRunner.query(`ALTER TABLE "investor_interesting_startups_startup" ADD CONSTRAINT "FK_bcd6c594b1cc75bac9676e5af07" FOREIGN KEY ("investorId") REFERENCES "investor"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "investor_interesting_startups_startup" ADD CONSTRAINT "FK_54fb13828acb3fa375170ac8f34" FOREIGN KEY ("startupId") REFERENCES "startup"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "investor_interesting_startups_startup" DROP CONSTRAINT "FK_54fb13828acb3fa375170ac8f34"`);
        await queryRunner.query(`ALTER TABLE "investor_interesting_startups_startup" DROP CONSTRAINT "FK_bcd6c594b1cc75bac9676e5af07"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_54fb13828acb3fa375170ac8f3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bcd6c594b1cc75bac9676e5af0"`);
        await queryRunner.query(`DROP TABLE "investor_interesting_startups_startup"`);
    }

}
