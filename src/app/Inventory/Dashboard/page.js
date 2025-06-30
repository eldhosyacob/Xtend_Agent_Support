"use client";
import { useState, useEffect, Suspense } from "react";
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Grid,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton,
    Tooltip
} from "@mui/material";
import {
    Inventory as InventoryIcon,
    TrendingUp as TrendingUpIcon,
    Warning as WarningIcon,
    Error as ErrorIcon,
    AttachMoney as MoneyIcon,
    Add as AddIcon,
    SwapHoriz as TransferIcon,
    Assessment as ReportIcon,
    Refresh as RefreshIcon
} from "@mui/icons-material";
import useAuthAxios from "@/hooks/useAuthAxios";
import { useRouter } from 'nextjs-toploader/app';
import AlertBox from "@/components/AlertBox/page";

export default function InventoryDashboard() {
    return (
        <Suspense fallback={
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 600 }}>
                    Loading...
                </Typography>
            </Box>
        }>
            <InventoryDashboardContent />
        </Suspense>
    );
}

function InventoryDashboardContent() {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState({ title: "", description: "" });
    const authAxios = useAuthAxios();
    const router = useRouter();

    const fetchDashboardData = async () => {
        setLoading(true);
        const data = await authAxios({
            url: process.env.NEXT_PUBLIC_API_URL + "/inventory/dashboard",
            method: "GET"
        });
        
        if (data) {
            setDashboardData(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: '2-digit'
        });
    };

    const getStockStatusColor = (type) => {
        switch (type) {
            case 'in': return 'success';
            case 'out': return 'error';
            default: return 'default';
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 600 }}>
                    Loading Dashboard...
                </Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <InventoryIcon sx={{ 
                        fontSize: 40, 
                        color: 'primary.main',
                        mr: 2
                    }} />
                    <Typography variant="h4" component="h1" sx={{
                        fontWeight: 700,
                        background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Inventory Dashboard
                    </Typography>
                </Box>
                <Tooltip title="Refresh Data">
                    <IconButton onClick={fetchDashboardData} color="primary">
                        <RefreshIcon />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card sx={{ 
                        background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                        color: 'white',
                        height: '100%'
                    }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <TrendingUpIcon sx={{ mr: 1 }} />
                                <Typography variant="h6" component="div">
                                    In Stock
                                </Typography>
                            </Box>
                            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                                {dashboardData?.stats?.inStock || 0}
                            </Typography>
                            <Typography variant="body2">
                                Products available
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card sx={{ 
                        background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
                        color: 'white',
                        height: '100%'
                    }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <WarningIcon sx={{ mr: 1 }} />
                                <Typography variant="h6" component="div">
                                    Low Stock
                                </Typography>
                            </Box>
                            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                                {dashboardData?.stats?.lowStock || 0}
                            </Typography>
                            <Typography variant="body2">
                                Need restocking
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card sx={{ 
                        background: 'linear-gradient(135deg, #f44336 0%, #ef5350 100%)',
                        color: 'white',
                        height: '100%'
                    }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <ErrorIcon sx={{ mr: 1 }} />
                                <Typography variant="h6" component="div">
                                    Out of Stock
                                </Typography>
                            </Box>
                            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                                {dashboardData?.stats?.outOfStock || 0}
                            </Typography>
                            <Typography variant="body2">
                                Urgent restock needed
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card sx={{ 
                        background: 'linear-gradient(135deg, #2196f3 0%, #42a5f5 100%)',
                        color: 'white',
                        height: '100%'
                    }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <MoneyIcon sx={{ mr: 1 }} />
                                <Typography variant="h6" component="div">
                                    Inventory Value
                                </Typography>
                            </Box>
                            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                                {formatCurrency(dashboardData?.inventoryValue || 0)}
                            </Typography>
                            <Typography variant="body2">
                                Total stock value
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box sx={{ mb: 4 }}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 4, md: 3 }}>
                        <Button
                            variant="contained"
                            fullWidth
                            startIcon={<AddIcon />}
                            onClick={() => router.push('/Inventory/StockMovement')}
                            sx={{ py: 2 }}
                        >
                            Add Stock
                        </Button>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4, md: 3 }}>
                        <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<TransferIcon />}
                            onClick={() => router.push('/Inventory/StockList')}
                            sx={{ py: 2 }}
                        >
                            Stock List
                        </Button>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4, md: 3 }}>
                        <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<ReportIcon />}
                            onClick={() => router.push('/Inventory/Reports')}
                            sx={{ py: 2 }}
                        >
                            Reports
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            {/* Recent Stock Movements */}
            <Card>
                <CardContent>
                    <Typography variant="h6" component="div" sx={{ mb: 3, fontWeight: 600 }}>
                        📋 Recent Stock Movements
                    </Typography>
                    
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Product</strong></TableCell>
                                    <TableCell><strong>Type</strong></TableCell>
                                    <TableCell align="right"><strong>Quantity</strong></TableCell>
                                    <TableCell><strong>Date</strong></TableCell>
                                    <TableCell><strong>Supplier</strong></TableCell>
                                    <TableCell><strong>Note</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {dashboardData?.recentMovements?.length > 0 ? 
                                    dashboardData.recentMovements.map((movement, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{movement.productName}</TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={movement.type === 'in' ? 'Stock In' : 'Stock Out'}
                                                    color={getStockStatusColor(movement.type)}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell align="right">{movement.quantity}</TableCell>
                                            <TableCell>{formatDate(movement.date)}</TableCell>
                                            <TableCell>{movement.supplier || '-'}</TableCell>
                                            <TableCell>{movement.note || '-'}</TableCell>
                                        </TableRow>
                                    )) :
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            <Typography variant="body2" color="text.secondary">
                                                No recent stock movements
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
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