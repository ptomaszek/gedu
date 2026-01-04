# Docker Jekyll Development

## Commands

```bash
# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Restart
docker-compose restart

# Rebuild
docker-compose up --build
```

## Live Reload

- ✅ File watching: Automatic change detection
- ✅ Live reload: Browser auto-refresh
- ✅ Livereload: Real-time updates

## Development Workflow

1. Start server: `docker-compose up`
2. Edit files in your editor
3. Watch automatic rebuild in terminal
4. Browser auto-refreshes at http://localhost:4000

## Troubleshooting

```bash
# Port in use
lsof -i :4000
kill -9 <PID>

# Permission issues
sudo chown -R $USER:$USER .

# Clear cache
docker-compose down --volumes
docker-compose up --build
```

## Production

- Development: Live reload, port 4000
- Production: GitHub Pages deployment via Git
