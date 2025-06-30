"use client";
import { useState, useEffect, Suspense } from "react";
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Grid,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton,
    Tooltip,
    Pagination,
    Button
} from "@mui/material";
import {
    Search as SearchIcon,
    ArrowBack as ArrowBackIcon,
    Edit as EditIcon,
    Visibility as ViewIcon,
    Add as AddIcon
} from "@mui/icons-material";
import useAuthAxios from "@/hooks/useAuthAxios";
import { useRouter } from 'nextjs-toploader/app';
import AlertBox from "@/components/AlertBox/page";

export default function StockListPage() {
    return (
        <Suspense fallback={
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 600 }}>
                    Loading...
                </Typography>
            </Box>
        }>
            <StockListContent />
        </Suspense>
    );
}

function StockListContent() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        search: '',
        category: 'all',
        status: 'all'
    });
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        totalCount: 0
    });
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState({ title: "", description: "" });
    
    const authAxios = useAuthAxios();
    const router = useRouter();

    const fetchProducts = async (page = 1) => {
        setLoading(true);
        const params = new URLSearchParams({
            page: page.toString(),
            limit: '10',
            ...(filters.search && { search: filters.search }),
            ...(filters.category !== 'all' && { category: filters.category }),
            ...(filters.status !== 'all' && { status: filters.status })
        });

        const data = await authAxios({
            url: process.env.NEXT_PUBLIC_API_URL + `/inventory/stock-list?${params}`,
            method: "GET"
        });
        
        if (data) {
            setProducts(data.products);
            setPagination({
                page: data.currentPage,
                totalPages: data.totalPages,
                totalCount: data.totalCount
            });
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, [filters]);

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handlePageChange = (event, page) => {
        setPagination(prev => ({ ...prev, page }));
        fetchProducts(page);
    };

    const getStockStatusColor = (status) => {
        switch (status) {
            case 'inStock': return 'success';
            case 'lowStock': return 'warning';
            case 'outOfStock': return 'error';
            default: return 'default';
        }
    };

    const getStockStatusLabel = (status) => {
        switch (status) {
            case 'inStock': return 'In Stock';
            case 'lowStock': return 'Low Stock';
            case 'outOfStock': return 'Out of Stock';
            default: return 'Unknown';
        }
    };

    const formatDate = (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: '2-digit'
        });
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={() => router.push('/Inventory')} sx={{ mr: 2 }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h4" component="h1" sx={{
                        fontWeight: 700,
                        background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        📋 Stock List
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => router.push('/Inventory/AddProduct')}
                >
                    Add Product
                </Button>
            </Box>

            {/* Filters */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Grid container spacing={3} alignItems="center">
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                label="Search Products"
                                placeholder="Search by name, SKU, or barcode"
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                InputProps={{
                                    startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 3 }}>
                            <FormControl fullWidth>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    value={filters.category}
                                    label="Category"
                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                >
                                    <MenuItem value="all">All Categories</MenuItem>
                                    <MenuItem value="Dairy">Dairy</MenuItem>
                                    <MenuItem value="Snacks">Snacks</MenuItem>
                                    <MenuItem value="Beverages">Beverages</MenuItem>
                                    <MenuItem value="Groceries">Groceries</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, md: 3 }}>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={filters.status}
                                    label="Status"
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                >
                                    <MenuItem value="all">All Status</MenuItem>
                                    <MenuItem value="active">Active</MenuItem>
                                    <MenuItem value="lowStock">Low Stock</MenuItem>
                                    <MenuItem value="outOfStock">Out of Stock</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, md: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                Total: {pagination.totalCount} products
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Products Table */}
            <Card>
                <CardContent>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Product</strong></TableCell>
                                    <TableCell><strong>SKU</strong></TableCell>
                                    <TableCell align="right"><strong>Quantity</strong></TableCell>
                                    <TableCell><strong>Unit</strong></TableCell>
                                    <TableCell><strong>Status</strong></TableCell>
                                    <TableCell><strong>Expiry</strong></TableCell>
                                    <TableCell><strong>Location</strong></TableCell>
                                    <TableCell align="center"><strong>Actions</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center">
                                            <Typography variant="body2">Loading...</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : products.length > 0 ? (
                                    products.map((product) => (
                                        <TableRow key={product._id} hover>
                                            <TableCell>
                                                <Box>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                        {product.productName}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {product.category}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                                    {product.sku}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography variant="body2" sx={{ 
                                                    fontWeight: 600,
                                                    color: product.currentStock <= 0 ? 'error.main' : 
                                                           product.currentStock <= product.lowStockThreshold ? 'warning.main' : 'text.primary'
                                                }}>
                                                    {product.currentStock}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>{product.unit}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={getStockStatusLabel(product.stockStatus)}
                                                    color={getStockStatusColor(product.stockStatus)}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>{formatDate(product.expiryDate)}</TableCell>
                                            <TableCell>{product.location}</TableCell>
                                            <TableCell align="center">
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <Tooltip title="View Details">
                                                        <IconButton 
                                                            size="small" 
                                                            color="primary"
                                                            onClick={() => router.push(`/Inventory/ProductDetails/${product._id}`)}
                                                        >
                                                            <ViewIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Edit Product">
                                                        <IconButton 
                                                            size="small" 
                                                            color="secondary"
                                                            onClick={() => router.push(`/Inventory/EditProduct/${product._id}`)}
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center">
                                            <Typography variant="body2" color="text.secondary">
                                                No products found
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                            <Pagination
                                count={pagination.totalPages}
                                page={pagination.page}
                                onChange={handlePageChange}
                                color="primary"
                                size="large"
                            />
                        </Box>
                    )}
                </CardContent>
            </Card>

            <AlertBox
                open={alertOpen}
                title={alertMessage.title}
                message={alertMessage.description}
                onClose={() => setAlertOpen(false)}
            />
        </Container>
    );
}