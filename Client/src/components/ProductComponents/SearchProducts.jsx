import { useContext, useState } from "react";
import PropTypes from "prop-types";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
    Menu,
    MenuItem,
    IconButton,
    Drawer,
} from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import { ProductContext } from "../../context/ProductProvider";
import ProductList from "./ProductList";

export default function SearchProducts({ query, handleInputChange }) {

    const { filter, setFilter } = useContext(ProductContext);

    const [anchorEl, setAnchorEl] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const open = Boolean(anchorEl);
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = (value) => {
        if (value) setFilter(value);
        setAnchorEl(null);
    };

    return (
        <>
            <motion.div
                className="w-full pt-2 px-3 lg:px-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >

                <div className="px-2 py-2 bg-white dark:bg-gray-500/20 text-gray-800 dark:text-white shadow-sm rounded-md flex items-center gap-2 transition-colors duration-300">
                    <div className="flex flex-1 items-center w-full md:w-2/3 gap-2">
                        <button onClick={() => setIsSidebarOpen(true)} className="flex md:hidden p-[5px] hover:bg-gray-500/10 border border-gray-500/50 rounded-md cursor-pointer">
                            <KeyboardArrowRightIcon className="text-gray-700 dark:text-white" />
                        </button>

                        <div className="relative w-full">
                            <input
                                type="text"
                                value={query}
                                onChange={handleInputChange}
                                placeholder="Search products..."
                                className="w-full pl-4 pr-10 py-1.5 rounded-md bg-gray-100 dark:bg-[#1f1f1f] text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none transition-colors duration-300"
                            />
                            <SearchIcon
                                sx={{ fontSize: "1.2rem" }}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300"
                            />
                        </div>

                    </div>

                    <div className="flex items-center w-fit border border-gray-500/50 rounded-md">
                        <IconButton
                            onClick={handleClick}
                            className="p-1.5"
                        >
                            <FilterListIcon className="text-gray-700 dark:text-white" sx={{ fontSize: "1.3rem" }} />
                        </IconButton>
                        <span className="ml-2 text-sm pe-2 hidden md:flex">{filter}</span>

                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={() => handleClose(null)}
                        >
                            {["Clear", "Most Reviews", "Most Likes", "Sort by: Rating", "Price: Low to High", "Price: High to Low"].map((option) => (
                                <MenuItem
                                    key={option}
                                    onClick={() => handleClose(option === "Clear" ? "Sort By" : option)}
                                    className="hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    {option}
                                </MenuItem>
                            ))}
                        </Menu>
                    </div>
                </div>
            </motion.div>

            <Drawer open={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} >
                <div className="w-60 p-4 bg-white dark:bg-black/90 h-full overflow-auto transition-colors duration-500" >
                    <ProductList />
                </div>
            </Drawer>
        </>
    )
}

SearchProducts.propTypes = {
  query: PropTypes.string.isRequired,
  handleInputChange: PropTypes.func.isRequired,
};
