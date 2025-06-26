import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1750976670190 implements MigrationInterface {
    name = 'Initial1750976670190'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "actor" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "biography" character varying NOT NULL, "birthDate" TIMESTAMP NOT NULL, "nationality" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_05b325494fcc996a44ae6928e5e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "rating" ("id" SERIAL NOT NULL, "score" numeric(2,1) NOT NULL, "comment" character varying NOT NULL, "reviewerName" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "movie_id" integer, CONSTRAINT "PK_ecda8ad32645327e4765b43649e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "movie" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "releaseYear" integer NOT NULL, "genre" character varying NOT NULL, "averageRating" numeric(3,1) NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "movie_actors" ("movie_id" integer NOT NULL, "actor_id" integer NOT NULL, CONSTRAINT "PK_71385034c67fafe3ebf8748cab9" PRIMARY KEY ("movie_id", "actor_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f6a1b0c5b2996114fe159c6874" ON "movie_actors" ("movie_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_a6d6b6d55428c189b0f48e6a01" ON "movie_actors" ("actor_id") `);
        await queryRunner.query(`ALTER TABLE "rating" ADD CONSTRAINT "FK_a6341c958bc0027bfb37b0f98a4" FOREIGN KEY ("movie_id") REFERENCES "movie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movie_actors" ADD CONSTRAINT "FK_f6a1b0c5b2996114fe159c68744" FOREIGN KEY ("movie_id") REFERENCES "movie"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "movie_actors" ADD CONSTRAINT "FK_a6d6b6d55428c189b0f48e6a016" FOREIGN KEY ("actor_id") REFERENCES "actor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie_actors" DROP CONSTRAINT "FK_a6d6b6d55428c189b0f48e6a016"`);
        await queryRunner.query(`ALTER TABLE "movie_actors" DROP CONSTRAINT "FK_f6a1b0c5b2996114fe159c68744"`);
        await queryRunner.query(`ALTER TABLE "rating" DROP CONSTRAINT "FK_a6341c958bc0027bfb37b0f98a4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a6d6b6d55428c189b0f48e6a01"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f6a1b0c5b2996114fe159c6874"`);
        await queryRunner.query(`DROP TABLE "movie_actors"`);
        await queryRunner.query(`DROP TABLE "movie"`);
        await queryRunner.query(`DROP TABLE "rating"`);
        await queryRunner.query(`DROP TABLE "actor"`);
    }

}
