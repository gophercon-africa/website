ALTER TABLE "Review" ALTER COLUMN "rating" DROP NOT NULL;

ALTER TABLE "Review" ADD COLUMN "skipped" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "Review" ADD CONSTRAINT "review_rating_skipped_check"
  CHECK (
    ("skipped" = true AND "rating" IS NULL) OR
    ("skipped" = false AND "rating" IS NOT NULL)
  );
