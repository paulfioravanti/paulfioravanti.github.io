---
title: "Playing in Plaid's Sandbox"
date: 2020-11-29 18:15 +1100
last_modified_at: 2020-11-29 18:15 +1100
tags: plaid postman api
header:
  image: /assets/images/2020-11-29/plaid.jpg
  image_description: "plaid pattern"
  teaser: /assets/images/2020-11-29/plaid.jpg
  overlay_image: /assets/images/2020-11-29/plaid.jpg
  overlay_filter: 0.4
  caption: >
    Photo from [pxfuel](https://www.pxfuel.com/en/free-photo-jokzz)
excerpt: >
  Making API calls to Plaid's Sandbox Environment: The Missing Manual
---

I had a software client who required an integration to [Plaid][], a financial
technology company specializing in bank login verification.

If you are in a similar position, and are attempting to get started with
[Plaid's Application Programming Interface (API)][Plaid API], then this post
may be of assistance to you in setting up and using their [Plaid Postman
Collection][] with [Postman][] (if not, then this post will probably not make
that much sense, and I will not be offended if you bail out now).

I found that even with the [Plaid documentation][], it still took me quite a bit
of time to figure out how to get valid responses from the [Plaid Sandbox][]. I
originally submitted the content of this post as a [documentation pull
request][plaid/plaid-postman#10], but it seems that Plaid was not interested,
and so I figure it can live here on my blog.

The following is meant to be read _after_ you have completed the steps in the
[Getting Started][Plaid Postman Getting Started] section of the
[Plaid Postman `README`][].

## Making Plaid API calls

Most Plaid API calls require a [Plaid Token][] in the form of an `access_token`
(or an `asset_report_token` when dealing with a [Plaid Asset][]).

After you have imported and configured the request collection in Postman, if you
open up the _Retrieve Auth_ request and click the _Send_ button, you will
receive something like the following error:

![retrieve-auth-no-access-token][]

Opening up the _Body_ tab of the request will reveal the issue:

![retrieve-auth-default-body][]

You can see that the `access_token` contains an invalid place holder
(`"ENTER_ACCESS_TOKEN_HERE"`), leading to the request failing. So, how can you
use the Postman Collection to generate a valid `access_token`?

You will need to emulate the [Exchange Token Flow][] process by using the
following included API requests:

- _Create Item [Sandbox Only]_
- _Exchange Token_

Only then can you begin using the generated `access_token` to make other
requests. So, let's set about doing just that.

### Create a Public Token

First, you need to [create a `public_token`][] using the _Create Item
[Sandbox Only]_ request. Simply open it up, click the _Send_ button, and you
should see a response similar to the following:

![create-public-token][]

If you are going to need to use the [Assets API][Plaid Asset], then make sure
you open up the Body tab of the request and add `"assets"` to the
`initial_products` array, and _then_ generate your token. Otherwise, your
`public_token` will not have the correct permissions set to use
[Assets][Plaid Asset]:

![create-public-token-with-assets-product][]

### Create an Access Token

Next, use the `public_token` you generated in the previous step to generate an
`access_token` with the _Exchange Token_ request.

Paste your `public_token` into the `"public_token"` field into the _Body_
section of the request. Click the _Send_ button, and you should see a response
similar to the following:

![create-access-token-from-public-token][]

An `access_token` associated to an Item does not expire, so you can use it in
all of your requests. The Postman Collection has an `access_token` environment
variable field available where you can store your generated access token, so
I would suggest putting your newly generated token in there.

![add-access-token-to-env-variables][]

### Use Access Token in API Calls

Now, go back to the _Retrieve Auth_ request that failed earlier, open up the
_Body_ of the request, and set the `access_token` field to be a reference to the
access token set in your environment variables. Do this by changing the value to
be {% raw %}`"{{access_token}}"`{% endraw %}. Then, click the _Send_ button, and
you should see a successful response.

![retrieve-auth-with-access-token][]

You can now repeat this step for any other Plaid API that requires an
`access_token`.

### Create an Asset Report Token

As well as using `access_tokens`, Plaid Asset Reports have their own
`asset_report_token` that need to be used when using the _Retrieve an Asset
Report_ request.

You generate an `asset_report_token` using the _Create Asset Report_ request.

Open up the request _Body_ tab, and add a reference to your access token
({% raw %}`"{{access_token}}"`{% endraw %}) to the array in the `access_tokens`
field. Then, click the _Send_ button, and you should see a response similar to
the following:

![create-asset-report-token-with-access-token][]

(The `options` object that is included by default in the _Body_ was removed here
for brevity).

Similar to an `access_token`, an `asset_report_token` also does not expire, so
you can use it in all of your asset report-related requests.

The Postman Collection has an `asset_report_token` environment variable field
available where you can store your generated token, so I would suggest putting
it here with your `access_token`.

![add-asset-report-token-to-env-variables][]

### Use Asset Report Token in API Calls

Now, you can try an API request like the _Retrieve an Asset Report (JSON)_
request, which requires an `asset_report_token`.

Open up the Body of the request, and set the `asset_report_token` field to be a
reference to the asset report token set in your environment variables
({% raw %}`"{{asset_report_token}}"`{% endraw %}). Then,
click the _Send_ button, and you should see a successful response.

![retrieve-asset-report-with-asset-report-token][]

You should now be all set up and ready to begin playing in Plaid's Sandbox with
any API that requires an `access_token` or `asset_report_token`.

[add-asset-report-token-to-env-variables]: /assets/images/2020-11-29/add-asset-report-token-to-env-variables.png
[add-access-token-to-env-variables]: /assets/images/2020-11-29/add-access-token-to-env-variables.png
[create a `public_token`]: https://plaid.com/docs/#creating-public-tokens
[create-access-token-from-public-token]: /assets/images/2020-11-29/create-access-token-from-public-token.png
[create-asset-report-token-with-access-token]: /assets/images/2020-11-29/create-asset-report-token-with-access-token.png
[create-public-token]: /assets/images/2020-11-29/create-public-token.png
[create-public-token-with-assets-product]: /assets/images/2020-11-29/create-public-token-with-assets-product.png
[Exchange Token Flow]: https://plaid.com/docs/#exchange-token-flow
[Plaid]: https://plaid.com/
[Plaid API]: https://plaid.com/docs/api/
[Plaid Asset]: https://plaid.com/docs/#assets
[Plaid documentation]: https://plaid.com/docs/
[plaid/plaid-postman#10]: https://github.com/plaid/plaid-postman/pull/10
[Plaid Postman Collection]: https://github.com/plaid/plaid-postman
[Plaid Postman Getting Started]: https://github.com/plaid/plaid-postman/tree/451f5bb701a0c5291732bd1f8be3c20884e94fa5#getting-started
[Plaid Postman `README`]: https://github.com/plaid/plaid-postman/blob/master/README.md
[Plaid Sandbox]: https://plaid.com/docs/sandbox/
[Plaid Token]: https://plaid.com/docs/#plaid-tokens-public_token-access_token-or-asset_report_token
[Postman]: https://www.postman.com/
[retrieve-asset-report-with-asset-report-token]: /assets/images/2020-11-29/retrieve-asset-report-with-asset-report-token.png
[retrieve-auth-default-body]: /assets/images/2020-11-29/retrieve-auth-default-body.png
[retrieve-auth-no-access-token]: /assets/images/2020-11-29/retrieve-auth-no-access-token.png
[retrieve-auth-with-access-token]: /assets/images/2020-11-29/retrieve-auth-with-access-token.png
