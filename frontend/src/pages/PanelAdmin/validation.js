export const validatePrice = (price) => {
    const priceNum = parseFloat(price);
    if (isNaN(priceNum)) {
        return "El precio debe ser un número válido.";
    }
    if (priceNum < 0) {
        return "El precio no puede ser negativo.";
    }
    // Check for max 2 decimal places
    if (!/^\d+(\.\d{1,2})?$/.test(price)) {
        return "El precio debe tener como máximo 2 decimales.";
    }
    // Check for max value (numeric(10,2) - max 8 digits before decimal)
    if (priceNum > 99999999.99) {
        return "El precio es demasiado alto.";
    }
    return null;
};

export const validateStock = (stock) => {
    const stockNum = Number(stock);
    if (isNaN(stockNum)) {
        return "El stock debe ser un número válido.";
    }
    if (!Number.isInteger(stockNum)) {
        return "El stock debe ser un número entero.";
    }
    if (stockNum < 0) {
        return "El stock no puede ser negativo.";
    }
    // Check for max value (int4 - max 2147483647)
    if (stockNum > 2147483647) {
        return "El stock es demasiado alto.";
    }
    return null;
};
