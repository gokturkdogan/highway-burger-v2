-- AlterTable
ALTER TABLE "StoreSettings" ADD COLUMN     "acceptedFoodCards" TEXT[] DEFAULT ARRAY['Yemeksepeti Kartı', 'Getir Yemek Kartı', 'Trendyol Yemek Kartı', 'Migros Yemek Kartı']::TEXT[];
