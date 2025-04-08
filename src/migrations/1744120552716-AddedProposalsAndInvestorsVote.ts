import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedProposalsAndInvestorsVote1744120552716 implements MigrationInterface {
    name = 'AddedProposalsAndInvestorsVote1744120552716'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "investor_vote" ("id" SERIAL NOT NULL, "approved" boolean, "investorId" integer, "proposalId" integer, CONSTRAINT "PK_d37807e91b3e2a86566d96b3ace" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."funding_round_change_proposal_status_enum" AS ENUM('pending_review', 'completed', 'rejected')`);
        await queryRunner.query(`CREATE TABLE "funding_round_change_proposal" ("id" SERIAL NOT NULL, "oldFundingGoal" character varying, "oldEndDate" TIMESTAMP, "newFundingGoal" character varying, "newEndDate" TIMESTAMP, "status" "public"."funding_round_change_proposal_status_enum" NOT NULL DEFAULT 'pending_review', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "fundingRoundId" integer, CONSTRAINT "PK_b14ab4ff9793e98c8691004ccf2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "investor_vote" ADD CONSTRAINT "FK_bf874373fb8b0db57db82e4e213" FOREIGN KEY ("investorId") REFERENCES "investor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "investor_vote" ADD CONSTRAINT "FK_f7cacce3f94307400f5edbd94b8" FOREIGN KEY ("proposalId") REFERENCES "funding_round_change_proposal"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "funding_round_change_proposal" ADD CONSTRAINT "FK_d4a1cd3636f19dfec9089a25574" FOREIGN KEY ("fundingRoundId") REFERENCES "funding_round"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "funding_round_change_proposal" DROP CONSTRAINT "FK_d4a1cd3636f19dfec9089a25574"`);
        await queryRunner.query(`ALTER TABLE "investor_vote" DROP CONSTRAINT "FK_f7cacce3f94307400f5edbd94b8"`);
        await queryRunner.query(`ALTER TABLE "investor_vote" DROP CONSTRAINT "FK_bf874373fb8b0db57db82e4e213"`);
        await queryRunner.query(`DROP TABLE "funding_round_change_proposal"`);
        await queryRunner.query(`DROP TYPE "public"."funding_round_change_proposal_status_enum"`);
        await queryRunner.query(`DROP TABLE "investor_vote"`);
    }

}
