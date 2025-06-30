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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    Divider
} from "@mui/material";
import {
    ArrowBack as ArrowBackIcon,
    Download as DownloadIcon,
    Assessment as ReportIcon,
    TrendingDown as LowStockIcon,
    AccountBalance as ValuationIcon,
    SwapHoriz as MovementIcon,
    Warning as ExpiredIcon
} from "@mui/icons-material";
import useAuthAxios from "@/hooks/useAuthAxios";
import { useRouter } from 'nextjs-toploader/app';
import AlertBox from "@/components/AlertBox/page";

export default function ReportsPage() {
    return (
        <Suspense fallback={
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 600 }}>
                    Loading...
                </Typography>
            </Box>
        }>
            <ReportsContent />
        </Suspense>
    );
}

function ReportsContent() {
    const [selectedReport, setSelectedReport] = useState('lowStock');
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dateFilters, setDateFilters] = useState({
        startDate: '',
        endDate: ''
    });
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState({ title: "", description: "" });
    
    const authAxios = useAuthAxios();
    const router = useRouter();

    const reportTypes = [
        { value: 'lowStock', label: 'Low Stock Report', icon: LowStockIcon, color: 'warning' },
        { value: 'valuation', label: 'Valuation Report', icon: ValuationIcon, color: 'primary' },
        { value: 'stockMovement', label: 'Stock Movement Report', icon: MovementIcon, color: 'info' },
        { value: 'expired', label: 'Expired Stock Report', icon: ExpiredIcon, color: 'error' }
    ];

    const fetchReport = async () => {
        setLoading(true);
        const params = new URLSearchParams({
            type: selectedReport,
            ...(dateFilters.startDate && { startDate: dateFilters.startDate }),
            ...(dateFilters.endDate && { endDate: dateFilters.endDate })
        });

        const data = await authAxios({
            url: process.env.NEXT_PUBLIC_API_URL + `/inventory/reports?${params}`,
            method: "GET"
        });
        
        if (data) {
            setReportData(data);
        }
        setLoading(false);
    };

    const exportReport = async (format) => {
        const params = new URLSearchParams({
            type: selectedReport,
            format: format,
            ...(dateFilters.startDate && { startDate: dateFilters.startDate }),
            ...(dateFilters.endDate && { endDate: dateFilters.endDate })
        });

        try {
            const response = await fetch(
                process.env.NEXT_PUBLIC_API_URL + `/inventory/reports?${params}`,
                {
                    method: 'GET',
                    headers: {
                        'sessionToken': localStorage.getItem('sessionToken') || ''
                    }
                }
            );

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = `${selectedReport}-report.${format}`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                
                setAlertMessage({
                    title: "Success",
                    description: `Report exported successfully as ${format.toUpperCase()}`
                });
                setAlertOpen(true);
            }
        } catch (error) {
            setAlertMessage({
                title: "Error",
                description: "Failed to export report"
            });
            setAlertOpen(true);
        }
    };

    useEffect(() => {
        fetchReport();
    }, [selectedReport]);

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

    const renderReportContent = () => {
        if (loading) {
            return (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6">Loading report...</Typography>
                </Box>
            );
        }

        if (!reportData) {
            return (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="body1" color="text.secondary">
                        No data available
                    </Typography>
                </Box>
            );
        }

        switch (selectedReport) {
            case 'lowStock':
                return (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Product</strong></TableCell>
                                    <TableCell><strong>SKU</strong></TableCell>
                                    <TableCell align="right"><strong>Current Stock</strong></TableCell>
                                    <TableCell align="right"><strong>Low Stock Threshold</strong></TableCell>
                                    <TableCell><strong>Unit</strong></TableCell>
                                    <TableCell><strong>Location</strong></TableCell>
                                    <TableCell><strong>Category</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {reportData.items?.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{item.productName}</TableCell>
                                        <TableCell sx={{ fontFamily: 'monospace' }}>{item.sku}</TableCell>
                                        <TableCell align="right">
                                            <Typography color="error" fontWeight={600}>
                                                {item.currentStock}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">{item.lowStockThreshold}</TableCell>
                                        <TableCell>{item.unit}</TableCell>
                                        <TableCell>{item.location}</TableCell>
                                        <TableCell>
                                            <Chip label={item.category} size="small" />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                );

            case 'valuation':
                return (
                    <Box>
                        <Box sx={{ mb: 3, p: 3, bgcolor: 'primary.50', borderRadius: 2 }}>
                            <Typography variant="h4" color="primary" fontWeight="bold">
                                {formatCurrency(reportData.totalValue)}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Total Inventory Value
                            </Typography>
                        </Box>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>Category</strong></TableCell>
                                        <TableCell align="right"><strong>Product Count</strong></TableCell>
                                        <TableCell align="right"><strong>Total Quantity</strong></TableCell>
                                        <TableCell align="right"><strong>Total Value</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {reportData.categories?.map((category, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <Chip label={category._id} color="primary" variant="outlined" />
                                            </TableCell>
                                            <TableCell align="right">{category.productCount}</TableCell>
                                            <TableCell align="right">{category.totalQuantity}</TableCell>
                                            <TableCell align="right">
                                                <Typography fontWeight={600}>
                                                    {formatCurrency(category.totalValue)}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                );

            case 'stockMovement':
                return (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Product</strong></TableCell>
                                    <TableCell><strong>SKU</strong></TableCell>
                                    <TableCell><strong>Type</strong></TableCell>
                                    <TableCell align="right"><strong>Quantity</strong></TableCell>
                                    <TableCell><strong>Supplier</strong></TableCell>
                                    <TableCell><strong>Location</strong></TableCell>
                                    <TableCell><strong>Date</strong></TableCell>
                                    <TableCell><strong>Note</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {reportData.movements?.map((movement, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{movement.productName}</TableCell>
                                        <TableCell sx={{ fontFamily: 'monospace' }}>{movement.sku}</TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={movement.type === 'in' ? 'Stock In' : 'Stock Out'}
                                                color={movement.type === 'in' ? 'success' : 'error'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="right">{movement.quantity}</TableCell>
                                        <TableCell>{movement.supplier || '-'}</TableCell>
                                        <TableCell>{movement.location}</TableCell>
                                        <TableCell>{formatDate(movement.createdAt)}</TableCell>
                                        <TableCell>{movement.note || '-'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                );

            case 'expired':
                return (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Product</strong></TableCell>
                                    <TableCell><strong>SKU</strong></TableCell>
                                    <TableCell align="right"><strong>Quantity</strong></TableCell>
                                    <TableCell><strong>Unit</strong></TableCell>
                                    <TableCell><strong>Expiry Date</strong></TableCell>
                                    <TableCell><strong>Location</strong></TableCell>
                                    <TableCell align="right"><strong>Value Lost</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {reportData.items?.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{item.productName}</TableCell>
                                        <TableCell sx={{ fontFamily: 'monospace' }}>{item.sku}</TableCell>
                                        <TableCell align="right">
                                            <Typography color="error" fontWeight={600}>
                                                {item.currentStock}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{item.unit}</TableCell>
                                        <TableCell>
                                            <Typography color="error">
                                                {formatDate(item.expiryDate)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{item.location}</TableCell>
                                        <TableCell align="right">
                                            <Typography color="error" fontWeight={600}>
                                                {formatCurrency(item.currentStock * item.avgPurchasePrice)}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                );

            default:
                return null;
        }
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
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
                    📝 Inventory Reports
                </Typography>
            </Box>

            {/* Report Type Selection */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {reportTypes.map((report) => {
                    const IconComponent = report.icon;
                    return (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={report.value}>
                            <Button
                                fullWidth
                                variant={selectedReport === report.value ? 'contained' : 'outlined'}
                                color={report.color}
                                onClick={() => setSelectedReport(report.value)}
                                startIcon={<IconComponent />}
                                sx={{ py: 2, height: '100%' }}
                            >
                                {report.label}
                            </Button>
                        </Grid>
                    );
                })}
            </Grid>

            {/* Filters and Actions */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Grid container spacing={3} alignItems="center">
                        {(selectedReport === 'stockMovement') && (
                            <>
                                <Grid size={{ xs: 12, md: 3 }}>
                                    <TextField
                                        fullWidth
                                        label="Start Date"
                                        type="date"
                                        value={dateFilters.startDate}
                                        onChange={(e) => setDateFilters(prev => ({ ...prev, startDate: e.target.value }))}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 3 }}>
                                    <TextField
                                        fullWidth
                                        label="End Date"
                                        type="date"
                                        value={dateFilters.endDate}
                                        onChange={(e) => setDateFilters(prev => ({ ...prev, endDate: e.target.value }))}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 2 }}>
                                    <Button
                                        variant="outlined"
                                        onClick={fetchReport}
                                        fullWidth
                                    >
                                        Apply Filter
                                    </Button>
                                </Grid>
                            </>
                        )}
                        
                        <Grid size={{ xs: 12, md: selectedReport === 'stockMovement' ? 2 : 6 }}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    variant="contained"
                                    startIcon={<DownloadIcon />}
                                    onClick={() => exportReport('csv')}
                                    color="success"
                                >
                                    Export CSV
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<DownloadIcon />}
                                    onClick={() => exportReport('pdf')}
                                >
                                    Export PDF
                                </Button>
                            </Box>
                        </Grid>

                        <Grid size={{ xs: 12, md: selectedReport === 'stockMovement' ? 2 : 6 }}>
                            <Typography variant="body2" color="text.secondary" textAlign="right">
                                {reportData?.totalItems && `Total Items: ${reportData.totalItems}`}
                                {reportData?.totalMovements && `Total Movements: ${reportData.totalMovements}`}
                                {reportData?.categories && `Categories: ${reportData.categories.length}`}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Report Content */}
            <Card>
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                        <ReportIcon sx={{ mr: 1 }} />
                        {reportTypes.find(r => r.value === selectedReport)?.label}
                    </Typography>
                    
                    {renderReportContent()}
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