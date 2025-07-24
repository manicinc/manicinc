---
title: "⟨/⟩ Contribute to the Looking Glass: Synthetic Publishing Platform"
date: "2025-04-10"
excerpt: "Learn how to contribute your experimental ideas and digital explorations to our synthetic publishing platform."
author: "Manic Agency"
category: "documentation"
tags: ["contribution", "guide", "markdown", "writing", "open-source"]
image: "/og-default.webp"
---

# ⟨/⟩ Contribute to the Synthetic Publishing Platform

> This guide outlines how to contribute to our experimental publishing platform and provides a comprehensive reference for our enhanced markdown features.

:::banner{backgroundColor="var(--accent-primary)", textColor="white", size="large", icon="📡"}
The digital frontier isn't found. It's synthesized.
:::

## 🌐 About Manic.agency

**The Looking Glass** is an **experimental publishing platform** transcending traditional journalistic mediums. We are a digital space dedicated to exploring:

- Pop Culture Analysis
- Experimental UI/UX
- Creative Coding
- AI (ML, DL, LLMs, GenAI)
- Speculative Technology
- Security, Privacy, and Digital Liberty
- Philosophical Musings
- Interdisciplinary Explorations

As the code and all articles are open-source on GitHub, *anyone* can fork and download the archive and host or own the blog content for themselves. And as such, your work submitted to The Looking Glass will never disappear.

