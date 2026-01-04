# Jekyll Docker Site

A minimalist Jekyll website built with Docker for local development and GitHub Pages deployment.

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/ptomaszek/xy.git
   cd xy
   ```

2. **Start the development server**
   ```bash
   docker-compose up
   ```

3. **Open your browser**
   Visit [http://localhost:4000](http://localhost:4000) to see your site

4. **Make changes**
   Edit files in your favorite editor - changes are automatically detected and the site rebuilds

## 📁 Project Structure

```
xy/
├── _config.yml              # Jekyll configuration
├── Gemfile                  # Ruby dependencies
├── docker-compose.yml       # Docker configuration
├── DOCKER.md               # Docker development guide
├── README.md               # This file
├── index.html              # Home page
├── _layouts/               # Layout templates
│   └── default.html
├── _includes/              # Reusable components
│   ├── header.html
│   └── footer.html
├── _sass/                  # SCSS stylesheets
│   ├── _variables.scss
│   ├── _base.scss
│   ├── _layout.scss
│   ├── _components.scss
│   └── _utilities.scss
├── assets/
│   ├── css/
│   │   └── main.scss
│   └── js/
│       └── main.js
└── pages/                  # Additional pages
    ├── about.md
    ├── projects.md
    └── contact.md
```

## 🛠️ Development Commands

### Basic Commands
```bash
# Start development server with live reload
docker-compose up

# Start in background
docker-compose up -d

# Stop server
docker-compose down

# View logs
docker-compose logs -f
```

### Docker Management
```bash
# Access container shell
docker-compose exec jekyll bash

# Rebuild containers
docker-compose up --build

# View container status
docker-compose ps

# Clean up unused resources
docker system prune -f
```

### File Watching
- ✅ **Live Reload**: Automatic browser refresh on file changes
- ✅ **Force Polling**: Works with mounted volumes
- ✅ **File Watching**: Detects changes to all supported file types

## 🎨 Design Features

- **Minimalist Design**: Clean, modern aesthetic
- **Responsive**: Works on all device sizes
- **SCSS**: Maintainable, organized stylesheets
- **JavaScript**: Interactive features and functionality
- **Accessibility**: WCAG compliant markup and ARIA attributes

## 🌐 Deployment

### GitHub Pages

1. **Configure GitHub Pages**
   - Go to your repository settings
   - Navigate to "Pages" section
   - Select "Deploy from a branch" and choose your branch
   - Set "Root directory" to `/ (root)`
   - Save

2. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Update site"
   git push origin main
   ```

3. **View Live Site**
   Your site will be available at `https://username.github.io/repository-name`

### Custom Domain (Optional)

1. Create a `CNAME` file in the root:
   ```
   your-domain.com
   ```

2. Configure DNS records to point to GitHub Pages

## 🔧 Configuration

### Jekyll Settings (`_config.yml`)

- **Site Title**: `title`
- **Description**: `description`
- **URL**: `url`
- **Base URL**: `baseurl`
- **Theme**: `jekyll-theme-primer`
- **Plugins**: Various Jekyll plugins for SEO, pagination, etc.

### Docker Settings (`docker-compose.yml`)

- **Image**: `jekyll/jekyll:latest`
- **Port**: `4000`
- **Volume**: Mounts current directory to `/srv/jekyll`
- **Live Reload**: Enabled with `--livereload`
- **Force Polling**: Works with mounted volumes

## 🎯 Features

### Core Features
- ✅ **Docker-based development**
- ✅ **Live reload during development**
- ✅ **GitHub Pages ready**
- ✅ **Responsive design**
- ✅ **SEO optimized**
- ✅ **Accessibility features**

### Advanced Features
- 📝 **SCSS compilation**
- 🎨 **Customizable theme**
- 🔍 **Search functionality ready**
- 📱 **Mobile-first design**
- 🚀 **Performance optimized**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with `docker-compose up`
5. Commit and push your changes
6. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

For issues and questions:

1. Check the [DOCKER.md](DOCKER.md) guide
2. Review the [GitHub Issues](https://github.com/ptomaszek/xy/issues)
3. Open a new issue with detailed information

## 🙏 Acknowledgments

- [Jekyll](https://jekyllrb.com/) - Static site generator
- [Docker](https://www.docker.com/) - Containerization
- [GitHub Pages](https://pages.github.com/) - Free hosting
- [Inter Font](https://rsms.me/inter/) - Beautiful typeface

---

Built with ❤️ using Jekyll, Docker, and GitHub Pages. Happy coding! 🚀
