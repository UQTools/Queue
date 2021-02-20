import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1613780943953 implements MigrationInterface {
    name = "Migration1613780943953"

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE \"question\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"status\" character varying NOT NULL, \"createdTime\" TIMESTAMP NOT NULL DEFAULT now(), \"claimTime\" TIMESTAMP NOT NULL, \"claimMessage\" character varying NOT NULL, CONSTRAINT \"CHK_d6a250a0c8da121685e90984eb\" CHECK (\"status\" = 'Open' OR \"status\" = 'Claimed' OR \"status\" = 'Closed'), CONSTRAINT \"PK_21e5786aa0ea704ae185a79b2d5\" PRIMARY KEY (\"id\"))");
        await queryRunner.query("CREATE TABLE \"course_user_meta\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"questionsAsked\" integer NOT NULL, \"date\" TIMESTAMP NOT NULL, \"userId\" uuid, \"courseId\" uuid, CONSTRAINT \"PK_225bd37760daf7c2c284ba98484\" PRIMARY KEY (\"id\"))");
        await queryRunner.query("CREATE TABLE \"user\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"username\" character varying NOT NULL, \"name\" character varying NOT NULL, \"email\" character varying NOT NULL, \"isOnline\" boolean NOT NULL, \"isAdmin\" boolean NOT NULL DEFAULT false, \"questionsId\" uuid, \"claimedQuestionsId\" uuid, CONSTRAINT \"UQ_78a916df40e02a9deb1c4b75edb\" UNIQUE (\"username\"), CONSTRAINT \"PK_cace4a159ff9f2512dd42373760\" PRIMARY KEY (\"id\"))");
        await queryRunner.query("CREATE TABLE \"queue\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"examples\" character varying array NOT NULL DEFAULT array[]::varchar[], \"theme\" character varying NOT NULL, \"sortedBy\" character varying NOT NULL, \"actions\" character varying array NOT NULL DEFAULT array[]::varchar[], \"roomId\" uuid, CONSTRAINT \"CHK_c73a4fad2b1b51f24806d41e71\" CHECK (\"theme\" = 'Gray' OR \"theme\" = 'Red' OR \"theme\" = 'Orange' OR \"theme\" = 'Yellow' OR \"theme\" = 'Green' OR \"theme\" = 'Teal' OR \"theme\" = 'Blue' OR \"theme\" = 'Cyan' OR \"theme\" = 'Purple' OR \"theme\" = 'Pink'), CONSTRAINT \"PK_4adefbd9c73b3f9a49985a5529f\" PRIMARY KEY (\"id\"))");
        await queryRunner.query("CREATE TABLE \"weekly_event\" (\"id\" SERIAL NOT NULL, \"startTime\" integer NOT NULL, \"endTime\" integer NOT NULL, \"roomId\" uuid, CONSTRAINT \"PK_8d1a1a9292c5bfec77c21270e67\" PRIMARY KEY (\"id\"))");
        await queryRunner.query("CREATE TABLE \"room\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"name\" character varying NOT NULL, \"capacity\" integer NOT NULL, \"enforceCapacity\" boolean NOT NULL, \"manuallyDisabled\" boolean NOT NULL, \"courseId\" uuid, CONSTRAINT \"PK_c6d46db005d623e691b2fbcba23\" PRIMARY KEY (\"id\"))");
        await queryRunner.query("CREATE TABLE \"course\" (\"id\" uuid NOT NULL DEFAULT uuid_generate_v4(), \"code\" character varying NOT NULL, \"title\" character varying NOT NULL, CONSTRAINT \"UQ_5cf4963ae12285cda6432d5a3a4\" UNIQUE (\"code\"), CONSTRAINT \"PK_bf95180dd756fd204fb01ce4916\" PRIMARY KEY (\"id\"))");
        await queryRunner.query("ALTER TABLE \"course_user_meta\" ADD CONSTRAINT \"FK_730dbd0489dfe2c9c46f23b3375\" FOREIGN KEY (\"userId\") REFERENCES \"user\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE \"course_user_meta\" ADD CONSTRAINT \"FK_3abb26ab7f62567c12d71c32a9b\" FOREIGN KEY (\"courseId\") REFERENCES \"course\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE \"user\" ADD CONSTRAINT \"FK_f139d89a8e00c9e3eb7ba076b8c\" FOREIGN KEY (\"questionsId\") REFERENCES \"question\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE \"user\" ADD CONSTRAINT \"FK_0b976fb794ea1b575d17680def9\" FOREIGN KEY (\"claimedQuestionsId\") REFERENCES \"question\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE \"queue\" ADD CONSTRAINT \"FK_a8b42ff43a9ac840bc2cb441ec7\" FOREIGN KEY (\"roomId\") REFERENCES \"room\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE \"weekly_event\" ADD CONSTRAINT \"FK_5c3ad51d0475eb3dab721d0b9d7\" FOREIGN KEY (\"roomId\") REFERENCES \"room\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE \"room\" ADD CONSTRAINT \"FK_1cd9109e475c5a95bba8612a9d9\" FOREIGN KEY (\"courseId\") REFERENCES \"course\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE \"room\" DROP CONSTRAINT \"FK_1cd9109e475c5a95bba8612a9d9\"");
        await queryRunner.query("ALTER TABLE \"weekly_event\" DROP CONSTRAINT \"FK_5c3ad51d0475eb3dab721d0b9d7\"");
        await queryRunner.query("ALTER TABLE \"queue\" DROP CONSTRAINT \"FK_a8b42ff43a9ac840bc2cb441ec7\"");
        await queryRunner.query("ALTER TABLE \"user\" DROP CONSTRAINT \"FK_0b976fb794ea1b575d17680def9\"");
        await queryRunner.query("ALTER TABLE \"user\" DROP CONSTRAINT \"FK_f139d89a8e00c9e3eb7ba076b8c\"");
        await queryRunner.query("ALTER TABLE \"course_user_meta\" DROP CONSTRAINT \"FK_3abb26ab7f62567c12d71c32a9b\"");
        await queryRunner.query("ALTER TABLE \"course_user_meta\" DROP CONSTRAINT \"FK_730dbd0489dfe2c9c46f23b3375\"");
        await queryRunner.query("DROP TABLE \"course\"");
        await queryRunner.query("DROP TABLE \"room\"");
        await queryRunner.query("DROP TABLE \"weekly_event\"");
        await queryRunner.query("DROP TABLE \"queue\"");
        await queryRunner.query("DROP TABLE \"user\"");
        await queryRunner.query("DROP TABLE \"course_user_meta\"");
        await queryRunner.query("DROP TABLE \"question\"");
    }

}
