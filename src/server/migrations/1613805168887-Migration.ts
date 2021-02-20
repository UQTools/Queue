import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1613805168887 implements MigrationInterface {
    name = "Migration1613805168887";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "course_user_meta" ALTER COLUMN "enrolledSession" DROP NOT NULL`
        );
        await queryRunner.query(
            `COMMENT ON COLUMN "course_user_meta"."enrolledSession" IS NULL`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `COMMENT ON COLUMN "course_user_meta"."enrolledSession" IS NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "course_user_meta" ALTER COLUMN "enrolledSession" SET NOT NULL`
        );
    }
}
