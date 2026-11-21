# kazeous.com

This is the repository for Kaze's personal website! To run this locally, you can follow the following steps:

1. Clone this repository.
2. Install the npm dependencies in both the root folder and the `api` folder using `npm i`.
3. Set `PORT=9000` and `NODE_ENV=development` in `api/.env`.
4. If `api/src/routes/local_scripts/hidden.json` is missing, create it with `[]` as its contents.
5. Run `npm run dev` in the root folder and in `api`, in separate terminals.

## Artwork uploads to Cloudflare R2

1. In Cloudflare, open **Storage & databases → R2 → Overview** and create a bucket, for example `artwork`.
2. Open the bucket's **Settings → Custom Domains**, connect a hostname from a domain in the same Cloudflare account, and wait for it to become active.
3. In the R2 overview, open **Manage API Tokens**. Create a token with **Object Read & Write** scoped to the artwork bucket.
4. Add the following values to `api/.env` and restart the API.

   ```dotenv
   PORT=9000
   NODE_ENV=development
   R2_ENDPOINT=https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com
   R2_BUCKET_NAME=artwork
   R2_ACCESS_KEY_ID=YOUR_R2_ACCESS_KEY_ID
   R2_SECRET_ACCESS_KEY=YOUR_R2_SECRET_ACCESS_KEY
   R2_PUBLIC_BASE_URL=https://art.example.com
   ```

`R2_ENDPOINT` takes the account-level S3 API origin without the bucket path. Use the endpoint for your bucket's jurisdiction, if applicable. `R2_PUBLIC_BASE_URL` is the custom domain from step 2.

The gallery uploader creates a catalog entry and writes the original plus three WebP variants. The **Hidden** checkbox selects the local catalog. Objects in the public bucket are readable by URL.

For existing artwork, copy the original and the variants under `thumbnail/`, `webp/`, and `near_lossless/` directly to R2 with their original keys and content types. Verify the public URLs before updating the existing catalog entries and other references.

[Create an R2 bucket](https://developers.cloudflare.com/r2/buckets/create-buckets/) · [Configure a public custom domain](https://developers.cloudflare.com/r2/buckets/public-buckets/) · [Create R2 API credentials](https://developers.cloudflare.com/r2/api/tokens/)
