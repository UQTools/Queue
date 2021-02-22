import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1614021571211 implements MigrationInterface {
    name = "Migration1614021571211";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "question" DROP CONSTRAINT "FK_6381748e499c8913003dc2adaa9"`
        );
        await queryRunner.query(
            `ALTER TABLE "question" ALTER COLUMN "claimerId" DROP NOT NULL`
        );
        await queryRunner.query(
            `COMMENT ON COLUMN "question"."claimerId" IS NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "question" ADD CONSTRAINT "FK_6381748e499c8913003dc2adaa9" FOREIGN KEY ("claimerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "question" DROP CONSTRAINT "FK_6381748e499c8913003dc2adaa9"`
        );
        await queryRunner.query(
            `COMMENT ON COLUMN "question"."claimerId" IS NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "question" ALTER COLUMN "claimerId" SET NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "question" ADD CONSTRAINT "FK_6381748e499c8913003dc2adaa9" FOREIGN KEY ("claimerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }
}
