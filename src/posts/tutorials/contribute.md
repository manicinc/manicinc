---
title: "⟨/⟩ Contribute to the Synthetic Publishing Platform"
date: "2025-04-10"
excerpt: "Learn how to contribute your experimental ideas and digital explorations to our synthetic publishing platform."
author: "Manic Agency"
category: "documentation"
tags: ["contribution", "guide", "markdown", "writing", "open source"]
image: "/og-default.png"
---

> This guide outlines how to contribute to our experimental publishing platform and provides a comprehensive reference for our enhanced markdown features.

:::banner{backgroundColor="var(--accent-primary)", textColor="white", size="large", icon="📡"}
The digital frontier isn't found. It's synthesized.
:::

## 🌐 About Manic.agency

Manic.agency is an **experimental publishing platform** that transcends traditional content management systems. We are a digital space dedicated to exploring:

- Experimental UI/UX
- AI Systems
- Creative Coding
- Synthetic Media
- Speculative Technology
- Interdisciplinary digital explorations

## 📡 Contribution Protocol

### Submission Process

1. **Fork the Repository**
2. **Create Content File**
   - Location: `src/posts/[category]/your-article-slug.md`
3. **Add Supporting Images**
   - Location: `public/assets/blog/[your-article-slug]/`
4. **Open a Pull Request**
5. **Engage with Feedback**

## 📊 Markdown & Metadata Structure

### Required Metadata

Every contribution must include a comprehensive YAML frontmatter:

```yaml
---
title: "Your Neural Interface Exploration"
date: "2025-04-10"
excerpt: "A concise summary of your digital exploration."
author: "Your Identifier"
category: "experiments"
tags: ["neural-interfaces", "synthetic-media", "speculative-tech"]
image: "/assets/blog/your-article-slug/featured-image.jpg"
---
```

### Extended Metadata Options

```yaml
authorBio: "Brief context about your relevant background and work."
featured: true  # Promotes content to featured sections
sortOrder: 3    # Controls display order in featured collections
bgColor: "#0a0b13"  # Custom background color in HEX format
textColor: "#7f5af0"  # Custom text color in HEX format
```

## 🧠 Advanced Content Formatting

### Lead Paragraphs

Create prominent lead paragraphs with the `>>>` syntax:

```markdown
>> This is a lead paragraph that will appear more prominently and set the tone for the article.
```

>>> This is a lead paragraph that will appear more prominently and set the tone for the article.

### Styled Quotes

Create elegant, centered quotes with attribution:

```markdown
> *"The best way to predict the future is to invent it."*
>
> Alan Kay
```

> *"The best way to predict the future is to invent it."*
>
> Alan Kay

### Banners

Add eye-catching banners with customizable colors:

```markdown
:::banner{backgroundColor="var(--accent-highlight)", textColor="white", size="medium", icon="🚀"}
Your important announcement or highlight text here
:::
```

:::banner{backgroundColor="var(--accent-highlight)", textColor="white", size="medium", icon="🚀"}
Your important announcement or highlight text here
:::

Available options:
- `backgroundColor`: Any CSS color value
- `textColor`: Any CSS color value
- `size`: `small`, `medium`, or `large`
- `alignment`: `left`, `center`, or `right`
- `icon`: Any emoji or text character

### Image Controls

#### Comprehensive Image Formatting

```markdown
![Circuit board close-up|size=medium|align=left|effect=glow|border=gradient|caption=Experimental neural processing unit](/path/to/circuit.jpg)
```

##### Size Options
- `small`: Compact (300px max)
- `medium`: Standard (500px max)
- `large`: Expanded (800px max)
- `full`: Full-width display

##### Alignment Options
- `left`: Text wraps right
- `center`: Centered display
- `right`: Text wraps left

##### Visual Effects
- `shadow`: Subtle drop shadow
- `border`: Defined border
- `glow`: Ethereal accent glow
- `glitch`: Interactive hover effect

##### Border Styles
- `simple`: Basic border
- `gradient`: Accent gradient border
- `glow`: Glowing border
- `inset`: Inset shadow
- `dashed`: Dashed border
- `none`: No border (default)

