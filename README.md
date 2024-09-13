# NextJS + TypeScript + Amplify Gen 2

This repo accompanies these videos and is mainly for reference: [Getting Started with NextJS and AWS Amplify Gen 2](https://youtube.com/playlist?list=PL7FXjzyGAf4WIUnktuJAGk5x7WhcHvQuP&si=b7Ost60CMWAN0DCF).

What we have here is a demo app to show NextJS working with AWS Amplify Gen 2. It's the beginning of an app that will allow...

- all users (authenticated and unauthenticated) to add items to a shopping cart
- authenticated users to rate and review products
- authenticated users to customize a user profile
- authenticated users to checkout and submit payment information (Stripe in demo/dev mode)
- admin users to create, update and delete products, including uploading images

Those features will allow us to exercise various Amazon services via Amplify, including Cognito, DynamoDB, S3, Lambda, and AppSync (GraphQL).

The app currently includes the following capabilities:

- sign up, sign in and sign out
- creating, updating and deleting products
- adding multiple images to a product
- creating and updating product and price objects in Stripe, and adding Stripe IDs to our product.
- allowing users to rate and review products
- user profiles

The code in this repo currently demonstrates...

- auth configuration in amplify/auth/resource.ts that creates an "Admins" group and specifies that users will sign in using an email address.
- a schema in amplify/data/resource.ts for a Product model and ProductImage model that are connected via a one-to-many relationship; a Review model that's connected to a UserProfile model. (Products and UserProfiles can have many Reviews, a Review can have only one UserProfile, a Review can have only one Product.)
- field-level authorization, e.g., only the owner of a UserProfile may read his email address; a UserProfile owner may read but not change the ownership of his own UserProfile.
- permissions that allow authenticated and unauthenticated users to read the Product and ProductImage data.
- permissions that allow members of the Admins group to create, update and delete Product and ProductImage items.
- configuration of an S3 bucket for storing product images.
- in utils/amplify-utils.ts the creation of a cookie-based client for accessing data, and determining signed-in and admin status, from server-side-rendered pages.
- utils/middleware.ts middleware for limiting access to admin/\* pages to admin users.
- forms for creating and updating products, including uploading images for a product and entering alt text for images.
- using Amplify's Authenticator client component and context provider.
- allowing the user to supply user attribute values at sign up.
- an admin context provider and custom hook so that client components can determine whether of not a user is an admin.
- use of Amplify's StorageManager and StorageImage React components.
- use of various components from Amplify's ui-react library.
- creating a Lambda function -- but not not by using Amplify's `defineFunction()`, as Amplify currently has "circular dependency" issues.
- using a Lambda function to respond to an INSERT, MODIFY and REMOVE events in the Product table, and then calling the Stripe API to create and update product and price objects, and finally updating the product in our table with the Stripe product and price IDs.
- an AppSync JavaScript resolver to toggle the "isArchived" field of a Product.

## Relevant Links

- [AWS Amplify](https://aws.amazon.com/amplify/)
- [AWS Amplify Discord Channel](https://discord.gg/R42X9TbS)
- [AWS Amplify GitHub Repo](https://github.com/aws-amplify/)
- [Setting Up an AWS Dev Account](https://aws.amazon.com/free)
- [Setting Up Amplify](https://docs.amplify.aws/nextjs/start/account-setup/)
- [Manual Installation of Amplify](https://docs.amplify.aws/react/start/manual-installation/)
- [React UI Library for Amplify](https://ui.docs.amplify.aws/)
- [NextJS Amplify Adapter](https://docs.amplify.aws/nextjs/build-a-backend/server-side-rendering/)
- [Sandbox Environments](https://docs.amplify.aws/react/deploy-and-host/sandbox-environments/setup/)
- [Per-developer Cloud Sandboxes](https://aws.amazon.com/blogs/mobile/team-workflows-amplify/)
- [Server-Side Rendering for Amplify](https://docs.amplify.aws/react/build-a-backend/server-side-rendering/)
- [Authenticator](https://ui.docs.amplify.aws/react/connected-components/authenticator/advanced)
- [Amplify Hub Eventing System](https://docs.amplify.aws/gen1/react/build-a-backend/utilities/hub/)
- [Amplify Connected Forms](https://docs.amplify.aws/nextjs/build-ui/formbuilder/)
- [Getting Started with Vite, Vitest, AWS Amplify and React](https://medium.com/@davidavilasilva/getting-started-with-vite-vitest-aws-amplify-and-react-12b7ed337a93) I wrote this article based on Amplify Gen 1 but the parts about implementing custom authentication rather than using the Authenticator component are still relevant.

## Version History

- **\*0.1.3** -- 2024-09-12

  - Release to coincide with [Getting Started with AWS Amplify Gen 2 NextJS Part 5: Post-Confirmation Lambda & User Profiles](https://youtu.be/PqfMNbb8OuE)
  - Finishing the first pass of integration with Stripe: handle product updates.
  - Using a post-confirmation Lamba function to create a User Profile in DynamoDB
  - Allowing users to rate and review products

- **\*0.1.2** -- 2024-08-16

  - Release to coincide with [Getting Started with Amplify Gen 2: Stripe & Lambda Functions Part 4](https://youtu.be/ZLZYq6T0sY0)
  - On creation of a new product, we call the Stripe API to create product and price objects. We then update the product in our table with Stripe product and price IDs.

- **\*0.1.1** -- 2024-07-30

  - Release to coincide with [second video](https://youtu.be/1H6S5O4C6G8)
  - Added support for multiple images for each product, setting one image as a "main" image, and adding alt text for images.

- **v0.1.0** -- 2024-07-15
  - Release to coincide with [first video](https://youtu.be/HV_oiZWUJXc)
  - Allowed sign-up and sign-in.
  - Admin could create, update and delete products.
  - Admin could upload and associate a single image with each product.
