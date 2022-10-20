import React from "react";
import { Box } from "@mui/material";
import "../css/Header.css";

const Header = ({children}) => {
    return (
        <Box className="header">
            <Box className="header-title">
                <img src="/Logo.png" alt="XFlix-icon" />
            </Box>
            {children}
        </Box>
    );
};

export default Header;