This site is built and operated by [https://manic.agency](https://manic.agency).

## 📡 Contribution Protocol

### Submission Process

1. **Fork the Repository**: Start by forking `manicinc/manicinc` on GitHub.
2. **Create Content File**:
   * Location: `src/posts/[category]/your-article-slug.md` (or `.mdx`)
   * Choose an appropriate `[category]` (e.g., `experiments`, `research`, `tutorials`, `theory`).
3. **Add Supporting Images**:
   * Location: `public/assets/blog/[your-article-slug]/` (Create this folder).
   * Use relative paths like `/assets/blog/your-article-slug/image.jpg` in your markdown.
4. **Open a Pull Request**: Submit a PR from your fork to our main branch.
5. **Engage with Feedback**: Respond to comments and requested changes during the review process.

## 📊 Markdown & Metadata Structure

### Required Metadata

Every contribution must include a comprehensive YAML frontmatter:

```yaml
---
title: "Your Neural Interface Exploration" # Engaging Title
date: "2025-04-20" # Correct Date
excerpt: "A concise, compelling summary (approx. 1-2 sentences) of your digital exploration."
author: "Your Identifier" # Your GitHub handle or chosen name
category: "experiments" # Choose one: experiments, research, tutorials, theory, documentation
tags: ["neural-interfaces", "synthetic-media", "speculative-tech"] # Relevant keywords
image: "/assets/blog/your-article-slug/featured-image.jpg" # Path relative to /public
---
```

### Extended Metadata Options

You can add these optional fields for more control:

```yaml
authorBio: "Brief context about your relevant background and work." # Displayed on author pages
featured: true # Promotes content to featured sections on homepage/elsewhere
sortOrder: 3 # Controls display order in featured collections (lower number = higher priority)
# --- Advanced Styling (Use Sparingly) ---
# bgColor: "#0a0b13" # Custom page background color in HEX format (overrides theme)
# textColor: "#7f5af0" # Custom page text color in HEX format (overrides theme)
```

## 🧠 Advanced Content Formatting

Our renderer supports enhanced Markdown syntax for richer content presentation.

### Lead Paragraphs

Create prominent lead paragraphs using `>>>` at the start of the paragraph.

```markdown
>>> This is a lead paragraph that will appear more prominently and set the tone for the article. It uses a distinct font and styling.
```

Renders as:

> This is a lead paragraph that will appear more prominently and set the tone for the article. It uses a distinct font and styling.

### Styled Quotes

Create elegant, centered quotes with optional attribution using the `*""*` marker within a blockquote. Attribution should follow in the next paragraph, optionally starting with —.

```markdown
> *"The best way to predict the future is to invent it."*
> — Alan Kay
```

Renders as:

> *"The best way to predict the future is to invent it."*
> — Alan Kay

(Note: Standard blockquotes using just `>` will render with the `.standard-blockquote` style).

### Banners

Add eye-catching banners.

```markdown
:::banner{backgroundColor="var(--accent-highlight)", textColor="var(--color-dark-bg)", size="medium", icon="🚀"}
Your important announcement or highlight text here! Banners grab attention.
:::
```

Available options for `{...}`:

- `backgroundColor`: Any valid CSS color (var(--accent-...), #hex, rgb(...)).
- `textColor`: Any valid CSS color.
- `size`: small, medium, large (affects padding).
- `alignment`: left, center, right (text alignment).
- `icon`: Any emoji or short text string.

### Image Controls

#### Comprehensive Image Formatting

Use pipe (`|`) separators within the alt text to control image appearance.

```markdown
![Circuit board close-up|size=medium|align=left|effect=glow|border=gradient|caption=Experimental neural processing unit|zoomable=true](/assets/images/placeholder-600x400.png)
```

##### Size Options
- `small`: Compact (`max-width: 300px`).
- `medium`: Standard (`max-width: 500px`).
- `large`: Expanded (`max-width: 800px`).
- `full`: Full content width.

##### Alignment Options
- `left`: Float left, text wraps right.
- `center`: Center align (default).
- `right`: Float right, text wraps left.

##### Visual Effects
- `shadow`: Subtle drop shadow.
- `glow`: Ethereal accent glow.
- `glitch`: Interactive hover effect (requires specific implementation).
- `none`: No effect.

##### Border Styles
- `simple`: Basic 1px theme border.
- `gradient`: Accent gradient border.
- `glow`: Glowing accent border.
- `inset`: Inset shadow border.
- `dashed`: Dashed accent border.
- `none`: No border (default).

##### Zooming Control
- `zoomable=true`: Enable click-to-zoom (default).
- `zoomable=false`: Disable zooming.

### Image Grid Layouts

Use the `<ImageGrid>` component for responsive grids.

```markdown
<ImageGrid columns={3}>
  ![First image description|caption=Grid Image 1](/assets/images/placeholder-400x300.png)
  ![Second image description|caption=Grid Image 2](/assets/images/placeholder-400x300.png)
  ![Third image description|caption=Grid Image 3](/assets/images/placeholder-400x300.png)
</ImageGrid>
```

### Custom Callouts

Use blockquotes starting with `> :::type` for formatted callouts.

#### Note:
```markdown
> :::note
> Important implementation details and context go here.
```

#### Warning:
```markdown
> :::warning
> Experimental features alert. Proceed with caution and awareness of potential instability.
```

#### Tip:
```markdown
> :::tip
> Optimization suggestions and helpful hints for better performance or understanding.
```

#### Alert:
```markdown
> :::alert
> Critical considerations, security vulnerabilities, or must-know information demanding attention.
```

### Code Blocks

Standard fenced code blocks with language identifiers for syntax highlighting.

```javascript
// Example JavaScript with highlighting
function generatePattern(complexity, seed) {
  const base = seed || Math.random();
  // Generate complex array based on input
  return Array(complexity).fill(0).map((_, i) => ({
    weight: base * (i / complexity) * Math.sin(i),
    activation: i % 2 ? 'sigmoid' : 'relu', // Alternating activation
    connections: Math.floor(complexity / (i + 1))
  }));
}
```

### Data Tables

Use standard GitHub Flavored Markdown tables.

```markdown
| Parameter   | Range       | Default   | Impact         |
|-------------|-------------|-----------|----------------|
| Latency     | 10-100ms    | 30ms      | Responsiveness |
| Precision   | 0.1-0.001   | 0.01      | Detail level   |
| Iterations  | 1-10        | 3         | Processing depth |
| Convergence | 0.95-0.999  | 0.99      | Stability      |
```

### Mathematical Formulas

Use LaTeX syntax within `$` for inline and `$$` for block formulas.

Inline formula: `$E = mc^2$` showcases energy-mass equivalence.

Block formula:

```markdown
$$
\mathcal{L}(\theta) = \sum_{i=1}^{N} \log P(y_i | x_i; \theta) - \lambda R(\theta)
$$
```

## 📁 Content Structure Example

Organize your posts logically within the `/src/posts/` directory:

```
/src/posts
├── experiments/              <-- For new prototypes, explorations
│   ├── neural-interface-prototype.md
│   └── synthetic-media-generation.md
├── research/                 <-- For deeper analysis, findings
│   └── emergent-system-behaviors.md
├── tutorials/                <-- For step-by-step guides
│   └── building-with-synthstack.md
├── theory/                   <-- For conceptual frameworks, ideas
│   └── digital-consciousness-parameters.md
└── documentation/            <-- For platform guides like this one
    └── contribution-guide.md
```

## 🧪 Technical Rendering Capabilities

Our platform supports:

- Enhanced typography with lead paragraphs (`>>>`) and styled quotes (`*"..."*`)
- Banners (`:::banner`) and callouts (`> :::note`, etc.) for highlighting
- Comprehensive image formatting via alt text (`|size=...|align=...`)
- Syntax highlighting with copy button (standard ` ```lang `)
- Mathematical formula rendering via KaTeX (`$...$`, `$$...$$`)
- Responsive image grids (`<ImageGrid>` - requires MDX/component setup)
- Standard GFM Tables
- Basic HTML via rehype-raw (e.g., `<mark>`, `<div style="...">`)

## 🔮 Feature Roadmap

| Feature                   | Status          | Description                         |
|---------------------------|-----------------|-------------------------------------|
| ✅ Image Controls         | Implemented     | Sizing, align, effect, border, caption |
| ✅ Code Highlighting      | Implemented     | PrismJS themes, copy button         |
| ✅ Image Grids            | Implemented     | Responsive layouts via component    |
| ✅ Custom Callouts        | Implemented     | Note, Warning, Tip, Alert blocks    |
| ✅ Styled Quotes & Banners| Implemented     | Enhanced typography blocks          |
| ✅ Table Formatting       | Implemented     | Responsive GFM data tables          |
| ✅ Math Formulas          | Implemented     | KaTeX integration                   |
| 🔄 Interactive Code       | In Development  | Editable/runnable examples          |
| 🔄 SVG Diagram Generation | In Development  | Code-to-diagram rendering (Mermaid?) |
| 📝 Data Visualization     | Planned         | Chart generation from tables        |
| 📝 Timeline Components    | Planned         | Interactive concept timelines       |

## 🔬 Real-World Examples

### Lead Paragraph

```markdown
>>> This introductory paragraph stands out with larger text and styling, creating visual hierarchy and establishing context for the reader before diving into detailed content.
```

### Styled Quote

```markdown
> *"The digital frontier isn't found. It's synthesized."*
> — Manic Agency
```

### Banner

```markdown
:::banner{backgroundColor="var(--accent-highlight)", textColor="#1a111b", icon="🚀"}
Launch into the digital frontier with our experimental platform!
:::
```

### Image Formatting

```markdown
![Neural network visualization|size=medium|align=center|effect=glow|border=gradient|caption=Synthetic neural pathway mapping](/assets/images/placeholder-600x400.png)
```

### Image Grid

```markdown
<ImageGrid columns={3}>
![Neural interface v1|caption=Version 1](/assets/images/placeholder-400x300.png)
![Neural interface v2|caption=Version 2](/assets/images/placeholder-400x300.png)
![Neural interface v3|caption=Version 3](/assets/images/placeholder-400x300.png)
</ImageGrid>
```

### Custom Callout

```markdown
> :::warning
> This experimental feature may produce unpredictable results when integrated with legacy systems. Use with appropriate testing protocols.
```

### Mathematical Formula

```markdown
Inline math uses single dollars: $\alpha = \frac{\beta}{\gamma}$. Block math uses double dollars:
$$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$$
```

## 🕳️ Advanced Typography Techniques

### Text Emphasis

Beyond basic markdown formatting, our platform supports:

- Bold text using **double asterisks**
- Italic text using *single asterisks*
- Bold italic text using ***triple asterisks***
- Inline code using `backticks`
- ~~Strikethrough~~ using ~~double tildes~~
- Highlighted text using `<mark>HTML mark tags</mark>` (requires rehype-raw)

### Text Alignment

You can control text alignment using HTML div wrappers (requires rehype-raw):

```html
<div style="text-align: center;">This text will be centered.</div>
<div style="text-align: right;">This text will be right-aligned.</div>
<div style="text-align: justify;">Justified text wraps to fill the container width, aligning both left and right margins, which can be useful for certain layouts but should be used judiciously for readability.</div>
```

### Drop Caps and Typography

The first letter of the first paragraph in your content will automatically be styled as a drop cap (unless it's a `>>>` lead paragraph). You generally don't need to do anything for this.

## 🧩 Component Integration Examples

### Full Example: Image + Caption + Effects

```markdown
## Neural Interface Evolution

![Neural interface prototype|size=large|align=center|effect=glow|border=gradient|caption=Third-generation neural mapping interface with enhanced synaptic connectivity|zoomable=false](/assets/images/placeholder-800x500.png) 

The third-generation interface introduces quantum entanglement principles to traditional neural mapping algorithms, resulting in significantly faster state resolution and reduced decoherence over extended operational periods. This breakthrough allows for...
```

### Full Example: Callout + Code

```markdown
> :::tip
> Optimize your neural network by adjusting the activation threshold parameters dynamically based on input entropy.

```javascript
// Example optimization function
function optimizeNetwork(network, threshold = 0.75, entropyFactor = 0.1) {
  const currentEntropy = calculateEntropy(network.input); // Assuming this function exists
  const dynamicThreshold = threshold + (entropyFactor * (1 - currentEntropy));

  return network.nodes.map(node => ({
    ...node,
    // Use dynamic threshold for activation
    activation: node.signal > dynamicThreshold ? 'sigmoid' : 'relu',
    weight: node.signal > dynamicThreshold 
      ? node.weight * (1 + entropyFactor)
      : node.weight * (1 - entropyFactor)
  }));
}
```

### Full Example: Banner + Lead Paragraph

```markdown
:::banner{backgroundColor="#7f5af0", textColor="white", icon="💡"}
New Experimental Feature: Quantum Neural Bridging
:::

>>> Quantum Neural Bridging represents a paradigm shift in how synthetic systems process non-linear decision matrices. This introductory overview covers the fundamental principles and implementation considerations for integrating QNB modules.
```

## 🔌 Implementation Checklist

When submitting your contribution, ensure:

- [x] Frontmatter contains all required metadata (title, date, excerpt, author, category, tags, image).
- [x] Images are reasonably optimized (size/format) and stored in /public/assets/blog/your-slug/.
- [x] Custom formatting syntax (>>>, *"..."*, > :::type, :::banner, Image attributes) is used correctly.
- [x] Code examples use correct language identifiers for highlighting and are functional.
- [x] All external links are valid and accessible.
- [x] Content is original or properly attributed (use standard blockquotes > for third-party quotes).

## 📡 Transmission Protocol

We're an experimental platform operating beyond traditional disciplinary boundaries. We build the tools, systems, and theories we wish existed.

Your anomalous contributions are welcome.

Synthesize the unexpected.