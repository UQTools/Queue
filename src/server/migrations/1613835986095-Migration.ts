import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1613835986095 implements MigrationInterface {
    name = "Migration1613835986095";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "queue" DROP CONSTRAINT "FK_a8b42ff43a9ac840bc2cb441ec7"'
        );
        await queryRunner.query('COMMENT ON COLUMN "queue"."examples" IS NULL');
        await queryRunner.query(
            'ALTER TABLE "queue" ALTER COLUMN "examples" SET DEFAULT array[]::varchar[]'
        );
        await queryRunner.query('COMMENT ON COLUMN "queue"."actions" IS NULL');
        await queryRunner.query(
            'ALTER TABLE "queue" ALTER COLUMN "actions" SET DEFAULT array[]::varchar[]'
        );
        await queryRunner.query(
            'ALTER TABLE "queue" ALTER COLUMN "roomId" SET NOT NULL'
        );
        await queryRunner.query('COMMENT ON COLUMN "queue"."roomId" IS NULL');
        await queryRunner.query(
            'ALTER TABLE "queue" ADD CONSTRAINT "FK_a8b42ff43a9ac840bc2cb441ec7" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "queue" DROP CONSTRAINT "FK_a8b42ff43a9ac840bc2cb441ec7"'
        );
        await queryRunner.query('COMMENT ON COLUMN "queue"."roomId" IS NULL');
        await queryRunner.query(
            'ALTER TABLE "queue" ALTER COLUMN "roomId" DROP NOT NULL'
        );
        await queryRunner.query(
            'ALTER TABLE "queue" ALTER COLUMN "actions" SET DEFAULT ARRAY[]'
        );
        await queryRunner.query('COMMENT ON COLUMN "queue"."actions" IS NULL');
        await queryRunner.query(
            'ALTER TABLE "queue" ALTER COLUMN "examples" SET DEFAULT ARRAY[]'
        );
        await queryRunner.query('COMMENT ON COLUMN "queue"."examples" IS NULL');
        await queryRunner.query(
            'ALTER TABLE "queue" ADD CONSTRAINT "FK_a8b42ff43a9ac840bc2cb441ec7" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
        );
    }
}
