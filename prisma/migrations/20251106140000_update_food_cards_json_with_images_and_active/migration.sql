-- Convert acceptedFoodCards from TEXT[] to JSON with imageUrl and isActive
-- Step 1: Create a temporary column with JSON type
ALTER TABLE "StoreSettings" ADD COLUMN "acceptedFoodCards_temp" JSON;

-- Step 2: Convert existing TEXT[] data to JSON format
UPDATE "StoreSettings"
SET "acceptedFoodCards_temp" = (
  SELECT COALESCE(
    json_agg(
      json_build_object(
        'name', value,
        'imageUrl', NULL,
        'isActive', true
      )
    ),
    '[]'::json
  )
  FROM unnest("acceptedFoodCards") AS value
)
WHERE "acceptedFoodCards" IS NOT NULL;

-- Step 3: Drop old column
ALTER TABLE "StoreSettings" DROP COLUMN "acceptedFoodCards";

-- Step 4: Rename temp column to original name
ALTER TABLE "StoreSettings" RENAME COLUMN "acceptedFoodCards_temp" TO "acceptedFoodCards";

-- Step 5: Set default value for new records
ALTER TABLE "StoreSettings" 
ALTER COLUMN "acceptedFoodCards" SET DEFAULT '[{"name":"Yemeksepeti Kartı","imageUrl":null,"isActive":true},{"name":"Getir Yemek Kartı","imageUrl":null,"isActive":true},{"name":"Trendyol Yemek Kartı","imageUrl":null,"isActive":true},{"name":"Migros Yemek Kartı","imageUrl":null,"isActive":true}]'::json;

