# Manic Agency

## Getting Started

To run the Manic Agency website locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/manicinc/manicinc.git
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000)

## Features

- **Dynamic SEO**: Metadata automatically adapts based on site section (main site, blog, projects)
- **Adaptive Theming**: Different theme styles and favicons for blog section vs main site

## Content Management

The site uses a filesystem-based content management approach:
- Blog posts (Looking Glass) are in `/content/blog`
- Projects (portfolio) are in `/content/projects`

## Write for us!

We welcome [contributions](https://manic.agency/blog/tutorials/contribute).

## Deployments

Pages are automatically built on commit to `master`.

The output of the build is stored in the `gh-pages` branch and that is what is served on the GitHub pages for this repo.

See the site at [https://manicinc.github.io](https://manicinc.github.io).