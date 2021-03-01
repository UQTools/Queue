import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1614496431258 implements MigrationInterface {
    name = 'Migration1614496431258'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "CHK_8866d3665b7e56bea6f6846ff1"`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "CHK_8980ea151496a839aa3fb0048b" CHECK ("status" = 'Open' OR "status" = 'Claimed' OR "status" = 'Closed' OR "status" = 'Accepted' OR "status" = 'Not needed')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "CHK_8980ea151496a839aa3fb0048b"`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "CHK_8866d3665b7e56bea6f6846ff1" CHECK ((((status)::text = 'Open'::text) OR ((status)::text = 'Claimed'::text) OR ((status)::text = 'Closed'::text) OR ((status)::text = 'Accepted'::text)))`);
    }

}
