import React, { useState } from 'react';
import {
    AppBar,
    Box,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Toolbar,
    Typography,
    IconButton,
    Container,
    CssBaseline,
    useTheme,
    ListItemButton
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { BrowserRouter as Router, useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import MathGame from './MathGame';

// Centralized menu config
const menuItems = [
    { text: 'Gra matematyczna', path: '/games/math' },
    { text: 'Dummy', path: '/games/dummy' }
];

// Reusable MenuList with active item highlighting
const MenuList = ({ onItemClick = () => {}, activePath }) => {
    const theme = useTheme();

    return (
        <List>
            {menuItems.map((item, index) => {
                const isActive = activePath === item.path;

                return (
                    <ListItem key={index} disablePadding>
                        <ListItemButton
                            component={RouterLink}
                            to={item.path}
                            onClick={onItemClick}
                            sx={{
                                borderRadius: 1,
                                backgroundColor: isActive ? theme.palette.action.selected : 'inherit',
                                '&:hover': {
                                    backgroundColor: theme.palette.action.hover
                                }
                            }}
                        >
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                );
            })}
        </List>
    );
};

function AppContent() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const handleDrawerToggle = () => {
        setMobileOpen((prev) => !prev);
    };

    // Drawer with AppBar offset
    const drawer = (
        <Box sx={{ width: 220 }} role="presentation">
            <Toolbar /> {/* offsets content below AppBar */}
            <MenuList onItemClick={handleDrawerToggle} activePath={location.pathname} />
        </Box>
    );

    const renderContent = () => {
        switch (location.pathname) {
            case '/games/math':
                return <MathGame />;

            case '/games/dummy':
                return (
                    <Container maxWidth="lg">
                        <Typography variant="h4" gutterBottom>
                            Strona Dummy
                        </Typography>
                        <Typography variant="body1">To jest treść strony Dummy.</Typography>
                    </Container>
                );

            default:
                return (
                    <Container maxWidth="lg">
                        <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
                            Dostępne gry:
                        </Typography>
                        <MenuList activePath={location.pathname} />
                    </Container>
                );
        }
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            {/* AppBar */}
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography
                        variant="h6"
                        noWrap
                        sx={{ cursor: 'pointer' }}
                        onClick={() => navigate('/')}
                    >
                        Gry dla XY
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Navigation */}
            <Box component="nav" sx={{ width: { md: 220 }, flexShrink: { md: 0 } }}>
                {/* Mobile */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { width: 220 }
                    }}
                >
                    {drawer}
                </Drawer>

                {/* Desktop */}
                <Drawer
                    variant="permanent"
                    open
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': { width: 220 }
                    }}
                >
                    {drawer}
                </Drawer>
            </Box>

            {/* Main content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { md: 'calc(100% - 220px)' },
                    minHeight: '100vh',
                    backgroundColor: '#f8f9fa'
                }}
            >
                <Toolbar /> {/* pushes content below AppBar */}
                {renderContent()}
            </Box>
        </Box>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;
export { AppContent };
