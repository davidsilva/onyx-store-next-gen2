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
        status: a.ref("ProductStatusType"),
      })
      .authorization((allow) => [
        allow.guest().to(["read"]),
        allow.authenticated().to(["read"]),
        allow.group("Admins"),
      ]),

    ProductStatusType: a.enum(["PENDING", "ACTIVE", "ARCHIVED"]),

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
        title: a.string().required(),
        rating: a.integer().required(),
        content: a.string().required(),
        productId: a.id(),
        product: a.belongsTo("Product", "productId"),
        userId: a.id(),
        user: a.belongsTo("UserProfile", "userId"),
        sentiment: a.string(),
        sentimentScoreMixed: a.float(),
        sentimentScoreNegative: a.float(),
        sentimentScoreNeutral: a.float(),
        sentimentScorePositive: a.float(),
        languageCode: a.string(),
        sentimentProcessed: a.boolean(),
        status: a.ref("ReviewStatusType"),
      })
      .secondaryIndexes((index) => [index("productId"), index("userId")])
      .authorization((allow) => [
        allow.guest().to(["read"]),
        allow.authenticated().to(["read"]),
        allow.owner().to(["read", "create", "update"]),
        allow.group("Admins"),
      ]),

    ReviewStatusType: a.enum([
      "PENDING",
      "ACTIVE",
      "ARCHIVED",
      "REJECTED",
      "FLAGGED",
      "UNDER_REVIEW",
      "APPROVED",
    ]),

    SentimentCounts: a
      .model({
        sentiment: a.string().required(),
        count: a.integer().required(),
        createdAt: a.datetime(),
        updatedAt: a.datetime(),
      })
      .identifier(["sentiment"])
      .authorization((allow) => [allow.group("Admins")]),

    ProductStatuses: a
      .model({
        status: a.string().required(),
        count: a.integer().required(),
        createdAt: a.datetime(),
        updatedAt: a.datetime(),
      })
      .identifier(["status"])
      .authorization((allow) => [allow.group("Admins")]),

    ReviewStatuses: a
      .model({
        status: a.string().required(),
        count: a.integer().required(),
        createdAt: a.datetime(),
        updatedAt: a.datetime(),
      })
      .identifier(["status"])
      .authorization((allow) => [allow.group("Admins")]),

    GeneralAggregates: a
      .model({
        entityType: a.string().required(), // E.g., "Product", "Review", "User"
        count: a.integer().required(),
        createdAt: a.datetime(),
        updatedAt: a.datetime(),
      })
      .identifier(["entityType"])
      .authorization((allow) => [allow.group("Admins")]),

    UserProfile: a
      .model({
        userId: a.id().required(),
        username: a.string().required(),
        preferredUsername: a.string(),
        // We don't want people to change their email directly in the db. Better if we allow them to change it via Cognito, and then update it in the db using a Lambda function.
        // Also, we don't want other people to see other people's email addresses. Note the use of ownerDefinedIn("profileOwner") in the email field.
        email: a
          .string()
          .authorization((allow) => [
            allow.group("Admins"),
            allow.ownerDefinedIn("profileOwner").to(["read"]),
          ]),
        birthdate: a.date(),
        givenName: a.string(),
        middleName: a.string(),
        familyName: a.string(),
        profilePicture: a.string(),
        // We don't want people to change ownership of their profile
        profileOwner: a
          .string()
          .authorization((allow) => [
            allow.ownerDefinedIn("profileOwner").to(["read"]),
            allow.group("Admins"),
            allow.guest().to(["read"]),
            allow.authenticated().to(["read"]),
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

    SentimentCountsType: a.customType({
      POSITIVE: a.integer(),
      NEGATIVE: a.integer(),
      NEUTRAL: a.integer(),
      MIXED: a.integer(),
    }),

    countReviewSentiments: a
      .query()
      .returns(a.ref("SentimentCountsType"))
      .authorization((allow) => [allow.group("Admins")])
      .handler(
        a.handler.custom({
          dataSource: a.ref("Review"),
          entry: "./resolvers/countSentiments.js",
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
