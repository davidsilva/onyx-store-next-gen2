import {
  type ClientSchema,
  a,
  defineData,
  defineFunction,
} from "@aws-amplify/backend";

export const createStripeProductFunction = defineFunction({
  name: "create-stripe-product",
  entry: "../functions/create-stripe-product/handler.ts",
});

const schema = a.schema({
  Product: a
    .model({
      name: a.string().required(),
      description: a.string().required(),
      price: a.integer().required(), // In cents to avoid precision, rounding issues
      images: a.hasMany("ProductImage", "productId"),
      mainImageS3Key: a.string(),
      isArchived: a.boolean(),
      stripeProductId: a.string(),
      stripePriceId: a.string(),
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
      isArchived: a.boolean(),
    })
    .secondaryIndexes((index) => [index("productId")])
    .authorization((allow) => [
      allow.guest().to(["read"]),
      allow.authenticated().to(["read"]),
      allow.group("Admins"),
    ]),

  // sets isArchived to true by default, false if "archive" is false
  archiveProduct: a
    .mutation()
    .arguments({ productId: a.id(), archive: a.boolean() })
    .returns(a.ref("Product"))
    .authorization((allow) => [allow.group("Admins")])
    .handler(
      a.handler.custom({
        dataSource: a.ref("Product"),
        entry: "./resolvers/archiveProduct.js",
      })
    ),
});
// .authorization((allow) => [allow.resource(createStripeProductFunction)])
export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "iam",
  },
});