##### Zooming Control
- `zoomable=true`: Enable click-to-zoom (default)
- `zoomable=false`: Disable zooming

### Image Grid Layouts

```markdown
<ImageGrid columns=3>
  ![First image](/path/to/image1.jpg)
  ![Second image](/path/to/image2.jpg)
  ![Third image](/path/to/image3.jpg)
</ImageGrid>
```

### Custom Callouts

```markdown
:::note
Important implementation details.
:::
```

:::note
Important implementation details.
:::

```
:::warning
Experimental features alert.
:::
```

:::warning
Experimental features alert.
:::

```
:::tip
Optimization suggestions.
:::
```
:::tip
Optimization suggestions.
:::

```
:::alert
Critical considerations.
:::
```
:::alert
Critical considerations.
:::
```

### Code Blocks

Supports syntax highlighting across multiple languages with automatic copy button:

```javascript
function generatePattern(complexity, seed) {
  const base = seed || Math.random();
  return Array(complexity).fill(0).map((_, i) => ({
    weight: base * (i / complexity) * Math.sin(i),
    activation: i % 2 ? 'sigmoid' : 'relu',
    connections: Math.floor(complexity / (i + 1))
  }));
}
```

### Data Tables

```
| Parameter | Range | Default | Impact |
|-----------|-------|---------|--------|
| Latency | 10-100ms | 30ms | Responsiveness |
| Precision | 0.1-0.001 | 0.01 | Detail level |
| Iterations | 1-10 | 3 | Processing depth |
```

### Mathematical Formulas

Mathematical formulas using TeX notation:

Inline formula: $f(x) = x^2 + 2x + 1$

Block formula:
$$
f(x) = \sum_{i=0}^{n} \frac{a_i}{1 + e^{-(x-b_i)/c_i}}
$$

## 📁 Content Structure

```
/src/posts
  ├── experiments/
  │   ├── neural-interface-prototype.md
  │   └── synthetic-media-generation.md
  ├── research/
  │   └── emergent-system-behaviors.md
  ├── tutorials/
  │   └── building-with-synthstack.md
  └── theory/
      └── digital-consciousness-parameters.md
```

## 🧪 Technical Rendering Capabilities

Our platform supports:
- Enhanced typography with lead paragraphs and styled quotes
- Banners and callouts for highlighting important content
- Comprehensive image formatting and layout options
- Syntax highlighting with copy button
- Mathematical formula rendering (KaTeX)
- Responsive image grids and layouts
- Interactive client components

## 🔮 Feature Roadmap
```
| Feature | Status | Description |
|---------|--------|-------------|
| ✅ Advanced image controls | Implemented | Sizing, alignment, effects |
| ✅ Code syntax highlighting | Implemented | Multiple language support |
| ✅ Image grids | Implemented | Responsive layouts |
| ✅ Custom callouts | Implemented | Informative blocks |
| ✅ Styled quotes & banners | Implemented | Enhanced typography |
| ✅ Table formatting | Implemented | Responsive data tables |
| ✅ Math formula rendering | Implemented | KaTeX integration |
| 🔄 Interactive code blocks | In development | Editable examples |
| 🔄 SVG diagram generation | In development | Code-to-diagram rendering |
| 📝 Data visualization | Planned | Chart generation from tables |
| 📝 Timeline components | Planned | Interactive concept timelines |
```
## 🔬 Real-World Examples

### Lead Paragraph

```markdown
> This introductory paragraph stands out with larger text and styling, creating visual hierarchy and establishing context for the reader before diving into detailed content.
```

Renders as:

> This introductory paragraph stands out with larger text and styling, creating visual hierarchy and establishing context for the reader before diving into detailed content.

### Styled Quote

```markdown
> *"The digital frontier isn't found. It's synthesized."*
>
> Manic Agency
```

Renders as:

> *"The digital frontier isn't found. It's synthesized."*
>
> Manic Agency

### Banner

```markdown
:::banner{backgroundColor="var(--accent-highlight)", textColor="white", icon="🚀"}
Launch into the digital frontier with our experimental platform
:::
```

Renders as a highlight banner with the specified colors and icon.

### Image Formatting

```markdown
![Neural network visualization|size=medium|align=center|effect=glow|border=gradient|caption=Synthetic neural pathway mapping](/assets/blog/neural-network.jpg)
```

Renders as an image with a glowing effect, gradient border, and caption.

### Image Grid

```markdown
<ImageGrid columns=3>
  ![Neural interface v1](/assets/blog/neural-v1.jpg)
  ![Neural interface v2](/assets/blog/neural-v2.jpg)
  ![Neural interface v3](/assets/blog/neural-v3.jpg)
