import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1613838371888 implements MigrationInterface {
    name = 'Migration1613838371888'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "weekly_event" DROP CONSTRAINT "FK_5c3ad51d0475eb3dab721d0b9d7"`);
        await queryRunner.query(`COMMENT ON COLUMN "queue"."examples" IS NULL`);
        await queryRunner.query(`ALTER TABLE "queue" ALTER COLUMN "examples" SET DEFAULT array[]::varchar[]`);
        await queryRunner.query(`COMMENT ON COLUMN "queue"."actions" IS NULL`);
        await queryRunner.query(`ALTER TABLE "queue" ALTER COLUMN "actions" SET DEFAULT array[]::varchar[]`);
        await queryRunner.query(`ALTER TABLE "weekly_event" ADD CONSTRAINT "FK_5c3ad51d0475eb3dab721d0b9d7" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "weekly_event" DROP CONSTRAINT "FK_5c3ad51d0475eb3dab721d0b9d7"`);
        await queryRunner.query(`ALTER TABLE "queue" ALTER COLUMN "actions" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`COMMENT ON COLUMN "queue"."actions" IS NULL`);
        await queryRunner.query(`ALTER TABLE "queue" ALTER COLUMN "examples" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`COMMENT ON COLUMN "queue"."examples" IS NULL`);
        await queryRunner.query(`ALTER TABLE "weekly_event" ADD CONSTRAINT "FK_5c3ad51d0475eb3dab721d0b9d7" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
