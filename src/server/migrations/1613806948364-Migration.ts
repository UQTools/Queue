import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1613806948364 implements MigrationInterface {
    name = "Migration1613806948364";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "course_user_meta" DROP COLUMN "date"'
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "course_user_meta" ADD "date" TIMESTAMP NOT NULL'
        );
    }
}
