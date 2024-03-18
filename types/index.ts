// ====== USER PARAMS
export type CreateUserParams = {
  clerkId: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  photo: string;
};

export type UpdateUserParams = {
  firstName: string;
  lastName: string;
  username: string;
  photo: string;
};

// ====== EVENT PARAMS
export type CreateEventParams = {
  userId: string;
  event: {
    title: string;
    description: string;
    location: string;
    imageUrl: string;
    startDateTime: Date;
    endDateTime: Date;
    categoryId: string;
    price: string;
    isFree: boolean;
    url: string;
  };
  path: string;
};

export type UpdateEventParams = {
  userId: string;
  event: {
    _id: string;
    title: string;
    imageUrl: string;
    description: string;
    location: string;
    startDateTime: Date;
    endDateTime: Date;
    categoryId: string;
    price: string;
    isFree: boolean;
    url: string;
  };
  path: string;
};

export type DeleteEventParams = {
  eventId: string;
  path: string;
};

export type GetAllEventsParams = {
  query: string;
  category: string;
  limit: number;
  page: number;
};

export type GetEventsByUserParams = {
  userId: string;
  limit?: number;
  page: number;
};

export type GetRelatedEventsByCategoryParams = {
  categoryId: string;
  eventId: string;
  limit?: number;
  page: number | string;
};

export type Event = {
  _id: string;
  title: string;
  description: string;
  price: string;
  isFree: boolean;
  imageUrl: string;
  location: string;
  startDateTime: Date;
  endDateTime: Date;
  url: string;
  organizer: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  category: {
    _id: string;
    name: string;
  };
};

// ====== CATEGORY PARAMS
export type CreateCategoryParams = {
  categoryName: string;
};

// ====== ORDER PARAMS
export type CheckoutOrderParams = {
  eventTitle: string;
  eventId: string;
  price: string;
  isFree: boolean;
  buyerId: string;
};

export type CreateOrderParams = {
  stripeId: string;
  eventId: string;
  buyerId: string;
  totalAmount: string;
  createdAt: Date;
};

export type GetOrdersByEventParams = {
  eventId: string;
  searchString: string;
};

export type GetOrdersByUserParams = {
  userId: string | null;
  limit?: number;
  page: string | number | null;
};

// ====== URL QUERY PARAMS
export type UrlQueryParams = {
  params: string;
  key: string;
  value: string | null;
};

export type RemoveUrlQueryParams = {
  params: string;
  keysToRemove: string[];
};

// searchParams type tanımı dinamik olarak string anahtarlar kabul ediyor ve bu anahtarların değerleri string, string[], veya undefined olabiliyor. Bu yapı, sınırsız sayıda anahtar-değer çifti kabul edebilecek şekilde tasarlanmış.
// JavaScript'te bir objenin anahtarları (key) aslında her zaman string veya Symbol türünde olur. Ancak, bir sayı (number) gibi görünen anahtarlar otomatik olarak string'e çevrilir. Yani bir objeye sayı türünde bir anahtar eklediğinizde, JavaScript bu anahtarı arka planda string'e dönüştürür.
// TypeScript'te, bir obje tanımlarken 1: "bir" şeklinde bir atama yaparsanız, TypeScript bu anahtarın türünü otomatik olarak number olarak algılamaz; çünkü obje tanımı esnasında sayısal bir değer verilse bile, anahtar aslında bir string olarak saklanır. TypeScript, JavaScript'in bu davranışını dikkate alarak, sayısal anahtarları kabul eder ve onları otomatik olarak string türüne dönüştürür. Bu nedenle, bu tarz bir tanımlama yaparken [key: string]: type şeklinde bir hata alınmaz.
export type SearchParamProps = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};
