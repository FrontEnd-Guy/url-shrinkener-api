# URL Shortener Backend ( Reference: 531 )

## Features

- **URL Shortening**: Shorten long URLs to concise, shareable links.
- **Custom Slugs**: Provide custom slugs for personalized URL aliases.
- **URL Redirection**: Automatically redirect users from the shortened URL to the original URL.
- **Pagination**: List all shortened URLs with pagination support.
- **Error Handling**: Error handling for invalid URLs or slugs.

## Installation and Running

1. Clone the repository

```bash[
git clone https://github.com/FrontEnd-Guy/url-shrinkener-api.git
cd url-shrinkener-api
```

2. Install dependencies

```bash
npm install
```

3. Start the server

```bash
npm start
```

The application will be available at http://localhost:3001

## API Endpoints

- **Create Shortened URL**: `POST /s` with `fullUrl` and `slug` in the body.
- **Get All URLs**: `GET /s?page=<PAGE_NUMBER>&limit=<PAGE_LIMIT>`
- **Redirect to Full URL**: `GET /s/:slug`
- **Update URL**: `PATCH /s/:slug` with `newFullUrl` and `newSlug` in the body.
- **Delete URL**: `DELETE /s/:slug`
