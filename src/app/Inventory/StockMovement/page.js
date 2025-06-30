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
    Button,
    IconButton,
    Autocomplete,
    FormControlLabel,
    Switch,
    Divider
} from "@mui/material";
import {
    ArrowBack as ArrowBackIcon,
    Save as SaveIcon,
    Add as AddIcon,
    Remove as RemoveIcon
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import useAuthAxios from "@/hooks/useAuthAxios";
import { useRouter } from 'nextjs-toploader/app';
import AlertBox from "@/components/AlertBox/page";

export default function StockMovementPage() {
    return (
        <Suspense fallback={
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 600 }}>
                    Loading...
                </Typography>
            </Box>
        }>
            <StockMovementContent />
        </Suspense>
    );
}

function StockMovementContent() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState({ title: "", description: "", redirect: null });
    
    const authAxios = useAuthAxios();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues: {
            type: 'in',
            quantity: '',
            supplier: '',
            purchasePrice: '',
            batchNo: '',
            expiryDate: '',
            location: 'Main Store',
            note: ''
        }
    });

    const watchType = watch('type');

    const fetchProducts = async (searchTerm = '') => {
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        
        const data = await authAxios({
            url: process.env.NEXT_PUBLIC_API_URL + `/inventory/products?${params}`,
            method: "GET"
        });
        
        if (data) {
            setProducts(data);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const onSubmit = async (data) => {
        if (!selectedProduct) {
            setAlertMessage({
                title: "Error",
                description: "Please select a product first."
            });
            setAlertOpen(true);
            return;
        }

        setIsSubmitting(true);
        
        const requestData = {
            ...data,
            productId: selectedProduct._id,
            quantity: parseInt(data.quantity),
            purchasePrice: data.purchasePrice ? parseFloat(data.purchasePrice) : null
        };

        const response = await authAxios({
            url: process.env.NEXT_PUBLIC_API_URL + "/inventory/stock-movement",
            method: "POST",
            data: requestData
        });

        if (response) {
            setAlertMessage({
                title: "Success",
                description: `Stock ${data.type === 'in' ? 'added' : 'removed'} successfully!`,
                redirect: "/Inventory"
            });
            setAlertOpen(true);
        }
        setIsSubmitting(false);
    };

    const handleProductSearch = async (event, value) => {
        if (value && value.length > 2) {
            await fetchProducts(value);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
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
                    ➕ Stock Movement
                </Typography>
            </Box>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Card>
                    <CardContent sx={{ p: 4 }}>
                        {/* Stock Type */}
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                Movement Type
                            </Typography>
                            <Controller
                                name="type"
                                control={control}
                                render={({ field }) => (
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <Button
                                            variant={field.value === 'in' ? 'contained' : 'outlined'}
                                            onClick={() => field.onChange('in')}
                                            startIcon={<AddIcon />}
                                            color="success"
                                            size="large"
                                        >
                                            Stock In
                                        </Button>
                                        <Button
                                            variant={field.value === 'out' ? 'contained' : 'outlined'}
                                            onClick={() => field.onChange('out')}
                                            startIcon={<RemoveIcon />}
                                            color="error"
                                            size="large"
                                        >
                                            Stock Out
                                        </Button>
                                    </Box>
                                )}
                            />
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        <Grid container spacing={3}>
                            {/* Product Selection */}
                            <Grid size={{ xs: 12 }}>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Product Information
                                </Typography>
                                <Autocomplete
                                    options={products}
                                    getOptionLabel={(option) => `${option.productName} (${option.sku})`}
                                    value={selectedProduct}
                                    onChange={(event, newValue) => setSelectedProduct(newValue)}
                                    onInputChange={handleProductSearch}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Search Product"
                                            placeholder="Type to search products..."
                                            error={!selectedProduct && errors.productId}
                                            helperText={!selectedProduct && errors.productId && "Product is required"}
                                            fullWidth
                                        />
                                    )}
                                    renderOption={(props, option) => (
                                        <Box component="li" {...props}>
                                            <Box>
                                                <Typography variant="subtitle2">
                                                    {option.productName}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    SKU: {option.sku} | Current Stock: {option.currentStock} {option.unit}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    )}
                                />
                            </Grid>

                            {/* Current Stock Display */}
                            {selectedProduct && (
                                <Grid size={{ xs: 12 }}>
                                    <Card variant="outlined" sx={{ bgcolor: 'grey.50' }}>
                                        <CardContent>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Current Stock Information
                                            </Typography>
                                            <Typography variant="h6">
                                                {selectedProduct.currentStock} {selectedProduct.unit}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Average Price: ₹{selectedProduct.avgPurchasePrice || 0}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )}

                            {/* Quantity */}
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    {...register("quantity", { 
                                        required: "Quantity is required",
                                        min: { value: 1, message: "Quantity must be at least 1" }
                                    })}
                                    label="Quantity"
                                    type="number"
                                    fullWidth
                                    error={!!errors.quantity}
                                    helperText={errors.quantity?.message}
                                />
                            </Grid>

                            {/* Location */}
                            <Grid size={{ xs: 12, md: 6 }}>
                                <FormControl fullWidth>
                                    <InputLabel>Location</InputLabel>
                                    <Controller
                                        name="location"
                                        control={control}
                                        render={({ field }) => (
                                            <Select {...field} label="Location">
                                                <MenuItem value="Main Store">Main Store</MenuItem>
                                                <MenuItem value="Branch 1">Branch 1</MenuItem>
                                                <MenuItem value="Branch 2">Branch 2</MenuItem>
                                                <MenuItem value="Warehouse">Warehouse</MenuItem>
                                            </Select>
                                        )}
                                    />
                                </FormControl>
                            </Grid>

                            {/* Supplier (for stock in) */}
                            {watchType === 'in' && (
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        {...register("supplier")}
                                        label="Supplier"
                                        fullWidth
                                    />
                                </Grid>
                            )}

                            {/* Purchase Price (for stock in) */}
                            {watchType === 'in' && (
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        {...register("purchasePrice")}
                                        label="Purchase Price (Optional)"
                                        type="number"
                                        step="0.01"
                                        fullWidth
                                        helperText="Per unit price"
                                    />
                                </Grid>
                            )}

                            {/* Batch Number (for stock in) */}
                            {watchType === 'in' && (
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        {...register("batchNo")}
                                        label="Batch Number"
                                        fullWidth
                                    />
                                </Grid>
                            )}

                            {/* Expiry Date (for stock in) */}
                            {watchType === 'in' && (
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        {...register("expiryDate")}
                                        label="Expiry Date"
                                        type="date"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                            )}

                            {/* Note */}
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    {...register("note")}
                                    label="Note"
                                    multiline
                                    rows={3}
                                    fullWidth
                                    placeholder="Optional note about this stock movement"
                                />
                            </Grid>
                        </Grid>

                        {/* Submit Button */}
                        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Button
                                variant="outlined"
                                onClick={() => router.push('/Inventory')}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={<SaveIcon />}
                                disabled={isSubmitting}
                                color={watchType === 'in' ? 'success' : 'error'}
                            >
                                {isSubmitting ? 'Processing...' : 
                                 watchType === 'in' ? 'Add Stock' : 'Remove Stock'}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </form>

            <AlertBox
                open={alertOpen}
                title={alertMessage.title}
                message={alertMessage.description}
                redirect={alertMessage.redirect}
                onClose={() => setAlertOpen(false)}
            />
        </Container>
    );
} 