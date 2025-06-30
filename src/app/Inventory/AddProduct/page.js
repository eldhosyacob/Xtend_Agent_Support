"use client";
import { useState, Suspense } from "react";
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
    Divider
} from "@mui/material";
import {
    ArrowBack as ArrowBackIcon,
    Save as SaveIcon,
    Inventory as InventoryIcon
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import useAuthAxios from "@/hooks/useAuthAxios";
import { useRouter } from 'nextjs-toploader/app';
import AlertBox from "@/components/AlertBox/page";

export default function AddProductPage() {
    return (
        <Suspense fallback={
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 600 }}>
                    Loading...
                </Typography>
            </Box>
        }>
            <AddProductContent />
        </Suspense>
    );
}

function AddProductContent() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState({ title: "", description: "", redirect: null });
    
    const authAxios = useAuthAxios();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset
    } = useForm({
        defaultValues: {
            productName: '',
            sku: '',
            barcode: '',
            category: '',
            unit: '',
            currentStock: 0,
            lowStockThreshold: 10,
            avgPurchasePrice: 0,
            sellingPrice: 0,
            location: 'Main Store',
            expiryDate: '',
            description: ''
        }
    });

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        
        const response = await authAxios({
            url: process.env.NEXT_PUBLIC_API_URL + "/inventory/add-product",
            method: "POST",
            data: data
        });

        if (response) {
            setAlertMessage({
                title: "Success",
                description: "Product added successfully!",
                redirect: "/Inventory/StockList"
            });
            setAlertOpen(true);
            reset();
        }
        setIsSubmitting(false);
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                <IconButton onClick={() => router.push('/Inventory/StockList')} sx={{ mr: 2 }}>
                    <ArrowBackIcon />
                </IconButton>
                <InventoryIcon sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
                <Typography variant="h4" component="h1" sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    Add New Product
                </Typography>
            </Box>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Card>
                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="h6" sx={{ mb: 3 }}>
                            Product Information
                        </Typography>

                        <Grid container spacing={3}>
                            {/* Product Name */}
                            <Grid size={{ xs: 12, md: 8 }}>
                                <TextField
                                    {...register("productName", { required: "Product name is required" })}
                                    label="Product Name"
                                    fullWidth
                                    error={!!errors.productName}
                                    helperText={errors.productName?.message}
                                />
                            </Grid>

                            {/* SKU */}
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    {...register("sku", { required: "SKU is required" })}
                                    label="SKU"
                                    fullWidth
                                    error={!!errors.sku}
                                    helperText={errors.sku?.message}
                                />
                            </Grid>

                            {/* Barcode */}
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    {...register("barcode")}
                                    label="Barcode (Optional)"
                                    fullWidth
                                />
                            </Grid>

                            {/* Category */}
                            <Grid size={{ xs: 12, md: 6 }}>
                                <FormControl fullWidth error={!!errors.category}>
                                    <InputLabel>Category</InputLabel>
                                    <Controller
                                        name="category"
                                        control={control}
                                        rules={{ required: "Category is required" }}
                                        render={({ field }) => (
                                            <Select {...field} label="Category">
                                                <MenuItem value="Dairy">Dairy</MenuItem>
                                                <MenuItem value="Snacks">Snacks</MenuItem>
                                                <MenuItem value="Beverages">Beverages</MenuItem>
                                                <MenuItem value="Groceries">Groceries</MenuItem>
                                                <MenuItem value="Frozen Foods">Frozen Foods</MenuItem>
                                                <MenuItem value="Personal Care">Personal Care</MenuItem>
                                                <MenuItem value="Household">Household</MenuItem>
                                            </Select>
                                        )}
                                    />
                                    {errors.category && (
                                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                                            {errors.category.message}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>

                            {/* Unit */}
                            <Grid size={{ xs: 12, md: 6 }}>
                                <FormControl fullWidth error={!!errors.unit}>
                                    <InputLabel>Unit</InputLabel>
                                    <Controller
                                        name="unit"
                                        control={control}
                                        rules={{ required: "Unit is required" }}
                                        render={({ field }) => (
                                            <Select {...field} label="Unit">
                                                <MenuItem value="pcs">Pieces</MenuItem>
                                                <MenuItem value="kg">Kilograms</MenuItem>
                                                <MenuItem value="gm">Grams</MenuItem>
                                                <MenuItem value="ltr">Liters</MenuItem>
                                                <MenuItem value="ml">Milliliters</MenuItem>
                                                <MenuItem value="box">Boxes</MenuItem>
                                                <MenuItem value="pack">Packs</MenuItem>
                                            </Select>
                                        )}
                                    />
                                    {errors.unit && (
                                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                                            {errors.unit.message}
                                        </Typography>
                                    )}
                                </FormControl>
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
                        </Grid>

                        <Divider sx={{ my: 4 }} />

                        <Typography variant="h6" sx={{ mb: 3 }}>
                            Stock Information
                        </Typography>

                        <Grid container spacing={3}>
                            {/* Current Stock */}
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    {...register("currentStock", { 
                                        valueAsNumber: true,
                                        min: { value: 0, message: "Stock cannot be negative" }
                                    })}
                                    label="Initial Stock"
                                    type="number"
                                    fullWidth
                                    error={!!errors.currentStock}
                                    helperText={errors.currentStock?.message}
                                />
                            </Grid>

                            {/* Low Stock Threshold */}
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    {...register("lowStockThreshold", { 
                                        valueAsNumber: true,
                                        min: { value: 1, message: "Threshold must be at least 1" }
                                    })}
                                    label="Low Stock Threshold"
                                    type="number"
                                    fullWidth
                                    error={!!errors.lowStockThreshold}
                                    helperText={errors.lowStockThreshold?.message}
                                />
                            </Grid>

                            {/* Expiry Date */}
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    {...register("expiryDate")}
                                    label="Expiry Date (Optional)"
                                    type="date"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 4 }} />

                        <Typography variant="h6" sx={{ mb: 3 }}>
                            Pricing Information
                        </Typography>

                        <Grid container spacing={3}>
                            {/* Purchase Price */}
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    {...register("avgPurchasePrice", { 
                                        valueAsNumber: true,
                                        min: { value: 0, message: "Price cannot be negative" }
                                    })}
                                    label="Average Purchase Price"
                                    type="number"
                                    step="0.01"
                                    fullWidth
                                    InputProps={{ startAdornment: '₹' }}
                                    error={!!errors.avgPurchasePrice}
                                    helperText={errors.avgPurchasePrice?.message}
                                />
                            </Grid>

                            {/* Selling Price */}
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    {...register("sellingPrice", { 
                                        valueAsNumber: true,
                                        min: { value: 0, message: "Price cannot be negative" }
                                    })}
                                    label="Selling Price"
                                    type="number"
                                    step="0.01"
                                    fullWidth
                                    InputProps={{ startAdornment: '₹' }}
                                    error={!!errors.sellingPrice}
                                    helperText={errors.sellingPrice?.message}
                                />
                            </Grid>

                            {/* Description */}
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    {...register("description")}
                                    label="Description (Optional)"
                                    multiline
                                    rows={3}
                                    fullWidth
                                    placeholder="Additional product details..."
                                />
                            </Grid>
                        </Grid>

                        {/* Submit Buttons */}
                        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Button
                                variant="outlined"
                                onClick={() => router.push('/Inventory/StockList')}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={<SaveIcon />}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Adding Product...' : 'Add Product'}
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