import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Product: a
    .model({
      name: a.string().required(),
      description: a.string().required(),
      price: a.integer().required(), // In cents to avoid precision, rounding issues
      images: a.hasMany("ProductImage", "productId"),
      mainImageS3Key: a.string(),
    })
    .authorization((allow) => [
      allow.guest().to(["read"]),
      allow.authenticated().to(["read"]),
      allow.group("Admins"),
    ]),

  ProductImage: a
    .model({
      s3Key: a.string(),
      alt: a.string(),
      productId: a.id(),
      product: a.belongsTo("Product", "productId"),
    })
    .secondaryIndexes((index) => [index("productId")])
    .authorization((allow) => [
      allow.guest().to(["read"]),
      allow.authenticated().to(["read"]),
      allow.group("Admins"),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "iam",
  },
});
