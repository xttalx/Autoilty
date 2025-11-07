export interface ListingSEOProps {
  listing: {
    id: string;
    slug: string;
    title: string;
    description: string;
    images: string[];
    currency: string;
    price: number;
    country: string;
    city: string;
    vin?: string | null;
    reviews?: {
      average: number;
      count: number;
      items: Array<{
        reviewer: string;
        rating: number;
        comment: string;
        created_at: string;
      }>;
    };
    specs?: {
      make?: string;
      model?: string;
      bodyType?: string;
    };
    seller: {
      type: "dealer" | "private";
      name: string;
      phone?: string | null;
    };
  };
}



