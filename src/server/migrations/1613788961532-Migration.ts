import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1613788961532 implements MigrationInterface {
    name = 'Migration1613788961532'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" ADD "opId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "question" ADD "queueId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "question" ADD "claimerId" uuid`);
        await queryRunner.query(`ALTER TABLE "course_user_meta" ADD "enrolledSession" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "claimTime" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "question"."claimTime" IS NULL`);
        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "claimMessage" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "question"."claimMessage" IS NULL`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_11181c24384d8054e878ae766dc" FOREIGN KEY ("opId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_6381748e499c8913003dc2adaa9" FOREIGN KEY ("claimerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_83f26a5124fd7d091efeea8a8ac" FOREIGN KEY ("queueId") REFERENCES "queue"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_83f26a5124fd7d091efeea8a8ac"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_6381748e499c8913003dc2adaa9"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_11181c24384d8054e878ae766dc"`);
        await queryRunner.query(`COMMENT ON COLUMN "question"."claimMessage" IS NULL`);
        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "claimMessage" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "question"."claimTime" IS NULL`);
        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "claimTime" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "course_user_meta" DROP COLUMN "enrolledSession"`);
        await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "claimerId"`);
        await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "queueId"`);
        await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "opId"`);
    }

}
