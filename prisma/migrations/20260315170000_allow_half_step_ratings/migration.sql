ALTER TABLE "Review"
ALTER COLUMN "rating" TYPE DOUBLE PRECISION
USING "rating"::double precision;
