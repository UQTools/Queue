import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1613786022471 implements MigrationInterface {
    name = "Migration1613786022471";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "user" DROP CONSTRAINT "FK_f139d89a8e00c9e3eb7ba076b8c"'
        );
        await queryRunner.query(
            'ALTER TABLE "user" DROP CONSTRAINT "FK_0b976fb794ea1b575d17680def9"'
        );
        await queryRunner.query('ALTER TABLE "user" DROP COLUMN "questionsId"');
        await queryRunner.query(
            'ALTER TABLE "user" DROP COLUMN "claimedQuestionsId"'
        );
        await queryRunner.query(
            'ALTER TABLE "queue" ADD CONSTRAINT "CHK_da845b8698957fbde402fa2757" CHECK ("sortedBy" = \'Time\' OR "sortedBy" = \'Questions\' OR "sortedBy" = \'Question and time\')'
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "queue" DROP CONSTRAINT "CHK_da845b8698957fbde402fa2757"'
        );
        await queryRunner.query(
            'ALTER TABLE "user" ADD "claimedQuestionsId" uuid'
        );
        await queryRunner.query('ALTER TABLE "user" ADD "questionsId" uuid');
        await queryRunner.query(
            'ALTER TABLE "user" ADD CONSTRAINT "FK_0b976fb794ea1b575d17680def9" FOREIGN KEY ("claimedQuestionsId") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
        );
        await queryRunner.query(
            'ALTER TABLE "user" ADD CONSTRAINT "FK_f139d89a8e00c9e3eb7ba076b8c" FOREIGN KEY ("questionsId") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
        );
    }
}
