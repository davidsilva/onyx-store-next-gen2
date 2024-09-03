import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { postConfirmation } from "../auth/post-confirmation/resource";

const schema = a
  .schema({
    Product: a
      .model({
        name: a.string().required(),
        description: a.string().required(),
        price: a.integer().required(), // In cents to avoid precision, rounding issues
        images: a.hasMany("ProductImage", "productId"),
        mainImageS3Key: a.string(),
        isActive: a.boolean(), // whether the product is available for purchase
        isArchived: a.boolean(), // effectively a soft delete
        stripeProductId: a.string(),
        stripePriceId: a.string(),
        reviews: a.hasMany("Review", "productId"),
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

    Review: a
      .model({
        rating: a.integer().required(),
        content: a.string().required(),
        productId: a.id(),
        product: a.belongsTo("Product", "productId"),
        userId: a.id(),
        user: a.belongsTo("UserProfile", "userId"),
      })
      .authorization((allow) => [
        allow.guest().to(["read"]),
        allow.authenticated().to(["read"]),
        allow.owner().to(["read", "create", "update"]),
        allow.group("Admins"),
      ]),

    UserProfile: a
      .model({
        userId: a.id().required(),
        username: a.string().required(),
        preferredUsername: a.string(),
        email: a.string().required(),
        birthdate: a.date(),
        givenName: a.string(),
        middleName: a.string(),
        familyName: a.string(),
        profilePicture: a.string(),
        // We don't want people to change ownership of their profile
        profileOwner: a
          .string()
          .authorization((allow) => [
            allow.owner().to(["read"]),
            allow.group("Admins"),
            allow.authenticated().to(["read"]),
            allow.guest().to(["read"]),
          ]),
        reviews: a.hasMany("Review", "userId"),
      })
      .secondaryIndexes((index) => [
        index("username"),
        index("email"),
        index("userId"),
      ])
      .authorization((allow) => [
        allow.ownerDefinedIn("profileOwner").to(["read", "update"]),
        allow.group("Admins"),
        allow.guest().to(["read"]),
        allow.authenticated().to(["read"]),
        allow.owner().to(["read", "create", "update"]),
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
  })
  .authorization((allow) => [allow.resource(postConfirmation)]);
// .authorization((allow) => [allow.resource(createStripeProductFunction)])
export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