</ImageGrid>
```

Renders as a responsive grid of three images in a row.

### Custom Callout

```markdown
  :::warning
  This experimental feature may produce unpredictable results when integrated with legacy systems.
  :::
```

Renders as:

:::warning
This experimental feature may produce unpredictable results when integrated with legacy systems.
:::

### Mathematical Formula

```markdown
$
f(x) = \sum_{i=0}^{n} \frac{a_i}{1 + e^{-(x-b_i)/c_i}}
$
```

Renders as a beautifully formatted mathematical equation using KaTeX.

## 🕳️ Advanced Typography Techniques

### Text Emphasis

Beyond basic markdown formatting, our platform supports:

- **Bold text** using `**double asterisks**`
- *Italic text* using `*single asterisks*`
- ***Bold italic text*** using `***triple asterisks***`
- `Inline code` using \`backticks\`
- ~~Strikethrough~~ using `~~double tildes~~`
- <mark>Highlighted text</mark> using `<mark>HTML mark tags</mark>`

### Text Alignment

You can control text alignment using HTML:

```html
<div style="text-align: center">Centered text</div>
<div style="text-align: right">Right-aligned text</div>
<div style="text-align: justify">Justified text that spans multiple lines will be spaced to align with both the left and right margins, creating clean edges on both sides.</div>
```

### Drop Caps and Typography

The first letter of the first paragraph in your content will automatically be styled as a drop cap. If you want to prevent this, add a comment `<!-- no-dropcap -->` before the paragraph.

## 🧩 Component Integration Examples

### Full Example: Image + Caption + Effects

```markdown
## Neural Interface Evolution

![Neural interface prototype|size=large|align=center|effect=glow|border=gradient|caption=Third-generation neural mapping interface with enhanced synaptic connectivity](/assets/blog/neural-interface-3.jpg)

The third-generation interface introduces quantum entanglement principles to traditional neural mapping algorithms, resulting in...
```

### Full Example: Callout + Code

```markdown
:::tip
Optimize your neural network by adjusting the activation threshold parameters.
:::

```javascript
function optimizeNetwork(network, threshold = 0.75) {
  return network.nodes.map(node => ({
    ...node,
    activation: node.signal > threshold 
      ? 'sigmoid' 
      : 'relu',
    weight: node.signal > threshold 
      ? node.weight * 1.2 
      : node.weight * 0.8
  }));
}
```
```

### Full Example: Banner + Lead Paragraph

```markdown
:::banner{backgroundColor="#7f5af0", textColor="white", icon="💡"}
New Experimental Feature: Quantum Neural Bridging
:::

>> Quantum Neural Bridging represents a paradigm shift in how synthetic systems process non-linear decision matrices. This introductory overview covers the fundamental principles and implementation considerations.
```

## 🔌 Implementation Checklist

When submitting your contribution, ensure:

- [x] Frontmatter contains all required metadata
- [x] Images are optimized and stored in the correct folder 
- [x] Formatting follows our style guidelines
- [x] Code examples are functional and documented
- [x] All links are valid and accessible
- [x] Content is original or properly attributed

## 🕳️ Transmission Protocol

We're an experimental platform operating beyond traditional disciplinary boundaries. We build the tools, systems, and theories we wish existed.

**Your anomalous contributions are welcome.** 📡

*Synthesize the unexpected.*