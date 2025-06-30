import {
  Add,
  Dashboard,
  Description,
  ListAlt,
  Person,
} from '@mui/icons-material';
import { TbBrandAmazon, TbBuildingWarehouse, TbShoppingCart, TbUser } from "react-icons/tb";

export const getMenuItems = (pathname, searchParams) => [
  {
    id: 'dashboard',
    text: 'Dashboard',
    icon: <Dashboard fontSize="small" />,
    hasSubmenu: false,
    href: '/',
  },
  {
    id: 'Users',
    text: 'Users',
    icon: <Person fontSize="small" />,
    hasSubmenu: true,
    submenuItems: [
      { text: 'Users List', icon: <ListAlt fontSize="small" />, href: '/Users' },
      { text: 'Add New User', icon: <Description fontSize="small" />, href: '/Users/UserCreateEdit' },
      {
        text: 'Edit User',
        icon: <Description fontSize="small" />,
        href: '/Users/UserCreateEdit',
        isActive: () => pathname === '/Users/UserCreateEdit' && searchParams?.get('userId')
      }
    ]
  },
  {
    id: 'Products',
    text: 'Products',
    icon: <TbShoppingCart fontSize="20px" />,
    hasSubmenu: true,
    submenuItems: [
      { text: 'Products List', icon: <ListAlt fontSize="small" />, href: '/Products' },
      { text: 'Add Product', icon: <Add fontSize="small" />, href: '/Products/ProductCreateEdit' },
    ]
  },
  {
    id: 'Suppliers',
    text: 'Suppliers',
    icon: <TbBuildingWarehouse fontSize="20px" />,
    hasSubmenu: true,
    submenuItems: [
      { text: 'Suppliers List', icon: <ListAlt fontSize="small" />, href: '/Suppliers' },
      { text: 'Add Supplier', icon: <Add fontSize="small" />, href: '/Suppliers/SupplierCreateEdit' },
    ]
  },
  {
    id: 'Customers',
    text: 'Customers',
    icon: <TbUser fontSize="20px" />,
    hasSubmenu: true,
    submenuItems: [
      { text: 'Customers List', icon: <ListAlt fontSize="small" />, href: '/Customers' },
      { text: 'Add Customer', icon: <Add fontSize="small" />, href: '/Customers/CustomerCreateEdit' },
    ]
  },
  {
    id: 'Purchases',
    text: 'Purchases',
    icon: <TbShoppingCart fontSize="20px" />,
    hasSubmenu: true,
    submenuItems: [
      { text: 'Purchases List', icon: <ListAlt fontSize="small" />, href: '/Purchases' },
      { text: 'Add Purchase', icon: <Add fontSize="small" />, href: '/Purchases/PurchaseCreateEdit' },
    ]
  },
  {
    id: 'Brands',
    text: 'Brands',
    icon: <TbBrandAmazon fontSize="20px" />,
    hasSubmenu: true,
    submenuItems: [
      { text: 'Brands List', icon: <ListAlt fontSize="small" />, href: '/Brands' },
      { text: 'Add Brand', icon: <Add fontSize="small" />, href: '/Brands/BrandCreateEdit' },
    ]
  },
]; 