import React from "react";
import { Box } from "@mui/material";
import styles from "./FormLayout.module.scss";
const FormLayout = ({ children, image_url }) => {
  return (
    <Box className={styles.form_layout_container}>
      <Box
        className={styles.layout_image}
        sx={{
          backgroundImage: `url(${image_url})`,
        }}
      />
      <Box>{children}</Box>
    </Box>
  );
};

export default FormLayout;
